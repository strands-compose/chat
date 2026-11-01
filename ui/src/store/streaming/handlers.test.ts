// @vitest-environment jsdom
// mapBackendEvent comes from api.ts, which reads the app-base meta tag on import.
import { beforeEach, describe, expect, it } from 'vitest';
import type { BackendStreamEvent, ChatStreamEvent, Message, TurnTokens, WorkflowItem } from '@/types';
import { mapBackendEvent } from '@/services/api';
import { events as demoTurn } from '@/services/demo-fixtures/events';
import { dispatchStreamEvent, resetStreamingState } from '.';
import type { StreamingSideEffects } from '.';

// ====== HELPERS ======

/** A StreamingSideEffects that records what the handlers hand to the store. */
interface Recorder extends StreamingSideEffects {
  commits: Partial<Message>[];
  sessionStarts: (string | undefined)[];
  sessionEnds: { trace: WorkflowItem[]; tokens: TurnTokens }[];
}

function makeRecorder(): Recorder {
  const recorder: Recorder = {
    commits: [],
    sessionStarts: [],
    sessionEnds: [],
    scheduleFlush: () => {},
    cancelFlush: () => {},
    commitFinal: (patch) => recorder.commits.push(patch),
    onSessionStart: (sessionId) => recorder.sessionStarts.push(sessionId),
    onSessionEnd: (trace, tokens) => recorder.sessionEnds.push({ trace, tokens }),
  };
  return recorder;
}

function dispatchAll(events: ChatStreamEvent[], effects: StreamingSideEffects): void {
  for (const event of events) dispatchStreamEvent(event, effects);
}

/** Map backend events the way streamChat does, dropping unmapped ones. */
function mapAll(raw: BackendStreamEvent[]): ChatStreamEvent[] {
  return raw.flatMap((event) => mapBackendEvent(event) ?? []);
}

const ev = (event: ChatStreamEvent): ChatStreamEvent => event;

/** The single session_end snapshot a turn must produce. */
function endOf(recorder: Recorder): { trace: WorkflowItem[]; tokens: TurnTokens } {
  expect(recorder.sessionEnds).toHaveLength(1);
  return recorder.sessionEnds[0];
}

const textOf = (trace: WorkflowItem[], agentName: string): WorkflowItem[] =>
  trace.filter((item) => item.type === 'text' && item.agentName === agentName);

beforeEach(() => resetStreamingState());

// ====== recorded multi-agent turn ======

