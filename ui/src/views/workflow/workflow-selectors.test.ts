import { describe, expect, it } from 'vitest';
import type { ChatStore, Message, TurnTokens, WorkflowItem } from '@/types';
import {
  agentNameSet,
  buildAgentRuns,
  selectWorkflowStatus,
  selectWorkflowTokens,
  selectWorkflowTrace,
  summarizeAgents,
} from './workflow-selectors';
import type { AgentRun } from './workflow-types';

// ---------- builders (agent names are display-normalized: upper case, spaces) ----------

const start = (agentName: string, isOrchestrator?: boolean): WorkflowItem => ({
  type: 'agent_start',
  content: '',
  agentName,
  isOrchestrator,
});
const stop = (agentName: string, totalTokens?: number): WorkflowItem => ({
  type: 'agent_stop',
  content: '',
  agentName,
  totalTokens,
});
const text = (agentName: string | undefined, content: string): WorkflowItem => ({
  type: 'text',
  content,
  agentName,
});
const tool = (
  agentName: string,
  toolName: string,
  toolStatus: WorkflowItem['toolStatus'] = 'running',
): WorkflowItem => ({ type: 'tool', content: '', agentName, toolName, toolStatus });

/** Every run in the tree, nested ones included. */
function allRuns(runs: AgentRun[]): AgentRun[] {
  return runs.flatMap((run) => [run, ...allRuns([...run.children.values()].flat())]);
}

// ---------- buildAgentRuns ----------

