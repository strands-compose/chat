/**
 * Derive a one-line "what is happening now" hint from the live workflow trace,
 * shown under the streaming assistant message (e.g. "Doc Expert is answering
 * “Explain the three…”").
 *
 * Pure function over the trace; kept next to the chat view because only the
 * chat thread uses it.
 */

import type { WorkflowItem } from '@/types';
import { formatAgentLabel } from '@/services/utils';

export interface LiveActivity {
  /** Display name of the agent doing the work. */
  agentLabel: string;
  /** What it is doing, e.g. `is answering “…”` or `is running read doc`. */
  detail: string;
}

const MAX_DETAIL = 42;

const clip = (text: string): string =>
  text.length <= MAX_DETAIL ? text : `${text.slice(0, MAX_DETAIL).trimEnd()}…`;

/** First string value of a tool input, used as the question a sub-agent answers. */
const firstInputText = (input: unknown): string | undefined => {
  if (typeof input === 'string') return input;
  if (input && typeof input === 'object') {
    const first = Object.values(input as Record<string, unknown>).find((v) => typeof v === 'string');
    return first as string | undefined;
  }
  return undefined;
};

/**
 * Most recent running activity: a running delegate call (tool named after an
 * agent in the trace), else a running tool, else the last agent still open.
 * Returns `null` when nothing is derivable.
 */
export function selectLiveActivity(items: WorkflowItem[]): LiveActivity | null {
  const agentNames = new Set(
    items.filter((i) => i.type === 'agent_start' && i.agentName).map((i) => i.agentName!.toUpperCase()),
  );

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (item.type !== 'tool' || item.toolStatus !== 'running' || !item.toolName) continue;

    const target = item.toolName.toUpperCase();
    if (agentNames.has(target)) {
      const question = firstInputText(item.toolInput);
      return {
        agentLabel: formatAgentLabel(item.toolName),
        detail: question ? `is answering “${clip(question)}”` : 'is working',
      };
    }
    return {
      agentLabel: formatAgentLabel(item.agentName),
      detail: `is running ${item.toolName}`,
    };
  }

  const open = new Map<string, number>();
  for (const item of items) {
    if (!item.agentName) continue;
    if (item.type === 'agent_start') open.set(item.agentName, (open.get(item.agentName) ?? 0) + 1);
    if (item.type === 'agent_stop') open.set(item.agentName, (open.get(item.agentName) ?? 1) - 1);
  }
  for (let i = items.length - 1; i >= 0; i--) {
    const name = items[i].agentName;
    if (items[i].type === 'agent_start' && name && (open.get(name) ?? 0) > 0) {
      return { agentLabel: formatAgentLabel(name), detail: 'is working' };
    }
  }
  return null;
}
