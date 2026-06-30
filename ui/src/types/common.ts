/**
 * Domain model types shared across the application.
 */

/**
 * A single entry in the assistant's Workflow panel.
 *
 * Every event the streaming pipeline keeps for display (text run, tool call,
 * agent separator, etc.) becomes one `WorkflowItem`. Fields are optional because
 * each `type` populates a different subset.
 */
export interface WorkflowItem {
  type:
    | 'text'
    | 'tool'
    | 'reasoning'
    | 'agent_start'
    | 'agent_stop'
    | 'handoff';

  /** Plain text content (for `text`, `reasoning`, `handoff`, etc.). */
  content: string;

  /** Tool label/name — used by `tool` items. */
  toolName?: string;
  /** Raw tool argument payload, rendered in the expanded badge. */
  toolInput?: unknown;
  /** Tool result string, rendered in the expanded badge. */
  toolOutput?: string;

  /** Originating agent — used for filtering and the agent separator label. */
  agentName?: string;

  /** True when the separator was emitted by an orchestrator (multiagent_start/complete) rather than a plain agent. */
  isOrchestrator?: boolean;
}

/** A consecutive group of WorkflowItems sharing the same type & agent. */
export interface WorkflowGroupedItems {
  type: WorkflowItem['type'];
  items: WorkflowItem[];
}

/**
 * Metadata for a single file attached to a user message.
 * Persisted in the backend and carried through the store for display on restore.
 */
export interface AttachmentMetadata {
  filename: string;
  size: number;
  type: 'image' | 'document';
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Backend sequence number for rows built from persisted data; undefined for
   *  the transient in-flight assistant message before the post-turn refetch. */
  seq?: number;
  isStreaming?: boolean;
  isSuccess?: boolean;
  timestamp?: number;
  /** File attachments sent with this message. Undefined when there are none. */
  attachments?: AttachmentMetadata[];
}
