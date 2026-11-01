/**
 * Collapsible card for a single tool invocation.
 *
 * Self-contained reusable primitive: given a tool name and optional
 * input/output, renders a header row (icon, name, argument preview, status)
 * that expands to show formatted input and output. Pure props in — no store
 * or feature coupling.
 */

import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { memo, useState } from 'react';
import { LuChevronDown, LuChevronUp, LuCircleAlert, LuCircleCheck, LuWrench } from 'react-icons/lu';
import { cn } from '@/services/utils';
import styles from './ToolBadge.module.css';
import { toolInputPreview } from './toolInputPreview';

// ======================
// TYPES & CONSTANTS
// ======================

export type ToolBadgeStatus = 'running' | 'success' | 'error';

export interface ToolBadgeProps {
  /** Tool label shown in the header (monospace). */
  toolName: string;
  /** Raw tool arguments — string or object, previewed in the header and rendered when expanded. */
  toolInput?: unknown;
  /** Tool result string, rendered when expanded. */
  toolOutput?: string;
  /** Lifecycle status; no status icon is shown when undefined. */
  status?: ToolBadgeStatus;
  /** Overrides the displayed name, rendered in the UI font (e.g. "Ask Doc Expert"). */
  title?: string;
  /** Overrides the default wrench icon. */
  icon?: ReactNode;
  /** CSS colour tinting the icon tile (e.g. `var(--sc-agent-2)`). */
  accentColor?: string;
  /** Status label for `error`. Defaults to "Failed". */
  errorLabel?: string;
  /** Start in the expanded state. Defaults to collapsed. */
  defaultExpanded?: boolean;
}

/** Characters of an input value or output shown before the "Show full" toggle. */
const PREVIEW_LEN = 800;

/** Cuts text to the preview length unless the full text was requested. */
const clipText = (text: string, isFull: boolean): string =>
  isFull || text.length <= PREVIEW_LEN ? text : `${text.substring(0, PREVIEW_LEN)}…`;

/** Display string for one input argument value. */
const formatInputValue = (value: unknown): string =>
  typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : String(value);

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
  status,
  title,
  icon,
  accentColor,
  errorLabel = 'Failed',
  defaultExpanded = false,
}: ToolBadgeProps): ReactElement => {
  // ======================
  // STATE
  // ======================
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showFullInput, setShowFullInput] = useState(false);
  const [showFullOutput, setShowFullOutput] = useState(false);

  const hasDetails = computeHasDetails(toolInput, toolOutput);
  const isError = status === 'error';
  const tileStyle = accentColor ? ({ '--tool-accent': accentColor } as CSSProperties) : undefined;

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderStatus = (): ReactElement | null => {
    if (status === 'running') {
      return (
        <span className={cn(styles.status, styles.statusRunning)}>
          <span className={styles.spinner} aria-hidden="true" />
          Running
        </span>
      );
    }
    if (status === 'error') {
      return (
        <span className={cn(styles.status, styles.statusError)}>
          <LuCircleAlert size={17} />
          {errorLabel}
        </span>
      );
    }
    if (status === 'success') {
      return (
        <span className={cn(styles.status, styles.statusOk)} title="Completed">
          <LuCircleCheck size={17} />
        </span>
      );
    }
    return null;
  };

  const renderMoreLink = (isFull: boolean, onToggle: () => void, label: string): ReactElement => (
    <button type="button" className={styles.moreLink} onClick={onToggle}>
      {isFull ? 'Show less' : label}
    </button>
  );

  const renderInputObject = (inputData: Record<string, unknown>): ReactElement => {
    const entries = Object.entries(inputData).map(([key, value]): [string, string] => [
      key,
      formatInputValue(value),
    ]);
    const isLong = entries.some(([, text]) => text.length > PREVIEW_LEN);
    return (
      <div className={styles.detailSection}>
        <div className={styles.detailLabel}>Input</div>
        <div className={styles.kv}>
          {entries.map(([key, text]) => (
            <div key={key} className={styles.kvRow}>
              <span className={styles.kvKey}>{key}</span>
              <span className={styles.kvValue}>{clipText(text, showFullInput)}</span>
            </div>
          ))}
        </div>
        {isLong &&
          renderMoreLink(showFullInput, () => setShowFullInput((v) => !v), 'Show full input')}
      </div>
    );
  };

  const renderInputPre = (value: string): ReactElement => {
    const isLong = value.length > PREVIEW_LEN;
    return (
      <div className={styles.detailSection}>
        <div className={styles.detailLabel}>Input</div>
        <pre className={cn(styles.pre, isLong && !showFullInput && styles.preClipped)}>
          {clipText(value, showFullInput)}
        </pre>
        {isLong &&
          renderMoreLink(showFullInput, () => setShowFullInput((v) => !v), 'Show full input')}
      </div>
    );
  };

  const renderInput = (): ReactElement | null => {
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
    const isLong = toolOutput.length > PREVIEW_LEN;
    return (
      <div className={styles.detailSection}>
        <div className={styles.detailLabel}>{isError ? 'Error' : 'Output'}</div>
        <pre
          className={cn(
            styles.pre,
            isError && styles.preError,
            isLong && !showFullOutput && styles.preClipped,
          )}
        >
          {clipText(toolOutput, showFullOutput)}
        </pre>
        {isLong &&
          renderMoreLink(showFullOutput, () => setShowFullOutput((v) => !v), 'Show full output')}
      </div>
    );
  };

  return (
    <div className={cn(styles.container, isError && styles.containerError)}>
      <button
        className={cn(styles.header, hasDetails && styles.clickable)}
        onClick={() => {
          if (hasDetails) setIsExpanded((v) => !v);
        }}
        type="button"
        disabled={!hasDetails}
        aria-expanded={hasDetails ? isExpanded : undefined}
      >
        <span className={cn(styles.tile, accentColor && styles.tileAccent)} style={tileStyle}>
          {icon ?? <LuWrench size={15} />}
        </span>
        <span className={cn(styles.name, title && styles.nameTitle)}>{title ?? toolName}</span>
        <span className={styles.preview}>{toolInputPreview(toolInput)}</span>
        {renderStatus()}
        {hasDetails && (
          <span className={styles.chevron}>
            {isExpanded ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
          </span>
        )}
      </button>
      {isExpanded && hasDetails && (
        <div className={styles.details}>
          {renderInput()}
          {renderOutput()}
        </div>
      )}
    </div>
  );
};

export const ToolBadge = memo(ToolBadgeComponent);
