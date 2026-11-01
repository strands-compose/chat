// @vitest-environment jsdom
// api.ts reads the app-base meta tag when imported, so it needs a DOM.

import fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Attachment, BackendStreamEvent, ChatStreamEvent } from '@/types';
import { mapBackendEvent, streamChat } from './api';

// ====== HELPERS ======

const encoder = new TextEncoder();

/** One SSE `data:` frame carrying a backend event. */
const frame = (type: string, data: Record<string, unknown> = {}, agent = 'main'): string =>
  `data: ${JSON.stringify({ type, agent_name: agent, timestamp: 't', data })}\n\n`;

/** A Response whose body arrives as the given byte chunks. */
function streamResponse(chunks: Uint8Array[], init?: ResponseInit): Response {
  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(chunk);
        controller.close();
      },
    }),
    init,
  );
}

/** A Response whose body arrives as one chunk. */
const textResponse = (text: string, init?: ResponseInit): Response =>
  streamResponse([encoder.encode(text)], init);

/** A Response whose body arrives split at the given byte offsets. */
function chunkedResponse(bytes: Uint8Array, cuts: number[]): Response {
  const bounds = [0, ...new Set(cuts), bytes.length].sort((a, b) => a - b);
  const chunks: Uint8Array[] = [];
  for (let i = 0; i < bounds.length - 1; i++) chunks.push(bytes.slice(bounds[i], bounds[i + 1]));
  return streamResponse(chunks);
}

function stubFetch(response: () => Response): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async () =>
    response(),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

async function collect(
  stream: AsyncGenerator<ChatStreamEvent, void, unknown>,
): Promise<ChatStreamEvent[]> {
  const events: ChatStreamEvent[] = [];
  for await (const event of stream) events.push(event);
  return events;
}

/** The request init handed to the most recent fetch call. */
function lastInit(fetchMock: ReturnType<typeof vi.fn>): RequestInit {
  const call = fetchMock.mock.calls.at(-1) as [string, RequestInit] | undefined;
  if (!call) throw new Error('fetch was not called');
  return call[1];
}

const REQUEST = { prompt: 'hello', agent_id: 'agent-1' };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ====== streamChat: framing ======

describe('streamChat framing', () => {
  const FRAMES = [
    frame('session_start', { session_id: 's1' }),
    'data: keep-alive\n\n',
    frame('token', { text: 'Hé 🙂 世界' }),
    // Last frame has no trailing newline.
    `data: ${JSON.stringify({ type: 'session_end', agent_name: 'main', timestamp: 't', data: {} })}`,
  ].join('');

  it('yields the same events however the byte stream is split, even inside multi-byte characters', async () => {
    const bytes = encoder.encode(FRAMES);
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer({ min: 1, max: bytes.length - 1 }), { maxLength: 16 }),
        async (cuts) => {
          stubFetch(() => chunkedResponse(bytes, cuts));
          const seen = (await collect(streamChat(REQUEST, ''))).map((event) =>
            event.type === 'token' ? `token:${event.content}` : event.type,
          );
          expect(seen).toEqual(['session_start', 'token:Hé 🙂 世界', 'session_end']);
        },
      ),
    );
  });

  it('yields the same events when every byte arrives on its own', async () => {
    const bytes = encoder.encode(FRAMES);
    const everyByte = Array.from({ length: bytes.length - 1 }, (_, i) => i + 1);
    stubFetch(() => chunkedResponse(bytes, everyByte));

    const events = await collect(streamChat(REQUEST, ''));

    expect(events.map((event) => event.type)).toEqual(['session_start', 'token', 'session_end']);
    expect(events[1].content).toBe('Hé 🙂 世界');
  });

  it('ignores keep-alive frames and lines that are not data lines', async () => {
    stubFetch(() =>
      textResponse(
        [
          ': comment line\n',
          'event: message\n',
          'id: 42\n',
          'retry: 1000\n',
          'data: keep-alive\n\n',
          frame('token', { text: 'a' }),
          '\n',
          'plain text line\n',
        ].join(''),
      ),
    );

    const events = await collect(streamChat(REQUEST, ''));

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: 'token', content: 'a' });
  });

  it('skips a malformed JSON frame and keeps streaming', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    stubFetch(() =>
      textResponse(
        [
          frame('token', { text: 'before' }),
          'data: {not json\n\n',
          frame('token', { text: 'after' }),
        ].join(''),
      ),
    );

    const events = await collect(streamChat(REQUEST, ''));

    expect(events.map((event) => event.content)).toEqual(['before', 'after']);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('parses a trailing frame that has no newline', async () => {
    stubFetch(() =>
      textResponse(
        `data: ${JSON.stringify({ type: 'token', agent_name: 'main', timestamp: 't', data: { text: 'tail' } })}`,
      ),
    );

    const events = await collect(streamChat(REQUEST, ''));

    expect(events).toEqual([{ type: 'token', content: 'tail', agent_name: 'main' }]);
  });

  it('tolerates CRLF line endings', async () => {
    stubFetch(() => textResponse(frame('token', { text: 'crlf' }).replaceAll('\n', '\r\n')));

    const events = await collect(streamChat(REQUEST, ''));

    expect(events.map((event) => event.content)).toEqual(['crlf']);
  });

  it('drops events with an unknown type and continues', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    stubFetch(() =>
      textResponse([frame('brand_new', {}), frame('token', { text: 'ok' })].join('')),
    );

    const events = await collect(streamChat(REQUEST, ''));

    expect(events.map((event) => event.type)).toEqual(['token']);
    expect(warn).toHaveBeenCalled();
  });
});

