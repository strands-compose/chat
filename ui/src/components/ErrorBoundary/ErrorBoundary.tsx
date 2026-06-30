import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Short message shown in the default fallback. */
  message?: string;
  /** Custom fallback. When provided, it replaces the default error widget. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render-time errors in its subtree and shows a fallback widget instead
 * of letting the whole app crash. Class component because React error boundaries
 * require lifecycle methods that have no hook equivalent.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] caught error:', error, info);
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }
    if (this.props.fallback) {
      return this.props.fallback;
    }
    return (
      <div className={styles.fallback} role="alert">
        <FiAlertTriangle size={24} className={styles.icon} />
        <p className={styles.message}>
          {this.props.message ?? 'Something went wrong loading this section.'}
        </p>
      </div>
    );
  }
}
