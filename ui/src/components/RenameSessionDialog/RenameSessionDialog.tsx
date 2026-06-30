import type { ReactElement, ChangeEvent, KeyboardEvent } from 'react';
import { memo, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { FiEdit } from 'react-icons/fi';
import { Button } from '../Button';
import { TextField } from '../TextField';
import { Dialog } from '../Dialog';

interface RenameSessionDialogProps {
  open: boolean;
  initialTitle: string;
  onConfirm: (newTitle: string) => void;
  onCancel: () => void;
}

const RenameSessionDialogComponent = ({
  open,
  initialTitle,
  onConfirm,
  onCancel,
}: RenameSessionDialogProps): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState<string | undefined>(undefined);

  // ======================
  // HANDLERS
  // ======================
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
    if (error && e.target.value.trim().length > 0) {
      setError(undefined);
    }
  };

  const handleConfirm = (): void => {
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Title cannot be empty');
      return;
    }
    if (trimmed.length > 255) {
      setError('Title cannot exceed 255 characters');
      return;
    }
    onConfirm(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderActions = (): ReactElement => (
    <>
      <AlertDialog.Cancel asChild>
        <Button variant="ghost">Cancel</Button>
      </AlertDialog.Cancel>
      <Button variant="primary" onClick={handleConfirm} disabled={!title.trim()}>
        Rename
      </Button>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title="Rename Session"
      titleIcon={<FiEdit style={{ color: 'var(--aws-orange)' }} aria-hidden="true" />}
      description="Enter a new name for this chat session."
      actions={renderActions()}
    >
      <TextField
        aria-label="Session Name"
        value={title}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        error={error}
        autoFocus
        placeholder="Enter custom name..."
      />
    </Dialog>
  );
};

export const RenameSessionDialog = memo(RenameSessionDialogComponent);
