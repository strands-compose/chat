import type { ReactElement } from 'react';
import { memo } from 'react';
import { FiFileText, FiX } from 'react-icons/fi';
import type { Attachment } from '@/types/api';
import styles from './AttachmentChip.module.css';

interface AttachmentChipProps {
  attachment: Attachment;
  onRemove: (id: string) => void;
  onOpen: (id: string) => void;
}

const AttachmentChipComponent = ({
  attachment,
  onRemove,
  onOpen,
}: AttachmentChipProps): ReactElement => {
  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderContent = (): ReactElement => {
    if (attachment.kind === 'image' && attachment.previewUrl) {
      return <img src={attachment.previewUrl} alt={attachment.name} className={styles.thumbnail} />;
    }
    return (
      <span className={styles.document}>
        <FiFileText className={styles.documentIcon} aria-hidden="true" />
        <span className={styles.name} title={attachment.name}>
          {attachment.name}
        </span>
      </span>
    );
  };

  return (
    <div className={styles.chip}>
      <button
        type="button"
        className={styles.open}
        onClick={() => onOpen(attachment.id)}
        title={`Preview ${attachment.name}`}
        aria-label={`Preview ${attachment.name}`}
      >
        {renderContent()}
      </button>
      <button
        type="button"
        className={styles.remove}
        onClick={() => onRemove(attachment.id)}
        title="Remove attachment"
        aria-label={`Remove ${attachment.name}`}
      >
        <FiX size={14} />
      </button>
    </div>
  );
};

export const AttachmentChip = memo(AttachmentChipComponent);
