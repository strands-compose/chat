import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { WorkflowItem } from '@/types';
import { selectLiveActivity } from './live-activity';

const start = (agentName: string): WorkflowItem => ({
  type: 'agent_start',
  content: '',
  agentName,
});
const stop = (agentName: string): WorkflowItem => ({ type: 'agent_stop', content: '', agentName });
const tool = (
  agentName: string | undefined,
  toolName: string | undefined,
  toolStatus: WorkflowItem['toolStatus'],
  toolInput?: unknown,
): WorkflowItem => ({ type: 'tool', content: '', agentName, toolName, toolStatus, toolInput });

describe('selectLiveActivity', () => {
  it('has nothing to show for an empty trace or one with no open agent or running tool', () => {
    expect(selectLiveActivity([])).toBeNull();
    expect(selectLiveActivity([{ type: 'text', content: 'hi', agentName: 'MAIN' }])).toBeNull();
    expect(selectLiveActivity([start('MAIN'), stop('MAIN')])).toBeNull();
  });

  it('names the agent and the running tool when a plain tool is in flight', () => {
    const items = [start('MAIN'), tool('MAIN', 'read doc', 'running')];
    expect(selectLiveActivity(items)).toEqual({
      agentLabel: 'Main',
      detail: 'is running read doc',
    });
  });

  it('ignores tools that already finished', () => {
    const items = [
      start('MAIN'),
      tool('MAIN', 'read doc', 'success'),
      tool('MAIN', 'search', 'error'),
    ];
    expect(selectLiveActivity(items)).toEqual({ agentLabel: 'Main', detail: 'is working' });
  });

  it('skips a running tool item that has no name', () => {
    const items = [start('MAIN'), tool('MAIN', undefined, 'running')];
    expect(selectLiveActivity(items)).toEqual({ agentLabel: 'Main', detail: 'is working' });
  });

  describe('delegation to a sub-agent', () => {
    const delegating = (input: unknown): WorkflowItem[] => [
      start('MAIN'),
      tool('MAIN', 'doc expert', 'running', input),
      start('DOC EXPERT'),
    ];

    it('shows the sub-agent answering the question passed as a string input', () => {
      expect(selectLiveActivity(delegating('What is a cache?'))).toEqual({
        agentLabel: 'Doc Expert',
        detail: 'is answering “What is a cache?”',
      });
    });

    it('takes the first string value of an object input as the question', () => {
      expect(
        selectLiveActivity(delegating({ limit: 3, question: 'Why?', other: 'ignored' }))?.detail,
      ).toBe('is answering “Why?”');
    });

    it.each([
      ['no input', undefined],
      ['an input without strings', { limit: 3, nested: { q: 'x' } }],
      ['an empty string', ''],
      ['a number', 42],
      ['null', null],
    ])('falls back to "is working" for %s', (_label, input) => {
      expect(selectLiveActivity(delegating(input))?.detail).toBe('is working');
    });

    it('matches the tool to the agent regardless of case', () => {
      const items = [start('DOC EXPERT'), tool('MAIN', 'Doc Expert', 'running', 'q')];
      expect(selectLiveActivity(items)).toEqual({
        agentLabel: 'Doc Expert',
        detail: 'is answering “q”',
      });
    });

    it('clips a long question to 42 characters with an ellipsis and leaves 42 untouched', () => {
      const long = selectLiveActivity(delegating('a'.repeat(100)));
      expect(long?.detail).toBe(`is answering “${'a'.repeat(42)}…”`);
      const exact = selectLiveActivity(delegating('b'.repeat(42)));
      expect(exact?.detail).toBe(`is answering “${'b'.repeat(42)}”`);
    });

    it('does not leave a space before the ellipsis when the cut lands after a space', () => {
      const question = `${'a'.repeat(41)} tail that is cut off`;
      expect(selectLiveActivity(delegating(question))?.detail).toBe(
        `is answering “${'a'.repeat(41)}…”`,
      );
    });
  });

  it('prefers the most recent running tool', () => {
    const items = [
      start('MAIN'),
      tool('MAIN', 'doc expert', 'running', 'old question'),
      start('DOC EXPERT'),
      tool('DOC EXPERT', 'read doc', 'running'),
    ];
    expect(selectLiveActivity(items)).toEqual({
      agentLabel: 'Doc Expert',
      detail: 'is running read doc',
    });
  });

  it('prefers a running tool over an open agent', () => {
    const items = [start('MAIN'), tool('MAIN', 'search', 'running'), start('WORKER')];
    expect(selectLiveActivity(items)?.detail).toBe('is running search');
  });

  describe('with no running tool', () => {
    it('reports the most recently started agent that is still open', () => {
      const items = [start('MAIN'), start('DOC EXPERT')];
      expect(selectLiveActivity(items)).toEqual({ agentLabel: 'Doc Expert', detail: 'is working' });
    });

    it('falls back to an earlier agent once the later one has stopped', () => {
      const items = [start('MAIN'), start('DOC EXPERT'), stop('DOC EXPERT')];
      expect(selectLiveActivity(items)).toEqual({ agentLabel: 'Main', detail: 'is working' });
    });

    it('treats an agent that started twice and stopped once as still open', () => {
      const items = [start('MAIN'), start('MAIN'), stop('MAIN')];
      expect(selectLiveActivity(items)).toEqual({ agentLabel: 'Main', detail: 'is working' });
    });
  });

  it('never throws, whatever the tool input is', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        const result = selectLiveActivity([
          start('MAIN'),
          tool('MAIN', 'doc expert', 'running', input),
          start('DOC EXPERT'),
        ]);
        expect(result?.agentLabel).toBe('Doc Expert');
        expect(typeof result?.detail).toBe('string');
      }),
    );
  });
});