describe('buildAgentRuns', () => {
  it('returns no runs for an empty trace', () => {
    expect(buildAgentRuns([])).toEqual([]);
  });

  it('builds one run per agent activation and groups consecutive items of the same type', () => {
    const a = text('MAIN', 'one');
    const b = text('MAIN', 'two');
    const t = tool('MAIN', 'search', 'success');
    const c = text('MAIN', 'three');
    const runs = buildAgentRuns([start('MAIN'), a, b, t, c, stop('MAIN', 120)]);

    expect(runs).toHaveLength(1);
    expect(runs[0]).toMatchObject({
      agentName: 'MAIN',
      hasEnded: true,
      totalTokens: 120,
      isOrchestrator: false,
    });
    expect(runs[0].groups.map((g) => [g.type, g.items])).toEqual([
      ['text', [a, b]],
      ['tool', [t]],
      ['text', [c]],
    ]);
  });

  it('keeps the run open while the agent has not stopped', () => {
    const [run] = buildAgentRuns([start('MAIN'), text('MAIN', 'partial')]);
    expect(run.hasEnded).toBe(false);
    expect(run.totalTokens).toBeUndefined();
  });

  it('marks runs of agents flagged as orchestrators', () => {
    const runs = buildAgentRuns([start('ORCH', true), start('WORKER'), text('WORKER', 'x')]);
    expect(runs.map((r) => [r.agentName, r.isOrchestrator])).toEqual([
      ['ORCH', true],
      ['WORKER', false],
    ]);
  });

  it('opens a new run when an agent starts again after stopping', () => {
    const runs = buildAgentRuns([
      start('MAIN'),
      text('MAIN', 'a'),
      stop('MAIN'),
      start('MAIN'),
      text('MAIN', 'b'),
    ]);
    expect(runs).toHaveLength(2);
    expect(runs.map((r) => r.hasEnded)).toEqual([true, false]);
  });

  it('ignores a duplicate start while the agent is open and a stop for an agent that never started', () => {
    const runs = buildAgentRuns([stop('GHOST'), start('MAIN'), start('MAIN'), text('MAIN', 'x')]);
    expect(runs).toHaveLength(1);
    expect(runs[0].agentName).toBe('MAIN');
  });

  it('starts a run for an agent whose first item is not a start', () => {
    const runs = buildAgentRuns([tool('MAIN', 'search')]);
    expect(runs).toHaveLength(1);
    expect(runs[0]).toMatchObject({ agentName: 'MAIN', hasEnded: false });
  });

  it('keeps agents streaming in parallel in separate lanes', () => {
    const runs = buildAgentRuns([
      start('A'),
      start('B'),
      text('A', 'a1'),
      text('B', 'b1'),
      text('A', 'a2'),
    ]);
    expect(runs.map((r) => r.agentName)).toEqual(['A', 'B']);
    expect(runs[0].groups).toHaveLength(1);
    expect(runs[0].groups[0].items.map((i) => i.content)).toEqual(['a1', 'a2']);
    expect(runs[1].groups[0].items.map((i) => i.content)).toEqual(['b1']);
  });

  it('collects unattributed items in a nameless run at the end', () => {
    const runs = buildAgentRuns([text(undefined, 'orphan'), start('MAIN'), text('MAIN', 'x')]);
    expect(runs.map((r) => r.agentName)).toEqual(['MAIN', undefined]);
    expect(runs[1]).toMatchObject({ key: 'unattributed', hasEnded: false, isOrchestrator: false });
    expect(runs[1].groups[0].items[0].content).toBe('orphan');
  });

  describe('delegation', () => {
    it('nests a sub-agent run under the tool call that launched it and lets the delegator continue', () => {
      const delegate = tool('MAIN', 'doc expert');
      const answer = text('DOC EXPERT', 'answer');
      const after = text('MAIN', 'summary');
      const runs = buildAgentRuns([
        start('MAIN'),
        text('MAIN', 'before'),
        delegate,
        start('DOC EXPERT'),
        answer,
        stop('DOC EXPERT', 50),
        after,
        stop('MAIN', 200),
      ]);

      expect(runs).toHaveLength(1);
      const main = runs[0];
      expect(main.groups.map((g) => g.type)).toEqual(['text', 'tool', 'text']);
      expect(main.groups[2].items).toEqual([after]);

      const children = main.children.get(delegate) ?? [];
      expect(children).toHaveLength(1);
      expect(children[0]).toMatchObject({
        agentName: 'DOC EXPERT',
        hasEnded: true,
        totalTokens: 50,
      });
      expect(children[0].groups[0].items).toEqual([answer]);
    });

    it('matches the tool name to the agent name case-insensitively', () => {
      const delegate = tool('MAIN', 'Doc Expert');
      const runs = buildAgentRuns([
        start('MAIN'),
        delegate,
        start('DOC EXPERT'),
        stop('DOC EXPERT'),
      ]);
      expect(runs).toHaveLength(1);
      expect(runs[0].children.get(delegate)).toHaveLength(1);
    });

    it('matches repeated calls to the same sub-agent first-in-first-out', () => {
      const first = tool('MAIN', 'worker');
      const second = tool('MAIN', 'worker');
      const runs = buildAgentRuns([
        start('MAIN'),
        first,
        second,
        start('WORKER'),
        stop('WORKER'),
        start('WORKER'),
        stop('WORKER'),
      ]);
      expect(runs).toHaveLength(1);
      expect(runs[0].children.get(first)).toHaveLength(1);
      expect(runs[0].children.get(second)).toHaveLength(1);
    });

    it('skips calls that already failed when matching a sub-agent run', () => {
      const rejected = tool('MAIN', 'worker', 'error');
      const accepted = tool('MAIN', 'worker');
      const runs = buildAgentRuns([
        start('MAIN'),
        rejected,
        accepted,
        start('WORKER'),
        stop('WORKER'),
      ]);
      expect(runs[0].children.has(rejected)).toBe(false);
      expect(runs[0].children.get(accepted)).toHaveLength(1);
    });

    it('keeps an unmatched sub-agent top-level and gives the delegator a fresh run after it ends', () => {
      const runs = buildAgentRuns([
        start('MAIN'),
        text('MAIN', 'before'),
        tool('MAIN', 'worker', 'error'),
        start('WORKER'),
        text('WORKER', 'work'),
        stop('WORKER'),
        text('MAIN', 'after'),
      ]);
      expect(runs.map((r) => r.agentName)).toEqual(['MAIN', 'WORKER', 'MAIN']);
      expect(runs[0].groups.map((g) => g.type)).toEqual(['text', 'tool']);
      expect(runs[2].groups[0].items.map((i) => i.content)).toEqual(['after']);
      expect(allRuns(runs).every((r) => r.children.size === 0)).toBe(true);
    });

    it('does not nest a tool call that names no agent in the trace', () => {
      const plain = tool('MAIN', 'search');
      const runs = buildAgentRuns([start('MAIN'), plain, start('OTHER')]);
      expect(runs.map((r) => r.agentName)).toEqual(['MAIN', 'OTHER']);
      expect(runs[0].children.size).toBe(0);
    });

    it('nests multiple levels deep', () => {
      const toB = tool('A', 'b');
      const toC = tool('B', 'c');
      const runs = buildAgentRuns([
        start('A'),
        toB,
        start('B'),
        toC,
        start('C'),
        stop('C'),
        stop('B'),
        stop('A'),
      ]);
      const b = runs[0].children.get(toB)?.[0];
      const c = b?.children.get(toC)?.[0];
      expect([runs.length, b?.agentName, c?.agentName]).toEqual([1, 'B', 'C']);
    });
  });

  it('gives every run a unique key that stays the same as the trace grows', () => {
    const delegate = tool('MAIN', 'worker');
    const trace: WorkflowItem[] = [
      start('MAIN'),
      delegate,
      start('WORKER'),
      text('WORKER', 'x'),
      stop('WORKER'),
      text('MAIN', 'y'),
      stop('MAIN'),
      start('MAIN'),
      text('MAIN', 'z'),
      text(undefined, 'orphan'),
    ];
    const finalKeys = allRuns(buildAgentRuns(trace)).map((r) => r.key);
    expect(new Set(finalKeys).size).toBe(finalKeys.length);

    for (let n = 1; n < trace.length; n++) {
      const prefixKeys = allRuns(buildAgentRuns(trace.slice(0, n))).map((r) => r.key);
      for (const key of prefixKeys) expect(finalKeys).toContain(key);
    }
  });
});

