import type { ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import * as Radix from '@radix-ui/react-dropdown-menu';
import { cn } from '@/services/utils';
import styles from './DropdownMenu.module.css';

// ======================
// ROOT + TRIGGER (re-exported as-is)
// ======================

/** Menu root. Controls open state (or pass `open`/`onOpenChange` to control it). */
export const DropdownMenu = Radix.Root;

/** Trigger. Use `asChild` to keep your own button element. */
export const DropdownMenuTrigger = Radix.Trigger;

// ======================
// CONTENT
// ======================

interface DropdownMenuContentProps {
  children: ReactNode;
  /** Alignment relative to the trigger. Defaults to `'start'`. */
  align?: 'start' | 'center' | 'end';
  /** Gap from the trigger in px. Defaults to `6`. */
  sideOffset?: number;
  className?: string;
}

const DropdownMenuContentComponent = ({
  children,
  align = 'start',
  sideOffset = 6,
  className,
}: DropdownMenuContentProps): ReactElement => (
  <Radix.Portal>
    <Radix.Content
      className={cn(styles.content, className)}
      align={align}
      sideOffset={sideOffset}
    >
      {children}
    </Radix.Content>
  </Radix.Portal>
);

export const DropdownMenuContent = memo(DropdownMenuContentComponent);

// ======================
// ITEM
// ======================

interface DropdownMenuItemProps {
  children: ReactNode;
  onSelect?: () => void;
  /** Marks the item as the active choice (applies checked styling). */
  isChecked?: boolean;
  /** Disable the item (non-selectable, dimmed). */
  disabled?: boolean;
  /** Native tooltip text. */
  title?: string;
  className?: string;
}

const DropdownMenuItemComponent = ({
  children,
  onSelect,
  isChecked = false,
  disabled = false,
  title,
  className,
}: DropdownMenuItemProps): ReactElement => (
  <Radix.Item
    className={cn(styles.item, className)}
    data-state={isChecked ? 'checked' : undefined}
    disabled={disabled}
    title={title}
    onSelect={onSelect}
  >
    {children}
  </Radix.Item>
);

export const DropdownMenuItem = memo(DropdownMenuItemComponent);

// ======================
// SEPARATOR
// ======================

const DropdownMenuSeparatorComponent = (): ReactElement => (
  <Radix.Separator className={styles.separator} />
);

export const DropdownMenuSeparator = memo(DropdownMenuSeparatorComponent);