describe('recorded multi-agent turn', () => {
  it('commits one successful turn that adopts the backend session id', () => {
    const effects = makeRecorder();

    dispatchAll(mapAll(demoTurn), effects);

    expect(effects.sessionStarts).toEqual(['a5ddcafd-f7d1-4581-994b-9132d4aaccd6']);
    expect(effects.commits).toEqual([{ isStreaming: false }]);
    expect(effects.sessionEnds).toHaveLength(1);
  });

  it('ends with the entry agent final answer and keeps sub-agent text apart', () => {
    const effects = makeRecorder();

    dispatchAll(mapAll(demoTurn), effects);

    const { trace } = endOf(effects);
    const mainTexts = textOf(trace, 'MAIN');
    const finalText = mainTexts[mainTexts.length - 1].content;
    expect(finalText).toMatch(/^Perfect! Now I have all the pieces\./);
    expect(finalText).toMatch(/bedrock-agentcore\s*$/);
    // Sub-agent answers are separate items, never merged into the entry agent's text.
    expect(textOf(trace, 'DOC EXPERT').length).toBeGreaterThan(0);
    expect(textOf(trace, 'DEVELOPER').length).toBeGreaterThan(0);
    expect(finalText).not.toContain('Key Technical Building Blocks\n\n### **Tools — Agent capabilities**');
  });

  it('closes every tool item and keeps the failed one as an error', () => {
    const effects = makeRecorder();

    dispatchAll(mapAll(demoTurn), effects);

    const tools = endOf(effects).trace.filter((item) => item.type === 'tool');
    expect(tools).toHaveLength(12);
    expect(tools.filter((tool) => tool.toolStatus === 'running')).toEqual([]);
    expect(tools.filter((tool) => tool.toolStatus === 'error')).toHaveLength(1);
    expect(tools.filter((tool) => tool.toolStatus === 'success')).toHaveLength(11);
  });

  it('shows tool names without underscores and every tool with its use id', () => {
    const effects = makeRecorder();

    dispatchAll(mapAll(demoTurn), effects);

    const tools = endOf(effects).trace.filter((item) => item.type === 'tool');
    expect(tools.some((tool) => tool.toolName === 'list docs')).toBe(true);
    expect(tools.every((tool) => !tool.toolName?.includes('_'))).toBe(true);
    expect(tools.every((tool) => Boolean(tool.toolUseId))).toBe(true);
  });

  it('records the set of agents that took part', () => {
    const effects = makeRecorder();

    dispatchAll(mapAll(demoTurn), effects);

    const agents = new Set(endOf(effects).trace.map((item) => item.agentName));
    expect(agents).toEqual(new Set(['MAIN', 'DOC EXPERT', 'DEVELOPER']));
  });

  it('sums token usage across the agent_complete events', () => {
    const effects = makeRecorder();

    dispatchAll(mapAll(demoTurn), effects);

    expect(endOf(effects).tokens).toEqual({
      input: 61_441,
      output: 6_393,
      cacheRead: 81_920,
      cacheWrite: 9_216,
    });
  });

  it('puts each agent total on its stop item so the panel can show it', () => {
    const effects = makeRecorder();

    dispatchAll(mapAll(demoTurn), effects);

    const stops = endOf(effects).trace.filter((item) => item.type === 'agent_stop');
    const mainStop = stops.find((item) => item.agentName === 'MAIN');
    // input + output + cache read + cache write of the entry agent's agent_complete.
    expect(mainStop?.totalTokens).toBe(19_362 + 3_227 + 20_480 + 3_072);
  });

  it('starts every sub-agent run once and stops it once per run', () => {
    const effects = makeRecorder();

    dispatchAll(mapAll(demoTurn), effects);

    const { trace } = endOf(effects);
    const count = (type: string, agent: string) =>
      trace.filter((item) => item.type === type && item.agentName === agent).length;
    expect(count('agent_start', 'DOC EXPERT')).toBe(3);
    expect(count('agent_stop', 'DOC EXPERT')).toBe(3);
    expect(count('agent_start', 'DEVELOPER')).toBe(1);
    expect(count('agent_stop', 'DEVELOPER')).toBe(1);
  });

  it('ignores events that arrive after session_end', () => {
    const effects = makeRecorder();
    const mapped = mapAll(demoTurn);

    dispatchAll(mapped, effects);
    dispatchStreamEvent(ev({ type: 'error', content: 'late' }), effects);

    expect(effects.commits).toEqual([{ isStreaming: false }]);
  });
});

// ====== error handling ======