// ====== streamChat: errors ======

describe('streamChat non-OK response', () => {
  it('throws the Problem Details detail', async () => {
    stubFetch(
      () =>
        new Response(JSON.stringify({ detail: 'Monthly budget exceeded.' }), {
          status: 402,
          headers: { 'Content-Type': 'application/problem+json' },
        }),
    );

    await expect(collect(streamChat(REQUEST, ''))).rejects.toThrow('Monthly budget exceeded.');
  });

  it('falls back to a status message when the body is not JSON', async () => {
    stubFetch(() => new Response('<html>Bad gateway</html>', { status: 502 }));

    await expect(collect(streamChat(REQUEST, ''))).rejects.toThrow('Agent request failed (502).');
  });

  it('falls back to a status message when the JSON body has no detail', async () => {
    stubFetch(() => new Response(JSON.stringify({ title: 'Nope' }), { status: 500 }));

    await expect(collect(streamChat(REQUEST, ''))).rejects.toThrow('Agent request failed (500).');
  });
});

// ====== streamChat: request body ======

describe('streamChat request', () => {
  const makeAttachment = (id: string, name: string, content: string): Attachment => {
    const file = new File([content], name, { type: 'text/plain' });
    return { id, file, kind: 'document', name, size: file.size };
  };

  it('posts a JSON body with the session id when one is given', async () => {
    const fetchMock = stubFetch(() => textResponse(''));

    await collect(streamChat(REQUEST, 'session-1'));

    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/v1\/invocations$/);
    const init = lastInit(fetchMock);
    expect(init.method).toBe('POST');
    expect(typeof init.body).toBe('string');
    expect(JSON.parse(init.body as string)).toEqual({ ...REQUEST, session_id: 'session-1' });
  });

  it('omits the session_id field when the session id is empty', async () => {
    const fetchMock = stubFetch(() => textResponse(''));

    await collect(streamChat(REQUEST, ''));

    const body = JSON.parse(lastInit(fetchMock).body as string) as Record<string, unknown>;
    expect(body).toEqual(REQUEST);
    expect('session_id' in body).toBe(false);
  });

  it('posts multipart with a payload part and one file:<i> part per attachment', async () => {
    const fetchMock = stubFetch(() => textResponse(''));
    const attachments = [
      makeAttachment('a', 'notes.txt', 'first'),
      makeAttachment('b', 'todo.txt', 'second'),
    ];

    await collect(streamChat(REQUEST, 'session-1', attachments));

    const body = lastInit(fetchMock).body;
    expect(body).toBeInstanceOf(FormData);
    const form = body as FormData;
    expect(JSON.parse(form.get('payload') as string)).toEqual({
      ...REQUEST,
      session_id: 'session-1',
    });
    const first = form.get('file:0') as File;
    const second = form.get('file:1') as File;
    expect(first.name).toBe('notes.txt');
    expect(await first.text()).toBe('first');
    expect(second.name).toBe('todo.txt');
    expect(await second.text()).toBe('second');
    expect(form.has('file:2')).toBe(false);
  });

  it('leaves Content-Type to the browser for multipart bodies', async () => {
    const fetchMock = stubFetch(() => textResponse(''));

    await collect(streamChat(REQUEST, '', [makeAttachment('a', 'notes.txt', 'x')]));

    const headers = lastInit(fetchMock).headers as Record<string, string>;
    expect(Object.keys(headers).map((key) => key.toLowerCase())).not.toContain('content-type');
  });

  it('omits session_id from the multipart payload when the session id is empty', async () => {
    const fetchMock = stubFetch(() => textResponse(''));

    await collect(streamChat(REQUEST, '', [makeAttachment('a', 'notes.txt', 'x')]));

    const form = lastInit(fetchMock).body as FormData;
    expect(JSON.parse(form.get('payload') as string)).toEqual(REQUEST);
  });

  it('passes the abort signal to fetch', async () => {
    const fetchMock = stubFetch(() => textResponse(''));
    const controller = new AbortController();

    await collect(streamChat(REQUEST, '', [], controller.signal));

    expect(lastInit(fetchMock).signal).toBe(controller.signal);
  });
});

// ====== mapBackendEvent ======

