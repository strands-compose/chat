import type { ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import * as Radix from '@radix-ui/react-tabs';
import { cn } from '@/services/utils';
import styles from './Tabs.module.css';

// ======================
// ROOT
// ======================

interface TabsProps {
  children: ReactNode;
  /** Controlled active tab value. */
  value?: string;
  /** Initial active tab value when uncontrolled. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const TabsComponent = ({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
}: TabsProps): ReactElement => (
  <Radix.Root
    value={value}
    defaultValue={defaultValue}
    onValueChange={onValueChange}
    className={cn(styles.root, className)}
  >
    {children}
  </Radix.Root>
);

export const Tabs = memo(TabsComponent);

// ======================
// LIST
// ======================

interface TabsListProps {
  children: ReactNode;
  /** Accessible label for the tab set. */
  label?: string;
  className?: string;
}

const TabsListComponent = ({ children, label, className }: TabsListProps): ReactElement => (
  <Radix.List className={cn(styles.list, className)} aria-label={label}>
    {children}
  </Radix.List>
);

export const TabsList = memo(TabsListComponent);

// ======================
// TRIGGER
// ======================

interface TabsTriggerProps {
  children: ReactNode;
  /** Value linking this trigger to its content panel. */
  value: string;
  disabled?: boolean;
  className?: string;
}

const TabsTriggerComponent = ({
  children,
  value,
  disabled,
  className,
}: TabsTriggerProps): ReactElement => (
  <Radix.Trigger className={cn(styles.trigger, className)} value={value} disabled={disabled}>
    {children}
  </Radix.Trigger>
);

export const TabsTrigger = memo(TabsTriggerComponent);

// ======================
// CONTENT
// ======================

interface TabsContentProps {
  children: ReactNode;
  /** Value linking this panel to its trigger. */
  value: string;
  className?: string;
}

const TabsContentComponent = ({ children, value, className }: TabsContentProps): ReactElement => (
  <Radix.Content className={cn(styles.content, className)} value={value}>
    {children}
  </Radix.Content>
);

export const TabsContent = memo(TabsContentComponent);
