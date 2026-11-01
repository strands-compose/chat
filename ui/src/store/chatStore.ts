/**
 * Zustand store for chat state and message orchestration.
 *
 * Sessions live here (not in the Sidebar) so any component can read them
 * without prop drilling, and loadSessions can be called from anywhere —
 * including inside sendMessage — without callback registration.
 */

import { create } from 'zustand';
import type { Attachment, Message, TurnTokens, WorkflowItem } from '../types';
import {
  streamChat,
  fetchSessions,
  fetchSession,
  fetchSessionMessages,
  fetchSessionUsage,
  fetchAgents,
  renameSession as renameSessionApi,
  deleteSession as deleteSessionApi,
  isMobileViewport,
} from '../services';
import type { Session, Agent, SessionMessage, SessionUsageSummary } from '../services';
import {
  dispatchStreamEvent,
  configureScheduler,
  scheduleFlush,
  cancelFlush,
  resetStreamingState,
} from './streaming';
import type { StreamingSideEffects } from './streaming';

// ====== CONSTANTS ======

/** Token totals of a turn that has not reported usage yet. Shared, never mutated. */
const NO_TOKENS: TurnTokens = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

/** Sidebar history page size. Each request asks for one extra row to learn
 *  whether another page exists without a separate count query. */
const SESSIONS_PAGE_SIZE = 50;

// ====== SHARED LOADERS ======

/** Build a fresh thread (messages map + order) from backend message rows. */
export function buildThreadFromBackend(
  msgs: SessionMessage[],
): { messages: Record<string, Message>; messageOrder: string[] } {
  let counter = 0;
  const messages: Record<string, Message> = {};
  const messageOrder: string[] = [];
  for (const m of msgs) {
    const id = `backend-${++counter}`;
    messages[id] = {
      id,
      role: m.role,
      content: m.content,
      seq: m.seq,
      isSuccess: m.is_success,
      attachments: m.attachments.length > 0 ? m.attachments : undefined,
    };
    messageOrder.push(id);
  }
  return { messages, messageOrder };
}

/** Map an agent record to the store's selected-agent fields. Single source so a
 *  new selected-agent field is added here once, not at every call site. */
function agentSelection(agent: Agent): Pick<
  ChatStore,
  | 'selectedAgent'
  | 'selectedAgentLabel'
  | 'selectedAgentDescription'
  | 'selectedAgentMultimodal'
  | 'suggestedQuestions'
> {
  return {
    selectedAgent: agent.id,
    selectedAgentLabel: agent.name,
    selectedAgentDescription: agent.description,
    selectedAgentMultimodal: agent.multimodal,
    suggestedQuestions: agent.suggested_questions ?? [],
  };
}

// ====== STORE TYPES ======

