import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store';

// ====== CONSTANTS ======

const SESSION_PARAM = 'session_id';
const AGENT_PARAM = 'agent_id';

/** Query at page load, captured before the mirror effect rewrites it. */
const INCOMING_QUERY = new URLSearchParams(window.location.search);

// ====== HOOK ======

/**
 * Two-way bind between chat selection and the URL query. Call once, from the shell.
 *
 * - `session_id`: the open conversation. It implies its agent (resolved by
 *   `restoreSession`), so `agent_id` is not written while a session is open.
 * - `agent_id`: agent preselect for the welcome screen, where no session exists yet.
 *
 * Adopted once on load, then mirrored from the store. Mirroring keeps stale links
 * honest: a refused session (deleted / not owned) resets to a new conversation and
 * the URL follows. Query params, not path segments, because the shell is one route
 * and the post-login redirect preserves the query, so links survive login.
 */
export function useUrlState(): void {
  const sessionId = useChatStore((s) => s.sessionId);
  const selectedAgent = useChatStore((s) => s.selectedAgent);
  const agents = useChatStore((s) => s.agents);
  const agentsLoaded = useChatStore((s) => s.agentsLoaded);
  const loadAgents = useChatStore((s) => s.loadAgents);
  const restoreSession = useChatStore((s) => s.restoreSession);
  const selectAgent = useChatStore((s) => s.selectAgent);

  const hasAdoptStartedRef = useRef(false);
  const [isAdopted, setIsAdopted] = useState(false);

  // Adopt the incoming link.
  useEffect(() => {
    if (hasAdoptStartedRef.current) return;

    const targetSession = INCOMING_QUERY.get(SESSION_PARAM);
    const targetAgent = INCOMING_QUERY.get(AGENT_PARAM);

    // Both paths need the agent list to resolve an id to an agent. Idempotent;
    // this effect re-runs once agentsLoaded flips.
    if ((targetSession || targetAgent) && !agentsLoaded) {
      loadAgents();
      return;
    }

    // Set before the async restore so a mid-flight store update can't re-adopt.
    hasAdoptStartedRef.current = true;

    const adopt = async (): Promise<void> => {
      if (targetSession) {
        // session_id wins over agent_id; a refused session falls back to new chat.
        await restoreSession(targetSession);
        return;
      }
      const agent = agents.find((a) => a.id === targetAgent);
      if (agent) selectAgent(agent);
    };

    // Flip only after the restore settles, so the writer never mirrors a
    // half-applied selection.
    adopt().finally(() => setIsAdopted(true));
  }, [agentsLoaded, agents, loadAgents, restoreSession, selectAgent]);

  // Mirror the selection back into the address bar.
  useEffect(() => {
    // Before adoption the store still holds empty defaults; writing them would
    // clobber the incoming link on a reload mid-load.
    if (!isAdopted) return;

    // Live query, so unrelated params survive the rewrite.
    const params = new URLSearchParams(window.location.search);
    if (sessionId) {
      // An open session implies its agent, so agent_id would be redundant.
      params.set(SESSION_PARAM, sessionId);
      params.delete(AGENT_PARAM);
    } else {
      params.delete(SESSION_PARAM);
      if (selectedAgent) params.set(AGENT_PARAM, selectedAgent);
      else params.delete(AGENT_PARAM);
    }

    const query = params.toString();
    // replaceState, not pushState: a session switch shouldn't add a history entry.
    window.history.replaceState(
      null,
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
  }, [isAdopted, sessionId, selectedAgent]);
}
