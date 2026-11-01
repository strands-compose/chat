import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TurnTokens, WorkflowItem } from '@/types';

type SchedulerModule = typeof import('./scheduler');
type StateModule = typeof import('./state');

/** Time the stubbed clock moves per animation frame. */
const FRAME_MS = 16;

let scheduler: SchedulerModule;
let state: StateModule;
let now = 0;
let nextFrameId = 1;
let pendingFrames = new Map<number, FrameRequestCallback>();
let appliedItems: WorkflowItem[][] = [];
let appliedTokens: TurnTokens[] = [];

/** Advance the clock one frame and run the callbacks requested before it. */
function runFrame(): void {
  now += FRAME_MS;
  const due = [...pendingFrames.entries()];
  pendingFrames = new Map();
  for (const [, callback] of due) callback(now);
}

/** Run frames until `ms` have passed. */
function runFramesFor(ms: number): void {
  const frames = Math.ceil(ms / FRAME_MS);
  for (let i = 0; i < frames; i++) runFrame();
}

beforeEach(async () => {
  vi.useFakeTimers();
  now = 1_000;
  nextFrameId = 1;
  pendingFrames = new Map();
  appliedItems = [];
  appliedTokens = [];
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    const id = nextFrameId++;
    pendingFrames.set(id, callback);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    pendingFrames.delete(id);
  });
  vi.spyOn(performance, 'now').mockImplementation(() => now);

  // The scheduler keeps module-level timing state; load a fresh copy per test.
  vi.resetModules();
  scheduler = await import('./scheduler');
  state = await import('./state');
  scheduler.configureScheduler({
    applyWorkflowItems: (items) => appliedItems.push(items),
    applyWorkflowTokens: (tokens) => appliedTokens.push(tokens),
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('streaming scheduler', () => {
  it('coalesces many scheduleFlush calls in one frame into a single flush', () => {
    state.streamingState.workflowItemsBuffer.push({ type: 'text', content: 'hi' });

    for (let i = 0; i < 50; i++) scheduler.scheduleFlush();
    expect(pendingFrames.size).toBe(1);
    runFrame();

    expect(appliedItems).toHaveLength(1);
    expect(appliedTokens).toHaveLength(1);
    expect(appliedItems[0]).toEqual([{ type: 'text', content: 'hi' }]);
  });

  it('flushes nothing until a frame runs', () => {
    scheduler.scheduleFlush();

    expect(appliedItems).toHaveLength(0);
  });

  it('flushes the buffer contents as of the frame, not as of the request', () => {
    scheduler.scheduleFlush();
    state.streamingState.workflowItemsBuffer.push({ type: 'text', content: 'late' });
    state.streamingState.tokens.input = 9;
    runFrame();

    expect(appliedItems[0]).toEqual([{ type: 'text', content: 'late' }]);
    expect(appliedTokens[0]).toEqual({ input: 9, output: 0, cacheRead: 0, cacheWrite: 0 });
  });

  it('hands the store snapshots, so later buffer changes do not alter an applied flush', () => {
    const item: WorkflowItem = { type: 'text', content: 'a' };
    state.streamingState.workflowItemsBuffer.push(item);
    scheduler.scheduleFlush();
    runFrame();

    state.streamingState.workflowItemsBuffer.push({ type: 'text', content: 'b' });
    state.streamingState.tokens.output = 4;

    expect(appliedItems[0]).toHaveLength(1);
    expect(appliedTokens[0].output).toBe(0);
  });

  it('defers a flush requested within 100 ms of the previous one to a later frame', () => {
    scheduler.scheduleFlush();
    runFrame();
    expect(appliedItems).toHaveLength(1);

    scheduler.scheduleFlush();
    runFramesFor(48);
    expect(appliedItems).toHaveLength(1);

    runFramesFor(100);
    expect(appliedItems).toHaveLength(2);
  });

  it('flushes again on a later request once the interval has passed', () => {
    scheduler.scheduleFlush();
    runFrame();
    runFramesFor(200);

    scheduler.scheduleFlush();
    runFrame();

    expect(appliedItems).toHaveLength(2);
  });

  it('drops a pending flush when cancelFlush is called', () => {
    scheduler.scheduleFlush();
    scheduler.cancelFlush();
    runFramesFor(300);

    expect(appliedItems).toHaveLength(0);
  });

  it('accepts new requests after a cancel', () => {
    scheduler.scheduleFlush();
    scheduler.cancelFlush();
    scheduler.scheduleFlush();
    runFrame();

    expect(appliedItems).toHaveLength(1);
  });

  it('does nothing and does not throw when cancelFlush has nothing to cancel', () => {
    expect(() => scheduler.cancelFlush()).not.toThrow();
  });
});