describe('mapBackendEvent', () => {
  const raw = (
    type: string,
    data: Record<string, unknown> = {},
    agent_name = 'main',
  ): BackendStreamEvent => ({
    type,
    agent_name,
    timestamp: 't',
    data,
  });

  it('maps token and reasoning text to content', () => {
    expect(mapBackendEvent(raw('token', { text: 'hi' }))).toEqual({
      type: 'token',
      content: 'hi',
      agent_name: 'main',
    });
    expect(mapBackendEvent(raw('reasoning', { text: 'thinking' }))).toEqual({
      type: 'reasoning',
      content: 'thinking',
      agent_name: 'main',
    });
  });

  it('maps tool_start with name, id and input', () => {
    expect(
      mapBackendEvent(
        raw('tool_start', { tool_name: 'search', tool_use_id: 'u1', tool_input: { q: 'x' } }),
      ),
    ).toEqual({
      type: 'tool_start',
      name: 'search',
      tool_use_id: 'u1',
      input: { q: 'x' },
      agent_name: 'main',
    });
  });

  it('maps tool_end with name, id, output and status', () => {
    expect(
      mapBackendEvent(
        raw('tool_end', {
          tool_name: 'search',
          tool_use_id: 'u1',
          tool_result: 'found',
          status: 'error',
        }),
      ),
    ).toEqual({
      type: 'tool_end',
      name: 'search',
      tool_use_id: 'u1',
      output: 'found',
      status: 'error',
      agent_name: 'main',
    });
  });

  it.each(['agent_complete', 'multiagent_complete'] as const)(
    'reads %s usage from the top level of data',
    (type) => {
      expect(
        mapBackendEvent(
          raw(type, {
            input_tokens: 1,
            output_tokens: 2,
            cache_read_input_tokens: 3,
            cache_write_input_tokens: 4,
          }),
        ),
      ).toEqual({
        type,
        agent_name: 'main',
        input_tokens: 1,
        output_tokens: 2,
        cache_read_input_tokens: 3,
        cache_write_input_tokens: 4,
      });
    },
  );

  it.each(['agent_complete', 'multiagent_complete'] as const)(
    'reads %s usage from the nested usage object',
    (type) => {
      expect(
        mapBackendEvent(
          raw(type, {
            usage: {
              input_tokens: 10,
              output_tokens: 20,
              cache_read_input_tokens: 30,
              cache_write_input_tokens: 40,
            },
          }),
        ),
      ).toEqual({
        type,
        agent_name: 'main',
        input_tokens: 10,
        output_tokens: 20,
        cache_read_input_tokens: 30,
        cache_write_input_tokens: 40,
      });
    },
  );

  it('prefers top-level usage over nested usage and keeps zero', () => {
    const event = mapBackendEvent(
      raw('agent_complete', { input_tokens: 0, usage: { input_tokens: 99, output_tokens: 5 } }),
    );
    expect(event?.input_tokens).toBe(0);
    expect(event?.output_tokens).toBe(5);
  });

  it('leaves usage undefined when the backend sends none', () => {
    const event = mapBackendEvent(raw('agent_complete', {}));
    expect(event?.input_tokens).toBeUndefined();
    expect(event?.output_tokens).toBeUndefined();
  });

  it('maps error text and defaults to an empty string', () => {
    expect(mapBackendEvent(raw('error', { text: 'boom' }))).toEqual({
      type: 'error',
      content: 'boom',
      agent_name: 'main',
    });
    expect(mapBackendEvent(raw('error', {}))?.content).toBe('');
  });

  it('maps node_start and node_stop with the node id', () => {
    expect(mapBackendEvent(raw('node_start', { node_id: 'n1' }))).toEqual({
      type: 'node_start',
      node_id: 'n1',
      agent_name: 'main',
    });
    expect(mapBackendEvent(raw('node_stop', { node_id: 'n1' }))).toEqual({
      type: 'node_stop',
      node_id: 'n1',
      agent_name: 'main',
    });
  });

  it('takes the session_start agent from data.entry.name and the session id from data', () => {
    expect(
      mapBackendEvent(
        raw('session_start', { session_id: 's1', entry: { name: 'entry_agent' } }, 'other'),
      ),
    ).toEqual({ type: 'session_start', agent_name: 'entry_agent', session_id: 's1' });
  });

  it('falls back to agent_name on session_start without an entry name', () => {
    expect(mapBackendEvent(raw('session_start', { session_id: 's1' }, 'main'))).toEqual({
      type: 'session_start',
      agent_name: 'main',
      session_id: 's1',
    });
    expect(mapBackendEvent(raw('session_start', { entry: {} }, 'main'))?.agent_name).toBe('main');
  });

  it.each(['session_end', 'agent_start', 'multiagent_start'] as const)(
    'maps %s to its type and agent',
    (type) => {
      expect(mapBackendEvent(raw(type))).toEqual({ type, agent_name: 'main' });
    },
  );

  it('maps handoff targets and drops non-string ids', () => {
    expect(mapBackendEvent(raw('handoff', { to_node_ids: ['a', 3, 'b'] }))).toEqual({
      type: 'handoff',
      agent_name: 'main',
      to_node_ids: ['a', 'b'],
    });
    expect(mapBackendEvent(raw('handoff', {}))?.to_node_ids).toBeUndefined();
  });

  it('returns null and warns for an unknown event type', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(mapBackendEvent(raw('something_new'))).toBeNull();

    expect(warn).toHaveBeenCalledTimes(1);
  });
});
