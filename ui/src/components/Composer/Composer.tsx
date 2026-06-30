import type { ReactElement, KeyboardEvent, ChangeEvent, SyntheticEvent, MouseEvent } from 'react';
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { FiArrowUp, FiSquare, FiPaperclip, FiUploadCloud } from 'react-icons/fi';
import type { Attachment, MediaCapabilities, MediaCategory } from '@/types/api';
import { validateAttachments } from '@/services/utils';
import { cn } from '@/services/utils';
import { useWindowFileDrop } from '@/hooks';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../DropdownMenu';
import { DropOverlay } from '../DropOverlay';
import { ErrorDialog } from '../ErrorDialog';
import { AttachmentPreview } from './AttachmentPreview';
import styles from './Composer.module.css';

interface ComposerProps {
  onSend: (message: string, attachments: Attachment[]) => void;
  onStop: () => void;
  isLoading: boolean;
  /** Supported attachment formats and limits; attachments are off until present. */
  capabilities?: MediaCapabilities;
  /** When false, file upload is disabled regardless of capabilities. */
  agentMultimodal?: boolean;
  /** When true, the entire composer is locked (textarea + buttons disabled). */
  disabled?: boolean;
}

const CATEGORY_LABELS: Record<MediaCategory['category'], string> = {
  image: 'Image',
  document: 'Document',
};

/**
 * Build the hidden input's `accept` value for a category from its explicit
 * extension list. The wildcard (`image/*`) is intentionally NOT used, so the
 * native picker only offers the formats the backend actually supports (e.g.
 * `.svg` stays unselectable for images).
 */
const buildAccept = (category: MediaCategory): string => {
  const extensions = new Set<string>();
  for (const format of category.formats) {
    for (const extension of format.extensions) extensions.add(extension);
  }
  return Array.from(extensions).join(',');
};

/** A file belongs to a category when its extension or MIME type is one the category lists. */
const isFileInCategory = (file: File, category: MediaCategory): boolean => {
  const extensions = new Set<string>();
  const mimeTypes = new Set<string>();
  for (const format of category.formats) {
    for (const extension of format.extensions) extensions.add(extension.toLowerCase());
    mimeTypes.add(format.mime_type.toLowerCase());
  }
  const name = file.name.toLowerCase();
  const dot = name.lastIndexOf('.');
  const extension = dot >= 0 ? name.slice(dot) : '';
  return (extension !== '' && extensions.has(extension)) || mimeTypes.has(file.type.toLowerCase());
};

