import type { ReactElement } from 'react';
import { memo } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { FiAlertTriangle } from 'react-icons/fi';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Dialog heading. */
  title: string;
  /** Body message. */
  message: string;
  /** Label for the destructive confirm button. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
  /** When true, the cancel button is not rendered. Defaults to false. */
  hideCancelButton?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmDialogComponent = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  hideCancelButton = false,
  onConfirm,
  onCancel = () => {},
}: ConfirmDialogProps): ReactElement => {
  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderActions = (): ReactElement => (
    <>
      {!hideCancelButton && (
        <AlertDialog.Cancel asChild>
          <Button variant="ghost">{cancelLabel}</Button>
        </AlertDialog.Cancel>
      )}
      <AlertDialog.Action asChild>
        <Button variant="primary" className={styles.confirmBtn} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </AlertDialog.Action>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      titleIcon={<FiAlertTriangle className={styles.icon} aria-hidden="true" />}
      actions={renderActions()}
    >
      <AlertDialog.Description className={styles.message}>
        {message}
      </AlertDialog.Description>
    </Dialog>
  );
};

export const ConfirmDialog = memo(ConfirmDialogComponent);
