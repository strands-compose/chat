import type { ReactElement } from 'react';
import { memo } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { FiAlertCircle } from 'react-icons/fi';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import styles from './ErrorDialog.module.css';

export interface ErrorDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Dialog heading. Defaults to "Error". */
  title?: string;
  /** Error message shown in the body. */
  message: string;
  onClose: () => void;
}

const ErrorDialogComponent = ({
  open,
  title = 'Error',
  message,
  onClose,
}: ErrorDialogProps): ReactElement => (
  <Dialog
    open={open}
    onClose={onClose}
    title={title}
    titleIcon={<FiAlertCircle className={styles.icon} aria-hidden="true" />}
    actions={
      <AlertDialog.Action asChild>
        <Button variant="primary" onClick={onClose}>
          OK
        </Button>
      </AlertDialog.Action>
    }
  >
    <AlertDialog.Description className={styles.message}>
      {message}
    </AlertDialog.Description>
  </Dialog>
);

export const ErrorDialog = memo(ErrorDialogComponent);