const ComposerComponent = ({
  onSend,
  onStop,
  isLoading,
  capabilities,
  agentMultimodal = false,
  disabled = false,
}: ComposerProps): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [activeCategory, setActiveCategory] = useState<MediaCategory | null>(null);
  const [openNonce, setOpenNonce] = useState(0);
  const [attachmentError, setAttachmentError] = useState<{ title: string; message: string } | null>(
    null,
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentsRef = useRef<Attachment[]>([]);

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  const attachEnabled = !disabled && !isLoading && capabilities !== undefined && agentMultimodal;
  // The composer is otherwise usable (not loading/disabled, capabilities loaded)
  // but the selected agent rejects files. Used to keep the paperclip clickable
  // so a click can explain why upload is unavailable.
  const attachBlockedByAgent =
    !disabled && !isLoading && capabilities !== undefined && !agentMultimodal;

  useEffect(() => {
    textareaRef.current?.focus();
  }, [isLoading]);

  // Grow the textarea with content up to 40vh, then scroll.
  // CSS handles max-height; JS just sets height to scrollHeight so the
  // element expands until CSS clamps it and overflow kicks in.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  // Open the picker after each category selection. Keyed on a monotonic nonce
  // (not the category) so re-selecting the same category still reopens it; the
  // input's `accept` reflects the active category by the time the effect runs.
  useEffect(() => {
    if (openNonce === 0) return;
    fileInputRef.current?.click();
  }, [openNonce]);

  // Release any outstanding object URLs when the composer unmounts.
  useEffect(
    () => () => {
      attachmentsRef.current.forEach((attachment) => {
        if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
      });
    },
    []
  );

  // ======================
  // ATTACHMENT HANDLERS
  // ======================
  const clearAttachments = useCallback((): void => {
    setAttachments((current) => {
      current.forEach((attachment) => {
        if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
      });
      return [];
    });
  }, []);

  const handleRemove = useCallback((id: string): void => {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return current.filter((attachment) => attachment.id !== id);
    });
  }, []);

  const handleSelectCategory = useCallback((category: MediaCategory): void => {
    setActiveCategory(category);
    setOpenNonce((n) => n + 1);
  }, []);

  /** Resolve the capability category a file belongs to, or null if unsupported. */
  const resolveCategory = useCallback(
    (file: File): MediaCategory | null =>
      capabilities?.categories.find((category) => isFileInCategory(file, category)) ?? null,
    [capabilities],
  );

  /**
   * Append files to the current selection, honoring the per-file and combined
   * size limits and the max block count. Shared by the file picker (which pins
   * a `forcedCategory`) and drag-and-drop (which infers each file's category).
   *
   * File identity is the lowercased full filename (extension included) plus
   * byte size, so "aaa.png" and "aaa.jpeg" are distinct attachments and only an
   * identical re-pick is skipped. Unsupported and oversized files are skipped
   * and surfaced via a single rejection notice.
   */
  const addFiles = useCallback(
    (files: File[], forcedCategory?: MediaCategory | null): void => {
      if (!capabilities || files.length === 0) return;

      const accepted = [...attachmentsRef.current];
      const sizes = accepted.map((a) => ({ name: a.name, size: a.size }));
      const seenKeys = new Set(accepted.map((a) => `${a.name.toLowerCase()}\u0000${a.size}`));

      const unsupported: string[] = [];
      let sizeMessage: string | null = null;
      let limitReached = false;

      for (const file of files) {
        if (accepted.length >= capabilities.max_block_count) {
          limitReached = true;
          break;
        }

        const category = forcedCategory ?? resolveCategory(file);
        if (!category || !isFileInCategory(file, category)) {
          unsupported.push(file.name);
          continue;
        }

        // Identical file (same name + size) already attached — silently skip.
        const key = `${file.name.toLowerCase()}\u0000${file.size}`;
        if (seenKeys.has(key)) continue;

        // Validate the prospective selection so a too-large file (or one that
        // would push the combined size over the limit) is rejected on upload.
        const trial = [...sizes, { name: file.name, size: file.size }];
        const result = validateAttachments(
          trial,
          capabilities.max_file_bytes,
          capabilities.max_total_bytes,
        );
        if (!result.ok) {
          sizeMessage = result.message;
          continue;
        }

        const kind = category.category;
        accepted.push({
          id: crypto.randomUUID(),
          file,
          kind,
          name: file.name,
          size: file.size,
          previewUrl: kind === 'image' ? URL.createObjectURL(file) : undefined,
        });
        sizes.push({ name: file.name, size: file.size });
        seenKeys.add(key);
      }

      setAttachments(accepted);

      // One notice at a time. The block-count cap is the headline (it silently
      // stops adds otherwise); then unsupported types, then size. The picker
      // already filters by extension, so unsupported mainly catches drops.
      if (limitReached) {
        setAttachmentError({
          title: 'Too many files',
          message: `Maximum number of files exceeded — you can attach up to ${capabilities.max_block_count} per message.`,
        });
      } else if (unsupported.length > 0) {
        setAttachmentError({
          title: unsupported.length > 1 ? 'Unsupported file types' : 'Unsupported file type',
          message:
            unsupported.length > 1
              ? `These files aren't a supported type and were skipped:\n${unsupported.join(', ')}`
              : `"${unsupported[0]}" isn't a supported file type.`,
        });
      } else if (sizeMessage) {
        setAttachmentError({ title: 'Attachment too large', message: sizeMessage });
      }
    },
    [capabilities, resolveCategory],
  );

  const handleFilesSelected = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const selected = Array.from(e.target.files ?? []);
      e.target.value = '';
      if (!activeCategory) return;
      addFiles(selected, activeCategory);
    },
    [activeCategory, addFiles],
  );

  // Window-wide drag-and-drop: dropped files run through the same acceptance
  // path as the picker, inferring each file's category from capabilities.
  // When the agent does not support multimodal input, drops are intercepted and
  // rejected with a descriptive error so the user understands why.
  const notifyUploadUnsupported = useCallback((): void => {
    setAttachmentError({
      title: 'File upload not supported',
      message: 'This agent does not support file upload.',
    });
  }, []);

  const handleDropFiles = useCallback(
    (files: File[]): void => {
      if (!agentMultimodal) {
        notifyUploadUnsupported();
        return;
      }
      addFiles(files);
    },
    [agentMultimodal, notifyUploadUnsupported, addFiles],
  );
  // Accept drag events over the window whenever we can show a meaningful
  // response — both to handle valid drops and to show the rejection error.
  const dropListenEnabled = !disabled && !isLoading && capabilities !== undefined;
  const { isDragging } = useWindowFileDrop({ enabled: dropListenEnabled, onDrop: handleDropFiles });

  // ======================
  // SEND HANDLERS
  // ======================
  const submit = useCallback((): void => {
    const text = input.trim();
    if (isLoading || disabled) return;
    if (!text) return;

    if (attachments.length > 0 && capabilities) {
      const result = validateAttachments(
        attachments,
        capabilities.max_file_bytes,
        capabilities.max_total_bytes
      );
      if (!result.ok) {
        setAttachmentError({ title: 'Attachment too large', message: result.message });
        return;
      }
    }

    onSend(text, attachments);
    setInput('');
    clearAttachments();
  }, [input, isLoading, disabled, attachments, capabilities, onSend, clearAttachments]);

  const handleSubmit = useCallback(
    (e: SyntheticEvent): void => {
      e.preventDefault();
      submit();
    },
    [submit]
  );

  const handleStop = useCallback(
    (e: SyntheticEvent): void => {
      e.preventDefault();
      onStop();
    },
    [onStop]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit]
  );

  // Clicking anywhere on the composer chrome (padding, actions row) focuses the
  // textarea. Clicks on the buttons or the textarea itself are left untouched.
  const handleFormMouseDown = useCallback((e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target === textareaRef.current || target.closest('button')) return;
    e.preventDefault();
    textareaRef.current?.focus();
  }, []);

  // ======================
  // RENDER
  // ======================
  const renderSubmitButton = (): ReactElement => {
    if (isLoading) {
      return (
        <button
          type="button"
          onClick={handleStop}
          className={styles.stopButton}
          title="Stop generation"
        >
          <FiSquare size={16} />
        </button>
      );
    }
    return (
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className={styles.sendButton}
        title="Send message"
      >
        <FiArrowUp size={18} />
      </button>
    );
  };

  const renderAttachButton = (): ReactElement => {
    // Agent can't accept files but the composer is otherwise usable: keep the
    // button clickable so a click explains why upload is unavailable.
    if (attachBlockedByAgent) {
      return (
        <button
          type="button"
          className={cn(styles.plusButton, styles.plusButtonBlocked)}
          title="File upload not supported"
          onClick={notifyUploadUnsupported}
        >
          <FiPaperclip size={16} />
        </button>
      );
    }

    if (!attachEnabled) {
      return (
        <button
          type="button"
          className={styles.plusButton}
          title="Add attachment"
          disabled
        >
          <FiPaperclip size={16} />
        </button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className={styles.plusButton} title="Add attachment">
            <FiPaperclip size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {capabilities?.categories.map((category) => (
            <DropdownMenuItem
              key={category.category}
              onSelect={() => handleSelectCategory(category)}
            >
              {CATEGORY_LABELS[category.category]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <footer className={styles.inputArea}>
      <form onSubmit={handleSubmit} onMouseDown={handleFormMouseDown} className={styles.form}>
        <AttachmentPreview attachments={attachments} onRemove={handleRemove} />
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          disabled={isLoading || disabled}
          className={styles.textarea}
          rows={1}
        />
        <div className={styles.actions}>
          <div className={styles.actionsLeft}>{renderAttachButton()}</div>
          <div className={styles.actionsRight}>{renderSubmitButton()}</div>
        </div>
      </form>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={activeCategory ? buildAccept(activeCategory) : undefined}
        onChange={handleFilesSelected}
        hidden
      />
      <ErrorDialog
        open={attachmentError !== null}
        title={attachmentError?.title ?? ''}
        message={attachmentError?.message ?? ''}
        onClose={() => setAttachmentError(null)}
      />
      <DropOverlay
        visible={isDragging}
        icon={<FiUploadCloud size={40} />}
        title="Drop your files here"
        subtitle="Release to attach them to your message"
      />
    </footer>
  );
};

export const Composer = memo(ComposerComponent);
