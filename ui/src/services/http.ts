/**
 * Shared HTTP infrastructure for the service layer.
 *
 * All service network modules import from here rather than duplicating the
 * fetch wrapper and error-extraction helper.
 */

/** Default timeout for short JSON requests. The streaming endpoint is exempt. */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * `fetch` with a default request timeout. Applies an `AbortSignal.timeout`
 * unless the caller supplies its own signal, so a stalled backend can't hang a
 * request indefinitely. Not used for the long-lived SSE stream.
 */
export function fetchWithTimeout(input: string, init: RequestInit = {}): Promise<Response> {
  return fetch(input, { ...init, signal: init.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
}

/**
 * Extract a human-readable message from a Problem Details error body, falling
 * back to `fallback` when the body is absent or not JSON.
 */
export async function extractError(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { detail?: string };
    if (body.detail) return body.detail;
  } catch {
    // Body was not JSON — fall through to the generic message.
  }
  return fallback;
}
