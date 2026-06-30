import type { ReactElement, ReactNode } from 'react';
import { memo } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import styles from './Tooltip.module.css';

interface TooltipProps {
  /** The trigger element. Rendered via `asChild` so it stays your own node. */
  children: ReactNode;
  /** Tooltip text. */
  label: string;
  /** Preferred side. Defaults to `'top'`. */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Open delay in ms. Defaults to `200`. */
  delayDuration?: number;
}

const TooltipComponent = ({
  children,
  label,
  side = 'top',
  delayDuration = 200,
}: TooltipProps): ReactElement => (
  <RadixTooltip.Root delayDuration={delayDuration}>
    <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
    <RadixTooltip.Portal>
      <RadixTooltip.Content className={styles.content} side={side} sideOffset={6}>
        {label}
        <RadixTooltip.Arrow className={styles.arrow} />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  </RadixTooltip.Root>
);

export const Tooltip = memo(TooltipComponent);

/**
 * App-wide tooltip provider. Mount once near the root so individual
 * `Tooltip`s share timing and don't each spin up their own provider.
 */
export const TooltipProvider = RadixTooltip.Provider;
