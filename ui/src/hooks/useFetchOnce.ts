import { useEffect, useRef, useState } from 'react';

interface FetchOnceResult<T> {
  data: T | null;
  isLoading: boolean;
}

/**
 * Fetch a value exactly once on mount and cache it in state. Any rejection is
 * re-thrown during render so a surrounding ErrorBoundary renders its fallback —
 * callers never deal with error/retry plumbing themselves.
 *
 * @param fetcher Stable (module-level) fetch function.
 */
export function useFetchOnce<T>(fetcher: () => Promise<T>): FetchOnceResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    fetcher()
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetcher]);

  if (error) throw error;

  return { data, isLoading };
}