describe('error events', () => {
  it('commits a failed turn immediately, without waiting for session_end', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'token', content: 'partial', agent_name: 'main' }),
        ev({ type: 'error', content: 'Model unavailable', agent_name: 'main' }),
      ],
      effects,
    );

    expect(effects.commits).toEqual([
      { content: 'Model unavailable', isStreaming: false, isSuccess: false },
    ]);
  });

  it('commits only the first error and ignores later errors and the trailing session_end commit', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'error', content: 'first' }),
        ev({ type: 'error', content: 'second' }),
        ev({ type: 'session_end' }),
        ev({ type: 'error', content: 'third' }),
      ],
      effects,
    );

    expect(effects.commits).toEqual([{ content: 'first', isStreaming: false, isSuccess: false }]);
  });

  it('hands the steps and tokens from before an error to the trailing session_end', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'agent_start', agent_name: 'main' }),
        ev({ type: 'tool_start', name: 'get_weather', tool_use_id: 'u1', input: {}, agent_name: 'main' }),
        ev({ type: 'tool_end', name: 'get_weather', tool_use_id: 'u1', output: 'sunny', status: 'success', agent_name: 'main' }),
        ev({ type: 'agent_complete', agent_name: 'main', input_tokens: 100, output_tokens: 20 }),
        ev({ type: 'error', content: 'Model throttled.', agent_name: 'main' }),
        ev({ type: 'session_end', agent_name: 'main' }),
      ],
      effects,
    );

    const { trace, tokens } = endOf(effects);
    expect(trace.filter((item) => item.type === 'tool')).toEqual([
      expect.objectContaining({ toolName: 'get weather', toolStatus: 'success' }),
    ]);
    expect(tokens).toMatchObject({ input: 100, output: 20 });
    expect(effects.commits).toEqual([{ content: 'Model throttled.', isStreaming: false, isSuccess: false }]);
  });

  it('uses a generic message when the error has no text', () => {
    const effects = makeRecorder();

    dispatchStreamEvent(ev({ type: 'error' }), effects);

    expect(effects.commits).toEqual([
      { content: 'Unknown error', isStreaming: false, isSuccess: false },
    ]);
  });

  it('does not carry an error into the next turn after the state is reset', () => {
    const effects = makeRecorder();
    dispatchStreamEvent(ev({ type: 'error', content: 'turn one failed' }), effects);

    resetStreamingState();
    dispatchAll([ev({ type: 'token', content: 'ok', agent_name: 'main' }), ev({ type: 'session_end' })], effects);

    expect(effects.commits).toEqual([
      { content: 'turn one failed', isStreaming: false, isSuccess: false },
      { isStreaming: false },
    ]);
  });
});

// ====== individual handlers ======