// ---------- summarizeAgents / agentNameSet ----------

describe('summarizeAgents', () => {
  it('lists agents in order of first start with their run counts', () => {
    const summaries = summarizeAgents([
      start('MAIN'),
      start('WORKER'),
      stop('WORKER'),
      start('WORKER'),
      text('MAIN', 'ignored'),
    ]);
    expect(summaries.map((s) => [s.agentName, s.runCount])).toEqual([
      ['MAIN', 1],
      ['WORKER', 2],
    ]);
  });

  it('ignores items that are not starts and starts without a name', () => {
    expect(
      summarizeAgents([
        text('MAIN', 'x'),
        tool('MAIN', 'search'),
        stop('MAIN'),
        { type: 'agent_start', content: '' },
      ]),
    ).toEqual([]);
  });

  it('flags an agent as orchestrator if any of its starts says so', () => {
    const summaries = summarizeAgents([
      start('ORCH'),
      start('ORCH', true),
      start('PLAIN'),
      start('PLAIN', false),
    ]);
    expect(summaries.map((s) => [s.agentName, s.isOrchestrator])).toEqual([
      ['ORCH', true],
      ['PLAIN', false],
    ]);
  });

  it('gives each agent a distinct palette colour and cycles after five agents', () => {
    const names = ['A', 'B', 'C', 'D', 'E', 'F'];
    const colors = summarizeAgents(names.map((n) => start(n))).map((s) => s.color);
    expect(new Set(colors.slice(0, 5)).size).toBe(5);
    expect(colors[5]).toBe(colors[0]);
  });

  it('keeps an agent colour when the trace grows', () => {
    const before = summarizeAgents([start('A'), start('B')]);
    const after = summarizeAgents([start('A'), start('B'), start('C'), stop('A'), start('A')]);
    expect(after.slice(0, 2).map((s) => s.color)).toEqual(before.map((s) => s.color));
  });
});

describe('agentNameSet', () => {
  it('holds the upper-cased names of the summarised agents', () => {
    const summaries = summarizeAgents([start('DOC EXPERT'), start('MAIN')]);
    expect(agentNameSet(summaries)).toEqual(new Set(['DOC EXPERT', 'MAIN']));
    expect(agentNameSet([])).toEqual(new Set());
  });

  it('recognises a delegation tool name written in any case', () => {
    const names = agentNameSet(summarizeAgents([start('DOC EXPERT')]));
    expect(names.has('doc expert'.toUpperCase())).toBe(true);
    expect(names.has('SEARCH')).toBe(false);
  });
});

