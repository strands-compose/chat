import type { ReactElement } from 'react';
import { memo, useState } from 'react';
import type { Attachment } from '@/types/api';
import { AttachmentChip } from './AttachmentChip';
import { AttachmentViewerDialog } from './AttachmentViewerDialog';
import styles from './AttachmentPreview.module.css';

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

const AttachmentPreviewComponent = ({
  attachments,
  onRemove,
}: AttachmentPreviewProps): ReactElement | null => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const [previewId, setPreviewId] = useState<string | null>(null);

  if (attachments.length === 0) {
    return null;
  }

  const previewAttachment = attachments.find((a) => a.id === previewId) ?? null;

  return (
    <div className={styles.preview}>
      {attachments.map((attachment) => (
        <AttachmentChip
          key={attachment.id}
          attachment={attachment}
          onRemove={onRemove}
          onOpen={setPreviewId}
        />
      ))}
      <AttachmentViewerDialog
        attachment={previewAttachment}
        onClose={() => setPreviewId(null)}
      />
    </div>
  );
};

export const AttachmentPreview = memo(AttachmentPreviewComponent);
