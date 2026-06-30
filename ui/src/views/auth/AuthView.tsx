/**
 * Authentication screen: a centered card that toggles between sign in and
 * sign up. Composes the TextField / Button primitives and drives the
 * AuthContext actions. Shown by the app shell whenever there is no user.
 * Fetches available OIDC providers on mount and renders a sign-in button per
 * provider below the local form.
 *
 * Field state, validation, and submission flow are owned by TanStack Form.
 */

import type { ReactElement } from 'react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import type { IconType } from 'react-icons';
import { FaAws, FaMicrosoft } from 'react-icons/fa6';
import { FiKey } from 'react-icons/fi';
import {
  SiApple,
  SiAuth0,
  SiFacebook,
  SiGithub,
  SiGitlab,
  SiGoogle,
  SiKeycloak,
  SiOkta,
  SiSalesforce,
  SiSlack,
} from 'react-icons/si';
import { Button, TextField } from '@/components';
import { useAppConfig } from '@/contexts';
import { fetchAuthProviders, login, register, startProviderLogin } from '@/services/api';
import type { AuthProviderInfo } from '@/services/api';
import styles from './AuthView.module.css';

type Mode = 'signin' | 'signup';

/**
 * Resolve a brand icon from a provider id and display name.
 * Matches case-insensitively against well-known keywords.
 * Falls back to a generic key icon when no brand is recognised.
 */
const resolveProviderIcon = (id: string, displayName: string): IconType => {
  const haystack = `${id} ${displayName}`.toLowerCase();
  if (/microsoft|entra|azure|\bad\b|aad/.test(haystack)) return FaMicrosoft;
  if (/google|gmail|workspace/.test(haystack)) return SiGoogle;
  if (/apple|icloud/.test(haystack)) return SiApple;
  if (/amazon|aws|cognito/.test(haystack)) return FaAws;
  if (/github/.test(haystack)) return SiGithub;
  if (/gitlab/.test(haystack)) return SiGitlab;
  if (/facebook|meta/.test(haystack)) return SiFacebook;
  if (/okta/.test(haystack)) return SiOkta;
  if (/auth0/.test(haystack)) return SiAuth0;
  if (/keycloak/.test(haystack)) return SiKeycloak;
  if (/slack/.test(haystack)) return SiSlack;
  if (/salesforce/.test(haystack)) return SiSalesforce;
  return FiKey;
};

const AuthViewComponent = (): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const { title } = useAppConfig();

  const [mode, setMode] = useState<Mode>('signin');
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<AuthProviderInfo[]>([]);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);

  const isSignUp = mode === 'signup' && registrationEnabled;

  const form = useForm({
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async ({ value }) => {
      setError(null);

      if (isSignUp && value.password !== value.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      try {
        if (isSignUp) {
          await register({ username: value.username, email: value.email, password: value.password });
        }
        const { next } = await login({ username: value.username, password: value.password });
        window.location.assign(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    },
  });

  useEffect(() => {
    let cancelled = false;
    fetchAuthProviders()
      .then((data) => {
        if (!cancelled) {
          setProviders(data.providers);
          setRegistrationEnabled(data.registration_enabled);
        }
      })
      .catch(() => {
        // Keep defaults so the local form still works.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ======================
  // HANDLERS
  // ======================
  const toggleMode = useCallback((): void => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setError(null);
    form.setFieldValue('confirmPassword', '');
  }, [form]);

  // ======================
  // RENDER FUNCTIONS
  // ======================
  const renderHeading = (): ReactElement => {
    if (isSignUp) {
      return (
        <div className={styles.heading}>
          <div className={styles.headingTitle}>Create your account</div>
        </div>
      );
    }
    return (
      <div className={styles.heading}>
        <div className={styles.headingTitle}>
          Sign in to{' '}
          {title ? (
            <span className={styles.accent}>{title}</span>
          ) : (
            <span className={styles.accent}>Strands Compose</span>
          )}
        </div>
      </div>
    );
  };

  const renderError = (): ReactElement | null => {
    if (!error) return null;
    return (
      <div role="alert" className={styles.formError}>
        {error}
      </div>
    );
  };

  const renderUsername = (disabled: boolean): ReactElement => (
    <form.Field name="username">
      {(field) => (
        <TextField
          label="Username"
          type="text"
          autoComplete="username"
          required
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          disabled={disabled}
        />
      )}
    </form.Field>
  );

  const renderEmail = (disabled: boolean): ReactElement | null => {
    if (!isSignUp) return null;
    return (
      <form.Field name="email">
        {(field) => (
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            disabled={disabled}
          />
        )}
      </form.Field>
    );
  };

  const renderPassword = (disabled: boolean): ReactElement => (
    <form.Field name="password">
      {(field) => (
        <TextField
          label="Password"
          type="password"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          required
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          disabled={disabled}
        />
      )}
    </form.Field>
  );

  const renderConfirmPassword = (disabled: boolean): ReactElement | null => {
    if (!isSignUp) return null;
    return (
      <form.Field
        name="confirmPassword"
        validators={{
          onChangeListenTo: ['password'],
          onChange: ({ value, fieldApi }) =>
            value.length > 0 && value !== fieldApi.form.getFieldValue('password')
              ? 'Passwords do not match.'
              : undefined,
        }}
      >
        {(field) => (
          <TextField
            label="Repeat password"
            type="password"
            autoComplete="new-password"
            required
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            disabled={disabled}
            error={field.state.meta.errors[0] ?? undefined}
          />
        )}
      </form.Field>
    );
  };

  const renderProviderButtons = (): ReactElement | null => {
    if (providers.length === 0) return null;
    if (mode === 'signup') return null;
    return (
      <div className={styles.providersRoot}>
        <p className={styles.providersDivider}>
          <span>or continue with</span>
        </p>
        {providers.map((p) => {
          const Icon = resolveProviderIcon(p.id, p.display_name);
          return (
            <Button
              key={p.id}
              type="button"
              variant="primary"
              fullWidth
              className={styles.providerButton}
              onClick={() => startProviderLogin(p.id)}
            >
              <Icon className={styles.providerIcon} aria-hidden="true" />
              Sign in with {p.display_name}
            </Button>
          );
        })}
      </div>
    );
  };

  const renderFooter = (): ReactElement | null => {
    if (!registrationEnabled) return null;
    return (
      <p className={styles.footer}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button type="button" className={styles.switchButton} onClick={toggleMode}>
          {isSignUp ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        {renderHeading()}
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <>
                {renderUsername(isSubmitting)}
                {renderEmail(isSubmitting)}
                {renderPassword(isSubmitting)}
                {renderConfirmPassword(isSubmitting)}
                {renderError()}
                <Button
                  type="submit"
                  variant="primary"
                  className={styles.submitButton}
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSignUp ? 'Create account' : 'Sign in'}
                </Button>
              </>
            )}
          </form.Subscribe>
        </form>
        {renderFooter()}
        {renderProviderButtons()}
      </div>
    </div>
  );
};

export const AuthView = memo(AuthViewComponent);
export default AuthView;