// ---------- selectWorkflowTrace / selectWorkflowTokens ----------

type SelectorState = Pick<
  ChatStore,
  | 'isLoading'
  | 'activeWorkflowItems'
  | 'activeWorkflowTokens'
  | 'selectedWorkflowSeq'
  | 'messages'
  | 'messageOrder'
  | 'workflowTraces'
  | 'workflowTokens'
>;

const tokens = (input: number): TurnTokens => ({ input, output: 0, cacheRead: 0, cacheWrite: 0 });
const LIVE_ITEMS = [text('MAIN', 'live')];
const LIVE_TOKENS = tokens(1);
const TRACE_2 = [text('MAIN', 'turn two')];
const TRACE_4 = [text('MAIN', 'turn four')];
const message = (id: string, role: Message['role'], seq?: number): Message => ({
  id,
  role,
  content: id,
  seq,
});

/** The same chat without the unsaved last turn. */
const SAVED_ONLY: Partial<SelectorState> = {
  messages: {
    u1: message('u1', 'user', 1),
    a2: message('a2', 'assistant', 2),
    u3: message('u3', 'user', 3),
    a4: message('a4', 'assistant', 4),
  },
  messageOrder: ['u1', 'a2', 'u3', 'a4'],
};

/** A finished chat with assistant turns at seq 2 and 4, a user message at seq 3 and an unsaved assistant message. */
function makeState(overrides: Partial<SelectorState> = {}): ChatStore {
  const base: SelectorState = {
    isLoading: false,
    activeWorkflowItems: [],
    activeWorkflowTokens: LIVE_TOKENS,
    selectedWorkflowSeq: null,
    messages: {
      u1: message('u1', 'user', 1),
      a2: message('a2', 'assistant', 2),
      u3: message('u3', 'user', 3),
      a4: message('a4', 'assistant', 4),
      u5: message('u5', 'user', 5),
      pending: message('pending', 'assistant'),
    },
    messageOrder: ['u1', 'a2', 'u3', 'a4', 'u5', 'pending'],
    workflowTraces: { 2: TRACE_2, 4: TRACE_4 },
    workflowTokens: { 2: tokens(20), 4: tokens(40) },
  };
  return { ...base, ...overrides } as ChatStore;
}

describe('selectWorkflowTrace', () => {
  it.each([[null], [undefined]])('is empty for %s state', (state) => {
    expect(selectWorkflowTrace(state)).toEqual({ items: [], isStreaming: false });
  });

  it('shows the live buffer while a turn is running, even when a past turn is selected', () => {
    const state = makeState({
      isLoading: true,
      activeWorkflowItems: LIVE_ITEMS,
      selectedWorkflowSeq: 2,
    });
    const selection = selectWorkflowTrace(state);
    expect(selection.isStreaming).toBe(true);
    expect(selection.items).toBe(LIVE_ITEMS);
  });

  it('reports streaming with an empty trace before the first item arrives', () => {
    expect(selectWorkflowTrace(makeState({ isLoading: true }))).toEqual({
      items: [],
      isStreaming: true,
    });
  });

  it('keeps showing the live buffer after the turn ends, ahead of a stale selection', () => {
    const state = makeState({ activeWorkflowItems: LIVE_ITEMS, selectedWorkflowSeq: 2 });
    const selection = selectWorkflowTrace(state);
    expect(selection.isStreaming).toBe(false);
    expect(selection.items).toBe(LIVE_ITEMS);
  });

  it('shows the stored trace of the selected turn when nothing is live', () => {
    const selection = selectWorkflowTrace(makeState({ selectedWorkflowSeq: 2 }));
    expect(selection).toEqual({ items: TRACE_2, isStreaming: false });
  });

  it('falls back to the newest assistant turn when none is selected', () => {
    expect(selectWorkflowTrace(makeState(SAVED_ONLY)).items).toBe(TRACE_4);
  });

  it('shows nothing from older turns when the newest turn was never saved (a failed send)', () => {
    expect(selectWorkflowTrace(makeState())).toEqual({ items: [], isStreaming: false });
  });

  it('is empty when no assistant message has a seq yet', () => {
    const state = makeState({
      messages: { u1: message('u1', 'user', 1), pending: message('pending', 'assistant') },
      messageOrder: ['u1', 'pending'],
    });
    expect(selectWorkflowTrace(state)).toEqual({ items: [], isStreaming: false });
  });

  it('is empty when the selected turn has no stored trace', () => {
    expect(selectWorkflowTrace(makeState({ selectedWorkflowSeq: 99 })).items).toEqual([]);
  });
});

