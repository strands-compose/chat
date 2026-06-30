/**
 * Zustand store for chat state and message orchestration.
 *
 * Sessions live here (not in the Sidebar) so any component can read them
 * without prop drilling, and loadSessions can be called from anywhere —
 * including inside sendMessage — without callback registration.
 */

import { create } from 'zustand';
import type { Attachment, Message, WorkflowItem } from '../types';
import {
  streamChat,
  fetchSessions,
  fetchSessionMessages,
  fetchSessionUsage,
  fetchAgents,
  renameSession as renameSessionApi,
  deleteSession as deleteSessionApi
} from '../services';
import type { Session, Agent, SessionMessage } from '../services';
import {
  dispatchStreamEvent,
  configureScheduler,
  scheduleFlush,
  cancelFlush,
  resetStreamingState,
} from './streaming';
import type { StreamingSideEffects } from './streaming';

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
  /** Aggregated token usage fetched from the backend after every turn and on restore.
   *  Both are undefined until the first successful fetch. */
  sessionInputTokens: number | undefined;
  sessionOutputTokens: number | undefined;
  /** Total inferred cost for the session, fetched from the backend.
   *  Undefined until first fetch completes. */
  sessionCost: number | undefined;
  /** Live workflow trace by backend assistant seq. Decoupled from Message so the
   *  thread is purely backend-derived. Empty on restore (traces are never persisted). */
  workflowTraces: Record<number, WorkflowItem[]>;
  /** Per-turn token totals by backend assistant seq, summed from agent_complete
   *  events. Empty on restore (not persisted; recomputed only for live turns). */
  workflowTokens: Record<number, { input: number; output: number }>;
  /** Trace for the in-flight turn, before its backend seq is known. Rendered live. */
  activeWorkflowItems: WorkflowItem[];
  /** Token totals for the in-flight turn, rendered live in the workflow panel. */
  activeWorkflowTokens: { input: number; output: number };
  /** Selected assistant seq for the workflow panel; null = auto (latest). */
  selectedWorkflowSeq: number | null;
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
  setSelectedAgent: (id: string, label: string, questions: string[], description: string, multimodal: boolean) => void;
  /** Fetch the agent list once and auto-select a default. Idempotent. */
  loadAgents: () => Promise<void>;
  stopGeneration: () => void;
  resendMessage: (messageId: string) => void;
  copyMessage: (messageId: string) => void;
  loadSessions: () => Promise<void>;
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
            // Keep the panel open and pointing at the just-completed turn.
            selectedWorkflowSeq: lastAssistantSeq >= 0 ? lastAssistantSeq : state.selectedWorkflowSeq,
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
    agentsLoading: false,
    agentsLoaded: false,
    agentsError: false,
    interruptConfirmOpen: false,
    sessionInputTokens: undefined,
    sessionOutputTokens: undefined,
    sessionCost: undefined,
    workflowTraces: {},
    workflowTokens: {},
    activeWorkflowItems: [],
    activeWorkflowTokens: { input: 0, output: 0 },
    selectedWorkflowSeq: null,
    lastCompletedSeq: null,

    loadSessions: async (): Promise<void> => {
      set({ sessionsLoading: true });
      try {
        const sessions = await fetchSessions();
        set({ sessions });
      } catch (err) {
        console.error('[chatStore] loadSessions failed:', err);
        // Keep existing list rather than wiping it on a transient error.
      } finally {
        set({ sessionsLoading: false });
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

      // Request timeout is enforced inside the api layer (fetchWithTimeout).
      try {
        const msgs = await fetchSessionMessages(sessionId);
        const { messages: newMessages, messageOrder: newMessageOrder } = buildThreadFromBackend(msgs);

        // Fully replace thread and adopt the session id.
        set({
          messages: newMessages,
          messageOrder: newMessageOrder,
          sessionId,
          sessionInputTokens: undefined,
          sessionOutputTokens: undefined,
          sessionCost: undefined,
          lastCompletedSeq: null,
          ...(isSameSession
            ? {}
            : {
                workflowTraces: {},
                workflowTokens: {},
                activeWorkflowItems: [],
                activeWorkflowTokens: { input: 0, output: 0 },
                selectedWorkflowSeq: null,
              }),
        });

        // Resolve agent info from the session
        const session = get().sessions.find((s) => s.session_id === sessionId);
        if (session) {
          if (get().agents.length === 0) {
            await get().loadAgents();
          }
          const agent = get().agents.find((a) => a.id === session.agent_id);
          if (agent) {
            set({
              selectedAgent: agent.id,
              selectedAgentLabel: agent.name,
              selectedAgentDescription: agent.description,
              selectedAgentMultimodal: agent.multimodal,
              suggestedQuestions: agent.suggested_questions ?? [],
            });
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
          if (get().sessionId === sessionId) {
            set({
              sessionInputTokens: usage.input_tokens > 0 ? usage.input_tokens : undefined,
              sessionOutputTokens: usage.output_tokens > 0 ? usage.output_tokens : undefined,
              sessionCost: usage.total_cost,
            });
          }
        }).catch((err) => {
          console.error('[chatStore] failed to fetch session usage in background:', err);
        });
      } catch (err) {
        // Leave existing state unchanged on failure or timeout.
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
              set({
                sessionInputTokens: usage.input_tokens > 0 ? usage.input_tokens : undefined,
                sessionOutputTokens: usage.output_tokens > 0 ? usage.output_tokens : undefined,
                sessionCost: usage.total_cost,
              });
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
        sessionInputTokens: undefined,
        sessionOutputTokens: undefined,
        sessionCost: undefined,
        workflowTraces: {},
        workflowTokens: {},
        activeWorkflowItems: [],
        activeWorkflowTokens: { input: 0, output: 0 },
        selectedWorkflowSeq: null,
        lastCompletedSeq: null,
      });
    },

    setSelectedWorkflowSeq: (seq: number | null): void => {
      set({ selectedWorkflowSeq: seq });
    },

    setSelectedAgent: (id: string, label: string, questions: string[], description: string, multimodal: boolean): void => {
      set({
        selectedAgent: id,
        selectedAgentLabel: label,
        selectedAgentDescription: description,
        selectedAgentMultimodal: multimodal,
        suggestedQuestions: questions,
      });
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
          set({
            selectedAgent: agent.id,
            selectedAgentLabel: agent.name,
            selectedAgentDescription: agent.description,
            selectedAgentMultimodal: agent.multimodal,
            suggestedQuestions: agent.suggested_questions ?? [],
          });
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
