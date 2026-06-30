/**
 * AccountForm — view and edit the authenticated user's profile.
 *
 * Read-only identity fields (username, email) plus editable profile fields laid
 * out in a responsive grid beside a circular avatar placeholder. Submits only
 * the changed, trimmed fields via PATCH /auth/me and surfaces a transient
 * success indicator on save.
 *
 * Form state, per-field validation, and dirty tracking are owned by TanStack
 * Form; the TextField / Button primitives are the render layer.
 */

import type { ReactElement } from 'react';
import { memo, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { FiUser } from 'react-icons/fi';
import { Button, TextField } from '@/components';
import type { CurrentUser } from '@/services/api';
import { patchCurrentUser } from '@/services/api';
import { useAuth } from '@/contexts';
import { CurrentMonthPanel } from './CurrentMonthPanel';
import { useProfileContext } from './hooks/useProfileContext';
import styles from './AccountForm.module.css';

// ======================
// TYPES & CONSTANTS
// ======================

type EditableField = 'first_name' | 'last_name' | 'location' | 'department' | 'company';
type SaveState = 'idle' | 'success' | 'error';

const MAX_LENGTH: Record<EditableField, number> = {
  first_name: 128,
  last_name: 128,
  location: 256,
  department: 256,
  company: 256,
};

const FIELD_LABEL: Record<EditableField, string> = {
  first_name: 'First name',
  last_name: 'Last name',
  location: 'Location',
  department: 'Department',
  company: 'Company',
};

const EDITABLE_FIELDS: EditableField[] = [
  'first_name',
  'last_name',
  'location',
  'department',
  'company',
];

// Fallback for the form's default values before the user loads (guards the hook rule).
const EMPTY_FIELDS: Record<EditableField, string> = {
  first_name: '', last_name: '', location: '', department: '', company: '',
};

const toStr = (value: string | null | undefined): string => value ?? '';

const buildFields = (user: CurrentUser): Record<EditableField, string> => ({
  first_name: toStr(user.first_name),
  last_name: toStr(user.last_name),
  location: toStr(user.location),
  department: toStr(user.department),
  company: toStr(user.company),
});

// ======================
// COMPONENT
// ======================

const AccountFormComponent = (): ReactElement | null => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================

  // Read user and the post-save refresh directly from the auth context.
  const { user, refetchUser } = useAuth();
  // Current-month sparkline data comes from ProfileContext — already fetched,
  // no re-fetch needed when switching tabs.
  const { currentMonthPoints, isCurrentMonthLoading } = useProfileContext();

  // Transient post-save indicator and API-level error live outside the form;
  // the form owns field values, validation, dirty state, and isSubmitting.
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: user ? buildFields(user) : EMPTY_FIELDS,
    onSubmit: async ({ value }) => {
      setApiError(null);

      const trimmed = {} as Record<EditableField, string>;
      const payload: Partial<Record<EditableField, string>> = {};
      for (const field of EDITABLE_FIELDS) {
        trimmed[field] = value[field].trim();
        const baseline = user ? toStr(user[field]).trim() : '';
        if (trimmed[field] !== baseline) payload[field] = trimmed[field];
      }

      try {
        await patchCurrentUser(payload);
        await refetchUser();
        // Make the trimmed values the new clean baseline so the form is no
        // longer dirty after a successful save.
        form.reset(trimmed);
        setSaveState('success');
        setTimeout(() => setSaveState('idle'), 3000);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Failed to update profile.');
        setSaveState('error');
      }
    },
  });

  // ProfilePanelDialog already guards the null case, but we mirror it here so
  // TypeScript can narrow `user` for the rest of the render.
  if (!user) return null;

  // ======================
  // RENDER FUNCTIONS
  // ======================

  const renderEditable = (field: EditableField, disabled: boolean): ReactElement => (
    <form.Field
      key={field}
      name={field}
      validators={{
        onChange: ({ value }) =>
          value.trim().length > MAX_LENGTH[field]
            ? `Max ${MAX_LENGTH[field]} characters.`
            : undefined,
      }}
    >
      {(fieldApi) => (
        <TextField
          label={FIELD_LABEL[field]}
          value={fieldApi.state.value}
          onChange={(event) => fieldApi.handleChange(event.target.value)}
          onBlur={fieldApi.handleBlur}
          disabled={disabled}
          error={fieldApi.state.meta.errors[0] ?? undefined}
        />
      )}
    </form.Field>
  );

  const renderSaveLabel = (isSubmitting: boolean): string => {
    if (isSubmitting) return 'Saving…';
    if (saveState === 'success') return 'Saved ✓';
    return 'Save changes';
  };

  const renderProfileSection = (): ReactElement => (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting,
        isDirty: state.isDirty,
      })}
    >
      {({ canSubmit, isSubmitting, isDirty }) => (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Profile</h3>
            <div className={styles.titleActions}>
              {apiError && !isSubmitting && (
                <span role="alert" className={styles.apiError}>{apiError}</span>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={!canSubmit || !isDirty}
                className={styles.saveButton}
              >
                {renderSaveLabel(isSubmitting)}
              </Button>
            </div>
          </div>
          <div className={styles.grid}>
            {renderEditable('first_name', isSubmitting)}
            {renderEditable('last_name', isSubmitting)}
            {renderEditable('location', isSubmitting)}
            {renderEditable('company', isSubmitting)}
            {renderEditable('department', isSubmitting)}
          </div>
        </section>
      )}
    </form.Subscribe>
  );

  return (
    <div className={styles.layout}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        noValidate
      >
        <div className={styles.identity}>
          <div className={styles.avatar} aria-hidden="true">
            <FiUser size={44} />
          </div>
          <div className={styles.identityText}>
            <span className={styles.displayName}>{user.username}</span>
            <span className={styles.displayEmail}>{user.email}</span>
          </div>
        </div>

        {renderProfileSection()}
      </form>

      <aside className={styles.usagePanel}>
        <CurrentMonthPanel points={currentMonthPoints} isLoading={isCurrentMonthLoading} />
      </aside>
    </div>
  );
};

export const AccountForm = memo(AccountFormComponent);
