/**
 * MultiSelect — accessible multi-select dropdown built on Radix Popover.
 *
 * The trigger shows selected items as removable badge pills; an inline clear
 * button removes all selections without opening the popover.
 */

import type { ReactElement } from 'react';
import { memo, useMemo, useRef, useState } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FiCheck, FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import { cn } from '@/services/utils';
import styles from './MultiSelect.module.css';

// Approximate height of one option row in px — used by the virtualizer.
const ITEM_HEIGHT = 32;

// ======================
// TYPES
// ======================

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  /** Currently selected option values. */
  value: string[];
  onChange: (value: string[]) => void;
  /** Accessible name for the control and placeholder text when empty. */
  label: string;
  /** Placeholder text when nothing is selected. Defaults to `label`. */
  placeholder?: string;
  /** Show a search input that filters options by label. */
  filterable?: boolean;
}

interface OptionListProps {
  options: MultiSelectOption[];
  selectedSet: Set<string>;
  onToggle: (value: string) => void;
}

// ======================
// OPTION LIST (VIRTUALIZED)
// ======================

const OptionListComponent = ({ options, selectedSet, onToggle }: OptionListProps): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================

  const listRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderOption = (opt: MultiSelectOption): ReactElement => {
    const checked = selectedSet.has(opt.value);
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        className={styles.option}
        onClick={() => onToggle(opt.value)}
      >
        <span className={cn(styles.checkbox, checked && styles.checkboxChecked)}>
          {checked && <FiCheck size={12} />}
        </span>
        <span className={styles.optionLabel}>{opt.label}</span>
      </button>
    );
  };

  if (options.length === 0) {
    return <div className={styles.empty}>No matches</div>;
  }

  return (
    <div ref={listRef} className={styles.list}>
      {/* Spacer sets the total scrollable height so the scrollbar is accurate */}
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderOption(options[virtualItem.index])}
          </div>
        ))}
      </div>
    </div>
  );
};

const OptionList = memo(OptionListComponent);

// ======================
// COMPONENT
// ======================

const MultiSelectComponent = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  filterable = false,
}: MultiSelectProps): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedSet = useMemo(() => new Set(value), [value]);

  const selectedOptions = useMemo(
    () => options.filter((opt) => selectedSet.has(opt.value)),
    [options, selectedSet],
  );

  const visibleOptions = useMemo(() => {
    if (!filterable || query.trim() === '') return options;
    const needle = query.trim().toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(needle));
  }, [options, filterable, query]);

  // ======================
  // HANDLERS
  // ======================

  const toggleOption = (optionValue: string): void => {
    if (selectedSet.has(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
      return;
    }
    onChange([...value, optionValue]);
  };

  const handleSelectAll = (): void => {
    onChange(visibleOptions.map((opt) => opt.value));
  };

  const handleClear = (): void => {
    onChange([]);
  };

  const handleOpenChange = (next: boolean): void => {
    setOpen(next);
    if (!next) setQuery('');
  };

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderBadge = (opt: MultiSelectOption): ReactElement => (
    <span key={opt.value} className={styles.badge}>
      <span className={styles.badgeLabel}>{opt.label}</span>
      <button
        type="button"
        className={styles.badgeRemove}
        onClick={(e) => { e.stopPropagation(); toggleOption(opt.value); }}
        aria-label={`Remove ${opt.label}`}
      >
        <FiX size={10} />
      </button>
    </span>
  );

  const renderTriggerContent = (): ReactElement => {
    if (value.length === 0) {
      return (
        <>
          <span className={styles.placeholder}>{placeholder ?? label}</span>
          <FiChevronDown size={14} className={styles.triggerChevron} />
        </>
      );
    }

    return (
      <>
        <div className={styles.badgeList}>
          {selectedOptions.map(renderBadge)}
        </div>
        <button
          type="button"
          className={styles.clearAll}
          onClick={(e) => { e.stopPropagation(); handleClear(); }}
          aria-label="Clear all"
        >
          <FiX size={13} />
        </button>
        <FiChevronDown size={14} className={styles.triggerChevron} />
      </>
    );
  };

  const renderTopBar = (): ReactElement => (
    <div className={styles.topBar}>
      {filterable && (
        <>
          <FiSearch size={13} className={styles.filterIcon} />
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Filter…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={`Filter ${label}`}
          />
          {query !== '' && (
            <button
              type="button"
              className={styles.filterClear}
              onClick={() => setQuery('')}
              aria-label="Clear filter"
            >
              <FiX size={13} />
            </button>
          )}
        </>
      )}
      <div className={styles.topBarActions}>
        <button type="button" className={styles.actionBtn} onClick={handleSelectAll}>
          Select all
        </button>
        <button type="button" className={styles.actionBtn} onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );

  return (
    <RadixPopover.Root open={open} onOpenChange={handleOpenChange}>
      <RadixPopover.Trigger asChild>
        {/* div instead of button so badge <button> elements are valid children */}
        <div
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={label}
          tabIndex={0}
          className={styles.trigger}
          data-empty={value.length === 0 ? '' : undefined}
        >
          {renderTriggerContent()}
        </div>
      </RadixPopover.Trigger>

      <RadixPopover.Portal>
        <RadixPopover.Content className={styles.popover} align="start" sideOffset={6}>
          {renderTopBar()}
          <OptionList options={visibleOptions} selectedSet={selectedSet} onToggle={toggleOption} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export const MultiSelect = memo(MultiSelectComponent);
