/**
 * Markdown rendering primitive.
 *
 * Renders a markdown string with the app's shared plugin set, GFM support, a
 * code block with copy + lazy syntax highlighting, and links that open in a new
 * tab. This primitive does not read app state or the DOM; all styling, including
 * code-block token colors, is theme-driven through CSS tokens.
 */

import type { ComponentProps, ReactElement } from 'react';
import { memo, useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components, ExtraProps } from 'react-markdown';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { cn } from '@/services/utils';
import { REMARK_PLUGINS, REHYPE_PLUGINS } from './plugins';
import { highlightToHtml } from './syntaxHighlighter';
import styles from './Markdown.module.css';

type CodeProps = ComponentProps<'code'> & ExtraProps;

/**
 * Highlighted code. Tokenizes to an HTML string and injects it; falls back to
 * plain text when the language isn't supported. Memoized so re-renders that
 * don't change the code (e.g. toggling the copy button) skip re-highlighting.
 */
const HighlightedCode = memo(
  ({ code, language, fallback }: { code: string; language: string; fallback: ReactElement }): ReactElement => {
    const html = highlightToHtml(code, language);
    if (html === null) return fallback;
    return (
      <pre className={styles.codeBlockFallback}>
        <code className={styles.codeTokens} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    );
  },
);

const CodeBlockComponent = ({ className, children, ...props }: CodeProps): ReactElement => {
  // ======================
  // STATE, HOOKS & REFS
  // ======================
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const inline =
    !props.node || props.node.position?.start.line === props.node.position?.end.line;

  // ======================
  // HANDLERS
  // ======================
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  // ======================
  // RENDER
  // ======================
  if (inline || !match) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const code = String(children).replace(/\n$/, '');
  const plainCode = (
    <pre className={styles.codeBlockFallback}>
      <code>{code}</code>
    </pre>
  );

  return (
    <div className={styles.codeBlockWrapper}>
      <div className={styles.codeBlockHeader}>
        <span className={styles.codeBlockLang}>{match[1]}</span>
        <button
          className={styles.codeBlockCopy}
          onClick={handleCopy}
          type="button"
          title="Copy code"
        >
          {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <HighlightedCode code={code} language={match[1]} fallback={plainCode} />
    </div>
  );
};

// Opens every markdown link in a new tab so the user doesn't lose their session.
const ExternalLink = ({ href, children, ...props }: ComponentProps<'a'>): ReactElement => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
    {children}
  </a>
);

const COMPONENTS: Components = {
  code: (props) => <CodeBlockComponent {...props} />,
  // Passthrough: our code component renders its own block wrapper, so the
  // default <pre> would only nest redundantly.
  pre: ({ children }) => <>{children}</>,
  a: ExternalLink,
};

interface MarkdownProps {
  /** Raw markdown source to render. */
  children: string;
  /** Optional class applied to the wrapper element. */
  className?: string;
}

const MarkdownComponent = ({ children, className }: MarkdownProps): ReactElement => (
  <div className={cn(styles.markdownBody, className)}>
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
      components={COMPONENTS}
    >
      {children}
    </ReactMarkdown>
  </div>
);

export const Markdown = memo(MarkdownComponent);