export interface ChatStore {
  // ---- State ----
  messages: Record<string, Message>;
  messageOrder: string[];
  isLoading: boolean;
  /** UI-generated UUID sent with every invocation. A new one is created on
   *  clearChat so each conversation is isolated in the backend. */
  sessionId: string;
  selectedAgent: string;
  selectedAgentLabel: string;
  selectedAgentDescription: string;
  selectedAgentMultimodal: boolean;
  suggestedQuestions: string[];
  sessions: Session[];
  agents: Agent[];
  sessionsLoading: boolean;
  /** True when the backend holds older sessions than the ones loaded. */
  hasMoreSessions: boolean;
  /** True while an older page of sessions is being fetched. */
  loadingMoreSessions: boolean;
  /** True while a session's thread is being fetched on switch. Drives the
   *  blur-out / fade-in reveal so switching feels smooth instead of a hard
   *  swap once the fetch (which can take ~1s) resolves. */
  restoringSession: boolean;
  /** True while the one-time agent list fetch is in flight. */
  agentsLoading: boolean;
  /** True once the agent list fetch has settled at least once (success or error).
   *  Distinguishes "not fetched yet" from "fetched and empty" so the welcome
   *  screen doesn't flash the no-agents banner before the first fetch. */
  agentsLoaded: boolean;
  /** True when the agent list fetch failed. */
  agentsError: boolean;
  /** Whether the "agent is running" interrupt-confirmation dialog is open. */
  interruptConfirmOpen: boolean;
  /** Aggregated token usage and inferred cost, fetched from the backend after
   *  every turn and on restore. Undefined until the first successful fetch. */
  sessionUsage: SessionUsageSummary | undefined;
  /** Live workflow trace by backend assistant seq. Decoupled from Message so the
   *  thread is purely backend-derived. Empty on restore (traces are never persisted). */
  workflowTraces: Record<number, WorkflowItem[]>;
  /** Per-turn token totals by backend assistant seq, summed from agent_complete
   *  events. Empty on restore (not persisted; recomputed only for live turns). */
  workflowTokens: Record<number, TurnTokens>;
  /** Trace for the in-flight turn, before its backend seq is known. Rendered live. */
  activeWorkflowItems: WorkflowItem[];
  /** Token totals for the in-flight turn, rendered live in the workflow panel. */
  activeWorkflowTokens: TurnTokens;
  /** Selected assistant seq for the workflow panel; null = auto (latest). */
  selectedWorkflowSeq: number | null;
  /** True while the workflow panel is shut, which is the default. Overrides the
   *  auto-open conditions (selection / streaming / live buffer). A new turn or a
   *  message's Workflow button opens it; the user can close it again. Resets to
   *  shut when the conversation changes. */
  workflowPanelClosed: boolean;
  /** True while the welcome screen's agent description panel is shut, which is
   *  the default. Opened from the help button next to the agent selector. */
  descriptionPanelClosed: boolean;
  /** Backend seq of the assistant turn that completed in this session this
   *  load. Used to play the content reveal once for a fresh answer while
   *  restored history renders instantly. Null until a turn completes; reset
   *  on clearChat / restoreSession. */
  lastCompletedSeq: number | null;