describe('selectWorkflowTokens', () => {
  it.each([[null], [undefined]])('is undefined for %s state', (state) => {
    expect(selectWorkflowTokens(state)).toBeUndefined();
  });

  it('returns the live totals while a turn is running, even when a past turn is selected', () => {
    expect(selectWorkflowTokens(makeState({ isLoading: true, selectedWorkflowSeq: 2 }))).toBe(
      LIVE_TOKENS,
    );
  });

  it('returns the live totals after the turn ends while the live trace is still held', () => {
    const state = makeState({ activeWorkflowItems: LIVE_ITEMS, selectedWorkflowSeq: 2 });
    expect(selectWorkflowTokens(state)).toBe(LIVE_TOKENS);
  });

  it('returns the stored totals of the selected turn when nothing is live', () => {
    const state = makeState({ selectedWorkflowSeq: 2 });
    expect(selectWorkflowTokens(state)).toBe(state.workflowTokens[2]);
  });

  it('falls back to the newest assistant turn when none is selected', () => {
    const state = makeState(SAVED_ONLY);
    expect(selectWorkflowTokens(state)).toBe(state.workflowTokens[4]);
  });

  it('returns the live totals when the newest turn was never saved', () => {
    expect(selectWorkflowTokens(makeState())).toBe(LIVE_TOKENS);
  });

  it('returns the live totals when there is no assistant turn to select', () => {
    const state = makeState({ messages: {}, messageOrder: [] });
    expect(selectWorkflowTokens(state)).toBe(LIVE_TOKENS);
  });

  it('is undefined when the selected turn has no recorded totals', () => {
    expect(selectWorkflowTokens(makeState({ selectedWorkflowSeq: 99 }))).toBeUndefined();
  });
});

describe('selectWorkflowStatus', () => {
  const failed = (id: string, seq?: number): Message => ({
    ...message(id, 'assistant', seq),
    isSuccess: false,
  });

  it.each([[null], [undefined]])('has no message and reports success for %s state', (state) => {
    expect(selectWorkflowStatus(state)).toEqual({ messageId: null, isSuccess: true });
  });

  it('reports no message while a turn is running', () => {
    expect(selectWorkflowStatus(makeState({ isLoading: true, selectedWorkflowSeq: 2 }))).toEqual({
      messageId: null,
      isSuccess: true,
    });
  });

  it('follows the selected turn and its outcome', () => {
    const state = makeState({
      selectedWorkflowSeq: 2,
      messages: { ...makeState().messages, a2: failed('a2', 2) },
    });
    expect(selectWorkflowStatus(state)).toEqual({ messageId: 'a2', isSuccess: false });
  });

  it('falls back to the newest saved turn when none is selected', () => {
    expect(selectWorkflowStatus(makeState(SAVED_ONLY))).toEqual({
      messageId: 'a4',
      isSuccess: true,
    });
  });

  it('reports a failed send as an error even though it was never saved', () => {
    const state = makeState({ messages: { ...makeState().messages, pending: failed('pending') } });
    expect(selectWorkflowStatus(state)).toEqual({ messageId: 'pending', isSuccess: false });
  });

  it('has no message when the chat has no assistant turn', () => {
    expect(selectWorkflowStatus(makeState({ messages: {}, messageOrder: [] }))).toEqual({
      messageId: null,
      isSuccess: true,
    });
  });
});
