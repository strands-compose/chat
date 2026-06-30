import type { ReactElement } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import type { Attachment } from '@/types/api';
import { Button } from '../Button';
import { Dialog } from '../Dialog';
import { Markdown } from '../Markdown';
import styles from './AttachmentViewerDialog.module.css';

interface AttachmentViewerDialogProps {
  /** The attachment to preview, or null when the dialog is closed. */
  attachment: Attachment | null;
  onClose: () => void;
}

type PreviewMode = 'image' | 'pdf' | 'markdown' | 'text' | 'download';

const TEXT_EXTENSIONS = new Set(['txt', 'csv', 'html', 'htm', 'json']);
const MARKDOWN_EXTENSIONS = new Set(['md', 'markdown']);

const extensionOf = (name: string): string => {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
};

const previewModeOf = (attachment: Attachment): PreviewMode => {
  if (attachment.kind === 'image') return 'image';
  const extension = extensionOf(attachment.name);
  if (extension === 'pdf') return 'pdf';
  if (MARKDOWN_EXTENSIONS.has(extension)) return 'markdown';
  if (TEXT_EXTENSIONS.has(extension)) return 'text';
  return 'download';
};

const AttachmentViewerDialogComponent = ({
  attachment,
  onClose,
}: AttachmentViewerDialogProps): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const [loadedText, setLoadedText] = useState<{ id: string; content: string } | null>(null);

  const mode = attachment ? previewModeOf(attachment) : null;
  const needsText = mode === 'text' || mode === 'markdown';

  // Derive the object URL synchronously (used by the image, the PDF frame, and
  // the "open in new tab" action); a cleanup-only effect revokes it.
  const fileUrl = useMemo(
    () => (attachment ? URL.createObjectURL(attachment.file) : null),
    [attachment],
  );
  useEffect(() => {
    if (!fileUrl) return;
    return () => URL.revokeObjectURL(fileUrl);
  }, [fileUrl]);

  // Read text/markdown lazily, tagging the result with the attachment id so a
  // stale read is ignored once the previewed attachment changes.
  useEffect(() => {
    if (!attachment || !needsText) return;
    let active = true;
    attachment.file
      .text()
      .then((content) => {
        if (active) setLoadedText({ id: attachment.id, content });
      })
      .catch(() => {
        if (active) setLoadedText({ id: attachment.id, content: 'Unable to read file contents.' });
      });
    return () => {
      active = false;
    };
  }, [attachment, needsText]);

  const textContent = attachment && loadedText?.id === attachment.id ? loadedText.content : null;

  // ======================
  // HANDLERS
  // ======================
  const handleOpenInTab = useCallback((): void => {
    if (fileUrl) window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }, [fileUrl]);

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderBody = (): ReactElement | null => {
    if (!attachment) return null;
    if (mode === 'image') {
      return fileUrl ? (
        <img src={fileUrl} alt={attachment.name} className={styles.image} />
      ) : null;
    }
    if (mode === 'pdf') {
      return fileUrl ? (
        <iframe src={fileUrl} title={attachment.name} className={styles.frame} />
      ) : null;
    }
    if (mode === 'markdown') {
      return (
        <div className={styles.markdown}>
          <Markdown>{textContent ?? ''}</Markdown>
        </div>
      );
    }
    if (mode === 'text') {
      return <pre className={styles.text}>{textContent ?? 'Loading…'}</pre>;
    }
    return (
      <div className={styles.download}>
        <p>This file type can't be previewed here.</p>
        <p className={styles.downloadName}>{attachment.name}</p>
      </div>
    );
  };

  const renderActions = (): ReactElement => (
    <>
      <Button variant="ghost" onClick={handleOpenInTab} disabled={!fileUrl}>
        <FiExternalLink aria-hidden="true" /> Open in new tab
      </Button>
      <Button variant="primary" onClick={onClose}>
        Close
      </Button>
    </>
  );

  return (
    <Dialog
      open={attachment !== null}
      onClose={onClose}
      title={attachment?.name ?? ''}
      description={attachment ? `Preview of ${attachment.name}` : 'Attachment preview'}
      actions={renderActions()}
      draggable
      resizable
      maximizable
    >
      {renderBody()}
    </Dialog>
  );
};

export const AttachmentViewerDialog = memo(AttachmentViewerDialogComponent);