  // ---- Actions ----
  sendMessage: (text: string, attachments?: Attachment[]) => Promise<void>;
  clearChat: () => void;
  restoreSession: (sessionId: string) => Promise<void>;
  setSelectedWorkflowSeq: (seq: number | null) => void;
  /** Close the workflow panel (user action). */
  closeWorkflowPanel: () => void;
  /** Open the workflow panel (user action). */
  openWorkflowPanel: () => void;
  /** Close the agent description panel (user action). */
  closeDescriptionPanel: () => void;
  /** Open the agent description panel (user action). */
  openDescriptionPanel: () => void;
  /** Apply an agent record as the current selection. */
  selectAgent: (agent: Agent) => void;
  /** Fetch the agent list once and auto-select a default. Idempotent. */
  loadAgents: () => Promise<void>;
  stopGeneration: () => void;
  resendMessage: (messageId: string) => void;
  copyMessage: (messageId: string) => void;
  /** Refresh the newest page, keeping any older pages already loaded. */
  loadSessions: () => Promise<void>;
  /** Append the next page of older sessions below the loaded ones. */
  loadMoreSessions: () => Promise<void>;
  renameSession: (sessionId: string, title: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  /** Run *action* now if idle, else open the interrupt-confirm dialog and defer it. */
  guardInterrupt: (action: () => void) => void;
  /** Stop the agent and run the deferred action, then close the dialog. */
  confirmInterrupt: () => void;
  /** Dismiss the dialog without stopping the agent. */
  cancelInterrupt: () => void;
}

// ====== MODULE-LOCAL STATE ======

// Lives outside the store so abort() fires synchronously without a Zustand update cycle.
let abortController: AbortController | null = null;
let messageIdCounter = 0;
// Deferred navigation/stop action awaiting interrupt confirmation.
let pendingInterruptAction: (() => void) | null = null;

// ====== STORE ======

export const useChatStore = create<ChatStore>((set, get) => {
  // The scheduler writes coalesced workflow-item snapshots back into Zustand.
  // Configured here because it needs set() but can't import the store (circular).
  configureScheduler({
    applyWorkflowItems: (items) => set({ activeWorkflowItems: items }),
    applyWorkflowTokens: (tokens) => set({ activeWorkflowTokens: tokens }),
  });

  const buildEffects = (assistantMsgId: string, isNewSession: boolean): StreamingSideEffects => ({
    scheduleFlush: () => scheduleFlush(),
    cancelFlush: () => cancelFlush(),
    onSessionStart: (sessionId) => {
      // Adopt the backend-minted id for a new conversation so follow-up turns,
      // the sidebar, and restore all key off the same session.
      if (sessionId && !get().sessionId) set({ sessionId });
      // Reload the sidebar only for new sessions — by the time session_start
      // arrives the backend has already committed the chat_sessions row.
      if (isNewSession) get().loadSessions();
    },
    onSessionEnd: (trace, tokens) => {
      const sid = get().sessionId;
      if (!sid) return;

      // Surface the completed trace now so the panel doesn't blank before the
      // refetch lands. The same reference is reused under the seq below, so the
      // later swap doesn't re-render.
      set({ activeWorkflowItems: trace, activeWorkflowTokens: tokens });

      fetchSessionMessages(sid)
        .then((msgs) => {
          if (get().sessionId !== sid) return;
          const { messages, messageOrder } = buildThreadFromBackend(msgs);
          // Associate the live trace with the just-completed assistant (highest seq).
          const lastAssistantSeq = msgs
            .filter((m) => m.role === 'assistant')
            .reduce((max, m) => Math.max(max, m.seq), -1);
          set((state) => ({
            messages,
            messageOrder,
            activeWorkflowItems: [],
            workflowTraces:
              lastAssistantSeq >= 0
                ? { ...state.workflowTraces, [lastAssistantSeq]: trace }
                : state.workflowTraces,
            workflowTokens:
              lastAssistantSeq >= 0
                ? { ...state.workflowTokens, [lastAssistantSeq]: tokens }
                : state.workflowTokens,
            // Point the panel at the just-completed turn; its open/closed state is
            // left as the user set it. On mobile the panel takes full width, so
            // close it automatically after the refetch so the chat thread is
            // visible again.
            selectedWorkflowSeq: lastAssistantSeq >= 0 ? lastAssistantSeq : state.selectedWorkflowSeq,
            workflowPanelClosed: state.workflowPanelClosed || isMobileViewport(),
            // Remember the just-completed turn so its answer reveals once while
            // restored history renders instantly.
            lastCompletedSeq: lastAssistantSeq >= 0 ? lastAssistantSeq : state.lastCompletedSeq,
          }));
        })
        .catch((err) => console.error('[chatStore] session_end refetch failed:', err));
    },
    // commitFinal closes the streaming turn — called by session_end or error events.
    commitFinal: (patch) => {
      set((state) => {
        const existing = state.messages[assistantMsgId];
        if (!existing) return state;
        return {
          messages: {
            ...state.messages,
            [assistantMsgId]: { ...existing, ...patch },
          },
        };
      });
    },
  });

  return {
    // ---- Initial state ----
    messages: {},
    messageOrder: [],
    isLoading: false,
    sessionId: '',
    selectedAgent: '',
    selectedAgentLabel: '',
    selectedAgentDescription: '',
    selectedAgentMultimodal: false,
    suggestedQuestions: [],
    sessions: [],
    agents: [],
    sessionsLoading: false,
    hasMoreSessions: false,
    loadingMoreSessions: false,
    restoringSession: false,
    agentsLoading: false,
    agentsLoaded: false,
    agentsError: false,
    interruptConfirmOpen: false,
    sessionUsage: undefined,
    workflowTraces: {},
    workflowTokens: {},
    activeWorkflowItems: [],
    activeWorkflowTokens: NO_TOKENS,
    selectedWorkflowSeq: null,
    workflowPanelClosed: true,
    descriptionPanelClosed: true,
    lastCompletedSeq: null,

    loadSessions: async (): Promise<void> => {
      set({ sessionsLoading: true });
      try {
        const rows = await fetchSessions(SESSIONS_PAGE_SIZE + 1, 0);
        const firstPage = rows.slice(0, SESSIONS_PAGE_SIZE);
        const firstPageIds = new Set(firstPage.map((s) => s.session_id));
        set((state) => {
          // Older pages loaded via "Load more" stay below the refreshed first
          // page, so a refresh (new chat, sidebar remount) never shrinks the list.
          const olderLoaded = state.sessions.filter((s) => !firstPageIds.has(s.session_id));
          return {
            sessions: [...firstPage, ...olderLoaded],
            hasMoreSessions:
              olderLoaded.length > 0 ? state.hasMoreSessions : rows.length > SESSIONS_PAGE_SIZE,
          };
        });
      } catch (err) {
        console.error('[chatStore] loadSessions failed:', err);
        // Keep existing list rather than wiping it on a transient error.
      } finally {
        set({ sessionsLoading: false });
      }
    },

    loadMoreSessions: async (): Promise<void> => {
      const { hasMoreSessions, loadingMoreSessions, sessions } = get();
      if (!hasMoreSessions || loadingMoreSessions) return;
      set({ loadingMoreSessions: true });
      try {
        // The local list mirrors the server order (deletes and new chats are
        // applied locally too), so its length is the offset of the next page.
        const rows = await fetchSessions(SESSIONS_PAGE_SIZE + 1, sessions.length);
        set((state) => {
          const loadedIds = new Set(state.sessions.map((s) => s.session_id));
          const nextPage = rows
            .slice(0, SESSIONS_PAGE_SIZE)
            .filter((s) => !loadedIds.has(s.session_id));
          return {
            sessions: [...state.sessions, ...nextPage],
            hasMoreSessions: rows.length > SESSIONS_PAGE_SIZE,
          };
        });
      } catch (err) {
        console.error('[chatStore] loadMoreSessions failed:', err);
      } finally {
        set({ loadingMoreSessions: false });
      }
    },

    renameSession: async (sessionId: string, title: string): Promise<void> => {
      try {
        await renameSessionApi(sessionId, title);
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.session_id === sessionId ? { ...s, title } : s
          ),
        }));
      } catch (err) {
        console.error('[chatStore] renameSession failed:', err);
        throw err;
      }
    },

    deleteSession: async (sessionId: string): Promise<void> => {
      try {
        await deleteSessionApi(sessionId);
        set((state) => ({
          sessions: state.sessions.filter((s) => s.session_id !== sessionId),
        }));
        if (get().sessionId === sessionId) {
          get().clearChat();
        }
      } catch (err) {
        console.error('[chatStore] deleteSession failed:', err);
        throw err;
      }
    },

    restoreSession: async (sessionId: string): Promise<void> => {
      // Workflow traces are in-memory only (never persisted). Switching to a
      // different session discards them; re-selecting the active session keeps
      // them so the workflow panel isn't wiped on a no-op reload.
      const isSameSession = get().sessionId === sessionId;

      // Blur the outgoing thread while the (potentially ~1s) fetch is in flight,
      // then clear the flag together with the new thread so it fades in.
      set({ restoringSession: true });

      // Request timeout is enforced inside the api layer (fetchWithTimeout).
      try {
        const msgs = await fetchSessionMessages(sessionId);
        const { messages: newMessages, messageOrder: newMessageOrder } = buildThreadFromBackend(msgs);

        // Fully replace thread and adopt the session id.
        set({
          messages: newMessages,
          messageOrder: newMessageOrder,
          sessionId,
          restoringSession: false,
          sessionUsage: undefined,
          lastCompletedSeq: null,
          ...(isSameSession
            ? {}
            : {
                workflowPanelClosed: true,
                workflowTraces: {},
                workflowTokens: {},
                activeWorkflowItems: [],
                activeWorkflowTokens: NO_TOKENS,
                selectedWorkflowSeq: null,
              }),
        });

        // Resolve agent info from the session. A session opened from a URL can be
        // older than the loaded sidebar page, so fetch the row when it's missing.
        let session = get().sessions.find((s) => s.session_id === sessionId) ?? null;
        if (!session) {
          session = await fetchSession(sessionId).catch((err) => {
            console.error('[chatStore] fetchSession failed:', err);
            return null;
          });
        }
        if (session) {
          if (get().agents.length === 0) {
            await get().loadAgents();
          }
          const agent = get().agents.find((a) => a.id === session.agent_id);
          if (agent) {
            set(agentSelection(agent));
          } else {
            set({
              selectedAgent: session.agent_id,
              selectedAgentLabel: session.agent_id,
              selectedAgentDescription: '',
              selectedAgentMultimodal: false,
              suggestedQuestions: [],
            });
          }
        }

        // Fetch usage summary (tokens + cost) in the background after messages are rendered.
        fetchSessionUsage(sessionId).then((usage) => {
          if (get().sessionId === sessionId) set({ sessionUsage: usage });
        }).catch((err) => {
          console.error('[chatStore] failed to fetch session usage in background:', err);
        });
      } catch (err) {
        // Leave existing state unchanged on failure or timeout.
        set({ restoringSession: false });
        console.error('[chatStore] restoreSession failed:', err);
      }
    },

    sendMessage: async (text: string, attachments: Attachment[] = []): Promise<void> => {
      if (!text.trim() || get().isLoading) return;

      // If there is no session yet (fresh page load or after clearChat),
      // the backend mints one and returns it on session_start
      // (adopted in buildEffects.onSessionStart).
      // We send the request without a session_id.
      const currentSessionId = get().sessionId;
      const isNewSession = !currentSessionId;

      const controller = new AbortController();
      abortController = controller;

      resetStreamingState();

      const userMsgId = `user-${++messageIdCounter}`;
      const userMsg: Message = {
        id: userMsgId,
        role: 'user',
        content: text,
        timestamp: Date.now(),
        attachments:
          attachments.length > 0
            ? attachments.map((a) => ({ filename: a.name, size: a.size, type: a.kind }))
            : undefined,
      };

      const assistantMsgId = `assistant-${++messageIdCounter}`;
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: {
          ...state.messages,
          [userMsgId]: userMsg,
          [assistantMsgId]: assistantMsg,
        },
        messageOrder: [...state.messageOrder, userMsgId, assistantMsgId],
        isLoading: true,
        // A new turn opens the workflow panel unless the user closes it again.
        workflowPanelClosed: false,
      }));

      const effects = buildEffects(assistantMsgId, isNewSession);

      try {
        for await (const event of streamChat(
          { prompt: text, agent_id: get().selectedAgent },
          currentSessionId,
          attachments,
          controller.signal,
        )) {
          dispatchStreamEvent(event, effects);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          effects.commitFinal({
            content: 'Generation stopped by user.',
            isStreaming: false,
          });
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          effects.commitFinal({
            content: `${errorMessage}`,
            isStreaming: false,
            isSuccess: false,
          });
        }
      } finally {
        cancelFlush();
        if (get().isLoading) set({ isLoading: false });
        abortController = null;
        // Fetch fresh usage (tokens + cost) from the backend now that the
        // invocation is done. Fire-and-forget: failure silently leaves the
        // previous values in place.
        const completedSessionId = get().sessionId;
        if (completedSessionId) {
          fetchSessionUsage(completedSessionId)
            .then((usage) => {
              // Guard against a session switch while this request was in flight,
              // so stale usage isn't written onto the now-current session.
              if (get().sessionId !== completedSessionId) return;
              set({ sessionUsage: usage });
            })
            .catch(() => { /* leave previous values on transient errors */ });
        }
      }
    },

    clearChat: (): void => {
      // Abort any in-flight stream before wiping state so we don't write
      // into a discarded message after the store is reset. Aborting drops the
      // SSE connection, which the backend detects to stop the agent.
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      cancelFlush();
      resetStreamingState();
      set({
        messages: {},
        messageOrder: [],
        isLoading: false,
        sessionId: '',
        sessionUsage: undefined,
        workflowTraces: {},
        workflowTokens: {},
        activeWorkflowItems: [],
        activeWorkflowTokens: NO_TOKENS,
        selectedWorkflowSeq: null,
        workflowPanelClosed: true,
        descriptionPanelClosed: true,
        lastCompletedSeq: null,
      });
    },

    setSelectedWorkflowSeq: (seq: number | null): void => {
      set(seq === null
        ? { selectedWorkflowSeq: seq }
        : { selectedWorkflowSeq: seq, workflowPanelClosed: false });
    },

    closeWorkflowPanel: (): void => {
      set({ workflowPanelClosed: true });
    },

    openWorkflowPanel: (): void => {
      set({ workflowPanelClosed: false });
    },

    closeDescriptionPanel: (): void => {
      set({ descriptionPanelClosed: true });
    },

    openDescriptionPanel: (): void => {
      set({ descriptionPanelClosed: false });
    },

    selectAgent: (agent: Agent): void => {
      set(agentSelection(agent));
    },

    loadAgents: async (): Promise<void> => {
      // Fetch once: skip if already loaded or a fetch is in flight. Both the
      // welcome screen and the agent selector call this on mount; only the
      // first call hits the network.
      if (get().agents.length > 0 || get().agentsLoading) return;
      set({ agentsLoading: true, agentsError: false });
      try {
        const list = await fetchAgents();
        set({ agents: list });
        // Auto-select a default only when nothing is selected yet (don't
        // clobber an agent already adopted by a restored session).
        if (list.length > 0 && !get().selectedAgent) {
          const savedId = sessionStorage.getItem('lastSelectedAgentId');
          const preferred = savedId ? list.find((a) => a.id === savedId) : undefined;
          const agent = preferred ?? list[0];
          set(agentSelection(agent));
        }
      } catch (err) {
        console.error('[chatStore] loadAgents failed:', err);
        set({ agentsError: true });
      } finally {
        set({ agentsLoading: false, agentsLoaded: true });
      }
    },

    // Abort without clearing history — the stream catch surfaces a stop message.
    // Aborting drops the SSE connection; the backend detects the disconnect and
    // stops the agent on the instance that owns the stream.
    stopGeneration: (): void => {
      if (abortController) {
        abortController.abort();
        abortController = null;
        set({ isLoading: false });
      }
    },

    resendMessage: (messageId: string): void => {
      const msg = get().messages[messageId];
      if (!msg || msg.role !== 'user') return;
      get().sendMessage(msg.content);
    },

    copyMessage: (messageId: string): void => {
      const msg = get().messages[messageId];
      if (!msg) return;
      navigator.clipboard.writeText(msg.content).catch(console.error);
    },

    guardInterrupt: (action: () => void): void => {
      // When idle, run immediately. When the agent is running, defer the
      // action and open the confirm dialog instead.
      if (!get().isLoading) {
        action();
        return;
      }
      pendingInterruptAction = action;
      set({ interruptConfirmOpen: true });
    },

    confirmInterrupt: (): void => {
      get().stopGeneration();
      const action = pendingInterruptAction;
      pendingInterruptAction = null;
      set({ interruptConfirmOpen: false });
      // Run after stopping so the stream is aborted before any navigation.
      action?.();
    },

    cancelInterrupt: (): void => {
      pendingInterruptAction = null;
      set({ interruptConfirmOpen: false });
    },
  };
});
