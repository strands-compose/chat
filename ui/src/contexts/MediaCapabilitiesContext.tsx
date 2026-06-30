/**
 * Media capabilities context, provider, and consumer hook.
 *
 * On mount, fetches GET /media/capabilities so the Composer can self-configure
 * which attachment formats and size limits the backend supports. Attachments
 * are an enhancement: a failed fetch leaves capabilities undefined and is not
 * surfaced as a user error, keeping chat fully usable.
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { fetchMediaCapabilities } from '@/services';
import type { MediaCapabilities } from '@/types';

export interface MediaCapabilitiesContextValue {
  /** Capabilities once loaded; undefined until/unless the mount fetch succeeds. */
  capabilities: MediaCapabilities | undefined;
  /** True while the initial fetch is in flight. */
  isLoading: boolean;
}

const MediaCapabilitiesContext = createContext<MediaCapabilitiesContextValue | null>(null);

/** Read the media capabilities context. Throws if used outside a MediaCapabilitiesProvider. */
export const useMediaCapabilities = (): MediaCapabilitiesContextValue => {
  const value = useContext(MediaCapabilitiesContext);
  if (value === null) {
    throw new Error('useMediaCapabilities must be used within a MediaCapabilitiesProvider');
  }
  return value;
};

interface MediaCapabilitiesProviderProps {
  children: ReactNode;
}

export const MediaCapabilitiesProvider = ({
  children,
}: MediaCapabilitiesProviderProps): ReactElement => {
  const [capabilities, setCapabilities] = useState<MediaCapabilities | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchMediaCapabilities()
      .then((loaded) => {
        if (active) setCapabilities(loaded);
      })
      .catch((error) => {
        console.error('Failed to load media capabilities:', error);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<MediaCapabilitiesContextValue>(
    () => ({ capabilities, isLoading }),
    [capabilities, isLoading],
  );

  return (
    <MediaCapabilitiesContext.Provider value={value}>
      {children}
    </MediaCapabilitiesContext.Provider>
  );
};
