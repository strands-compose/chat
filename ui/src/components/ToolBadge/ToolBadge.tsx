/**
 * Collapsible badge for a single tool invocation.
 *
 * Self-contained reusable primitive: given a tool name and optional
 * input/output, renders a header row that expands to show formatted
 * argument and result detail. Pure props in — no store or feature coupling.
 */

import type { ReactElement } from 'react';
import { memo, useState } from 'react';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { cn } from '@/services/utils';
import styles from './ToolBadge.module.css';

export interface ToolBadgeProps {
  /** Tool label shown in the header. */
  toolName: string;
  /** Raw tool arguments — string or object, rendered when expanded. */
  toolInput?: unknown;
  /** Tool result string, rendered when expanded. */
  toolOutput?: string;
  /** Optional originating agent, shown as an "Agent:" tag. */
  agentName?: string;
  /** Start in the expanded state. Defaults to collapsed. */
  defaultExpanded?: boolean;
}

/** True when there is meaningful input/output worth expanding. */
const computeHasDetails = (toolInput: unknown, toolOutput?: string): boolean => {
  const hasInput =
    !!toolInput &&
    !(typeof toolInput === 'object' && Object.keys(toolInput as object).length === 0);
  return hasInput || !!toolOutput;
};

const ToolBadgeComponent = ({
  toolName,
  toolInput,
  toolOutput,
  agentName,
  defaultExpanded = false,
}: ToolBadgeProps): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const hasDetails = computeHasDetails(toolInput, toolOutput);

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderInputObject = (inputData: Record<string, unknown>): ReactElement => (
    <div className={styles.detailSection}>
      <div className={styles.detailLabel}>Input</div>
      <div className={styles.detailContent}>
        {Object.entries(inputData).map(([key, value]) => (
          <div key={key} className={styles.detailRow}>
            <span className={styles.detailKey}>{key}:</span>
            <span className={styles.detailValue}>
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInputPre = (value: string): ReactElement => (
    <div className={styles.detailSection}>
      <div className={styles.detailLabel}>Input</div>
      <pre className={styles.detailPre}>{value}</pre>
    </div>
  );

  const renderJsonInput = (): ReactElement | null => {
    if (!toolInput) return null;
    if (typeof toolInput === 'object' && Object.keys(toolInput as object).length === 0) return null;
    try {
      const inputData = typeof toolInput === 'string' ? JSON.parse(toolInput) : toolInput;
      if (typeof inputData !== 'object' || inputData === null) {
        return renderInputPre(String(inputData));
      }
      return renderInputObject(inputData as Record<string, unknown>);
    } catch {
      return renderInputPre(String(toolInput));
    }
  };

  const renderOutput = (): ReactElement | null => {
    if (!toolOutput) return null;
    const MAX_LEN = 800;
    const display =
      toolOutput.length > MAX_LEN ? `${toolOutput.substring(0, MAX_LEN)}\n... (truncated)` : toolOutput;
    return (
      <div className={styles.detailSection}>
        <div className={styles.detailLabel}>Output</div>
        <pre className={styles.detailPre}>{display}</pre>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <button
        className={cn(styles.header, hasDetails && styles.clickable)}
        onClick={() => { if (hasDetails) setIsExpanded((v) => !v); }}
        type="button"
        disabled={!hasDetails}
      >
        {hasDetails && (
          <span className={styles.chevron}>
            {isExpanded ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
          </span>
        )}
        <span className={styles.icon}>⚙</span>
        <span className={styles.label}>{toolName || ''}</span>
        {agentName && <span className={styles.agentLabel}>Agent: {agentName}</span>}
      </button>
      {isExpanded && hasDetails && (
        <div className={styles.details}>
          {renderJsonInput()}
          {renderOutput()}
        </div>
      )}
    </div>
  );
};

export const ToolBadge = memo(ToolBadgeComponent);
