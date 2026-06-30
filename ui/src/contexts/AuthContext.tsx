/**
 * Auth context, provider, and consumer hook.
 *
 * On mount, probes GET /auth/me to restore an existing session. The auth
 * token itself is an httpOnly cookie managed entirely by the backend, so the
 * provider never touches tokens directly — it only tracks the resulting user.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { fetchCurrentUser, logout as logoutRequest } from '@/services';
import type { CurrentUser } from '@/services';

export interface AuthContextValue {
  /** The authenticated user, or null when signed out. */
  user: CurrentUser | null;
  /** True while the initial session check is in flight. */
  isLoading: boolean;
  /** Non-null when the initial /auth/me fetch failed with a non-401 error. */
  authError: string | null;
  /** Clear the session and sign out from the identity provider. */
  signOut: () => void;
  /** Refetch the current user profile from the backend. */
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Read the auth context. Throws if used outside an AuthProvider. */
export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return value;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchCurrentUser()
      .then((current) => {
        if (!active) return;
        // null means 401 — unauthenticated, not an error
        setUser(current);
        setAuthError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setUser(null);
        setAuthError(err instanceof Error ? err.message : 'Unexpected error checking session.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const signOut = useCallback((): void => {
    logoutRequest();
  }, []);

  const refetchUser = useCallback(async (): Promise<void> => {
    try {
      const current = await fetchCurrentUser();
      setUser(current);
      setAuthError(null);
    } catch (err: unknown) {
      setUser(null);
      setAuthError(err instanceof Error ? err.message : 'Unexpected error checking session.');
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, authError, signOut, refetchUser }),
    [user, isLoading, authError, signOut, refetchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
