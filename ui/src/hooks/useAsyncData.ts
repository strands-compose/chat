import type { DependencyList } from 'react';
import { useEffect, useRef, useState } from 'react';

interface AsyncDataResult<T> {
  /** Latest resolved value, or null before the first success. */
  data: T | null;
  /** True while a request is in flight. */
  isLoading: boolean;
  /** Error from the most recent failed request, or null. */
  error: Error | null;
}

/**
 * Run an async fetcher and re-run it whenever `deps` change, exposing
 * `{ data, isLoading, error }`.
 *
 * A monotonic request id guards against race conditions: when `deps` change
 * before an in-flight request resolves, the stale response is discarded so the
 * latest request always wins. Unlike `useFetchOnce`, this surfaces errors as
 * state rather than throwing, so callers can render inline error UI and keep
 * the previous `data` visible.
 *
 * The fetcher closes over the current `deps`; pass those same values in `deps`
 * so a change triggers a refetch.
 *
 * @param fetcher - Produces the promise to await. Re-invoked on every dep change.
 * @param deps - Dependency list controlling when to refetch.
 * @returns The current data, loading flag, and error.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, deps: DependencyList): AsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const requestIdRef = useRef(0);

  // The deps are supplied by the caller and intentionally drive refetches; the
  // fetcher closes over them, so the exhaustive-deps check does not apply here.
  useEffect(() => {
    const requestId = ++requestIdRef.current;

    const run = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        if (requestId !== requestIdRef.current) return;
        setData(result);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (requestId === requestIdRef.current) setIsLoading(false);
      }
    };

    void run();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, error };
}
