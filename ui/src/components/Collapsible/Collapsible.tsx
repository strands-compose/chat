import type { ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import * as Radix from '@radix-ui/react-collapsible';

// ======================
// ROOT + TRIGGER + CONTENT (thin re-exports)
// ======================

interface CollapsibleProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const CollapsibleComponent = ({
  children,
  open,
  defaultOpen,
  disabled,
  onOpenChange,
  className,
}: CollapsibleProps): ReactElement => (
  <Radix.Root
    open={open}
    defaultOpen={defaultOpen}
    disabled={disabled}
    onOpenChange={onOpenChange}
    className={className}
  >
    {children}
  </Radix.Root>
);

export const Collapsible = memo(CollapsibleComponent);

/** Trigger. Use `asChild` to keep your own button element. */
export const CollapsibleTrigger = Radix.Trigger;

/** Collapsible body. */
export const CollapsibleContent = Radix.Content;
