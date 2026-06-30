/**
 * API request/response types.
 */

// ====== REQUEST ======
export interface ChatRequest {
  prompt: string;
  agent_id: string;
  session_id?: string;
}

// ====== MEDIA CAPABILITIES ======
/** A single supported attachment format. */
export interface MediaFormat {
  format: string;
  extensions: string[];
  mime_type: string;
}

/** A category grouping of supported formats. */
export interface MediaCategory {
  category: 'image' | 'document';
  formats: MediaFormat[];
}

/** Supported attachment formats and configured size/count limits. */
export interface MediaCapabilities {
  categories: MediaCategory[];
  max_file_bytes: number;
  max_total_bytes: number;
  max_block_count: number;
}

// ====== ATTACHMENTS ======
/** A user-selected file awaiting send. */
export interface Attachment {
  id: string;
  file: File;
  kind: 'image' | 'document';
  name: string;
  size: number;
  previewUrl?: string;
}

// ====== BACKEND WIRE FORMAT ======
/** Raw event from the backend SSE stream. */
export interface BackendStreamEvent {
  type: string;
  agent_name: string;
  timestamp: string;
  data: Record<string, unknown>;
}

// ====== FRONTEND EVENT ======
/**
 * Normalised event consumed by the streaming pipeline.
 *
 * `type` mirrors the backend's EventType enum:
 *   - Session:       session_start, session_end
 *   - Agent / orch:  agent_start, multiagent_start, agent_complete, multiagent_complete
 *   - Streaming:     token, reasoning, interrupt
 *   - Tools:         tool_start, tool_end
 *   - Multi-agent:   node_start, node_stop, handoff
 *   - Errors:        error
 */
export interface ChatStreamEvent {
  type:
    | 'session_start'
    | 'session_end'
    | 'agent_start'
    | 'multiagent_start'
    | 'token'
    | 'tool_start'
    | 'tool_end'
    | 'reasoning'
    | 'interrupt'
    | 'agent_complete'
    | 'multiagent_complete'
    | 'error'
    | 'node_start'
    | 'node_stop'
    | 'handoff';

  /** Plain text payload — used by `token`, `reasoning`, `error`. */
  content?: string;

  /** Tool label (or fallback to tool name) — used by `tool_start` / `tool_end`. */
  name?: string;

  /** Tool argument object — used by `tool_start`. */
  input?: unknown;

  /** Tool result string — used by `tool_end`. */
  output?: string;

  /** Tool exit status — used by `tool_end`. */
  status?: 'success' | 'error';

  /** Originating agent (root or sub-agent) — present on virtually every event. */
  agent_name?: string;

  /** Sub-agent id for Swarm/Graph topologies — used by `node_start` / `node_stop`. */
  node_id?: string;

  /** Aggregated token usage reported by `agent_complete` / `multiagent_complete`. */
  input_tokens?: number;
  output_tokens?: number;

  /** Backend-minted session id, carried on `session_start` for a new conversation. */
  session_id?: string;
}