describe('stream handlers', () => {
  it('appends consecutive tokens of one agent to a single text item', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'token', content: 'Hel', agent_name: 'writer' }),
        ev({ type: 'token', content: 'lo', agent_name: 'writer' }),
        ev({ type: 'session_end' }),
      ],
      effects,
    );

    const texts = endOf(effects).trace.filter((item) => item.type === 'text');
    expect(texts).toHaveLength(1);
    expect(texts[0]).toMatchObject({ content: 'Hello', agentName: 'WRITER' });
  });

  it('keeps interleaved tokens of parallel agents in separate items', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'token', content: 'A1 ', agent_name: 'alpha' }),
        ev({ type: 'token', content: 'B1 ', agent_name: 'beta' }),
        ev({ type: 'token', content: 'A2', agent_name: 'alpha' }),
        ev({ type: 'token', content: 'B2', agent_name: 'beta' }),
        ev({ type: 'session_end' }),
      ],
      effects,
    );

    const { trace } = endOf(effects);
    expect(textOf(trace, 'ALPHA').map((item) => item.content)).toEqual(['A1 A2']);
    expect(textOf(trace, 'BETA').map((item) => item.content)).toEqual(['B1 B2']);
  });

  it('starts a new text item after a tool call interrupts the agent', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'token', content: 'before', agent_name: 'main' }),
        ev({ type: 'tool_start', name: 'lookup_data', tool_use_id: 'u1', input: {}, agent_name: 'main' }),
        ev({ type: 'tool_end', name: 'lookup_data', tool_use_id: 'u1', output: 'ok', status: 'success', agent_name: 'main' }),
        ev({ type: 'token', content: 'after', agent_name: 'main' }),
        ev({ type: 'session_end' }),
      ],
      effects,
    );

    expect(endOf(effects).trace.map((item) => item.type)).toEqual(['text', 'tool', 'text']);
  });

  it('closes the matching tool by use id when two agents run the same tool', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'tool_start', name: 'search', tool_use_id: 'u1', agent_name: 'alpha' }),
        ev({ type: 'tool_start', name: 'search', tool_use_id: 'u2', agent_name: 'beta' }),
        ev({ type: 'tool_end', name: 'search', tool_use_id: 'u1', output: 'first', status: 'success', agent_name: 'alpha' }),
        ev({ type: 'session_end' }),
      ],
      effects,
    );

    const tools = endOf(effects).trace.filter((item) => item.type === 'tool');
    expect(tools.find((tool) => tool.toolUseId === 'u1')).toMatchObject({ toolStatus: 'success', toolOutput: 'first' });
    expect(tools.find((tool) => tool.toolUseId === 'u2')).toMatchObject({ toolStatus: 'running' });
  });

  it('closes a tool by name and agent when the backend sends no use id', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'tool_start', name: 'read_doc', agent_name: 'alpha' }),
        ev({ type: 'tool_end', name: 'read_doc', output: 'text', status: 'success', agent_name: 'alpha' }),
        ev({ type: 'session_end' }),
      ],
      effects,
    );

    expect(endOf(effects).trace[0]).toMatchObject({ type: 'tool', toolName: 'read doc', toolStatus: 'success', toolOutput: 'text' });
  });

  it('marks a failed tool as an error and keeps its message', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'tool_start', name: 'search', tool_use_id: 'u1', agent_name: 'main' }),
        ev({ type: 'tool_end', name: 'search', tool_use_id: 'u1', output: 'timed out', status: 'error', agent_name: 'main' }),
        ev({ type: 'tool_start', name: 'fetch', tool_use_id: 'u2', agent_name: 'main' }),
        ev({ type: 'tool_end', name: 'fetch', tool_use_id: 'u2', status: 'error', agent_name: 'main' }),
        ev({ type: 'session_end' }),
      ],
      effects,
    );

    const tools = endOf(effects).trace.filter((item) => item.type === 'tool');
    expect(tools[0]).toMatchObject({ toolStatus: 'error', toolOutput: 'timed out' });
    expect(tools[1]).toMatchObject({ toolStatus: 'error', toolOutput: 'Unknown error' });
  });

  it('collapses back-to-back start events of one agent into one separator', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'node_start', node_id: 'writer', agent_name: 'graph' }),
        ev({ type: 'agent_start', agent_name: 'writer' }),
        ev({ type: 'session_end' }),
      ],
      effects,
    );

    const starts = endOf(effects).trace.filter((item) => item.type === 'agent_start');
    expect(starts).toHaveLength(1);
    expect(starts[0].agentName).toBe('WRITER');
  });

  it('flags an orchestrator start and records handoff targets', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'multiagent_start', agent_name: 'swarm' }),
        ev({ type: 'handoff', agent_name: 'writer', to_node_ids: ['code_reviewer'] }),
        ev({ type: 'session_end' }),
      ],
      effects,
    );

    const { trace } = endOf(effects);
    expect(trace[0]).toMatchObject({ type: 'agent_start', isOrchestrator: true });
    expect(trace[1]).toMatchObject({ type: 'handoff', handoffTargets: ['CODE REVIEWER'] });
  });

  it('does not count orchestrator usage in the turn totals', () => {
    const effects = makeRecorder();

    dispatchAll(
      [
        ev({ type: 'agent_complete', agent_name: 'writer', input_tokens: 5, output_tokens: 7 }),
        ev({ type: 'multiagent_complete', agent_name: 'swarm', input_tokens: 5, output_tokens: 7 }),
        ev({ type: 'session_end' }),
      ],
      effects,
    );

    expect(endOf(effects).tokens).toEqual({ input: 5, output: 7, cacheRead: 0, cacheWrite: 0 });
  });

  it('commits a successful turn with no content when the stream has no events but session_end', () => {
    const effects = makeRecorder();

    dispatchStreamEvent(ev({ type: 'session_end' }), effects);

    expect(effects.commits).toEqual([{ isStreaming: false }]);
    expect(endOf(effects)).toEqual({
      trace: [],
      tokens: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    });
  });
});
