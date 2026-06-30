/**
 * Self-contained input footer — subscribes only to isLoading so it doesn't
 * re-render on messageOrder changes or token ticks.
 *
 * The stop button routes through the store's interrupt guard, which opens the
 * confirmation dialog while the agent is running.
 */

import type { ReactElement } from 'react';
import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useChatStore } from '@/store';
import { useMediaCapabilities } from '@/contexts';
import { Composer } from '@/components';

const ConnectedComposerComponent = (): ReactElement => {
  const { isLoading, sendMessage, guardInterrupt, selectedAgentMultimodal } = useChatStore(
    useShallow((s) => ({
      isLoading: s.isLoading,
      sendMessage: s.sendMessage,
      guardInterrupt: s.guardInterrupt,
      selectedAgentMultimodal: s.selectedAgentMultimodal,
    })),
  );
  const { capabilities } = useMediaCapabilities();

  // The stop button is only shown while loading, so the guard always opens
  // the confirm dialog; the deferred action is a no-op since confirming stops.
  const handleStop = (): void => guardInterrupt(() => {});

  return (
    <Composer
      onSend={sendMessage}
      onStop={handleStop}
      isLoading={isLoading}
      capabilities={capabilities}
      agentMultimodal={selectedAgentMultimodal}
    />
  );
};

export const ConnectedComposer = memo(ConnectedComposerComponent);
