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
import { LuCheck, LuCopy } from 'react-icons/lu';
import type { Components, ExtraProps } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/services/utils';
import styles from './Markdown.module.css';
import { REHYPE_PLUGINS, REMARK_PLUGINS } from './plugins';
import { highlightToHtml } from './syntaxHighlighter';

type CodeProps = ComponentProps<'code'> & ExtraProps;

/** Display names for common code-fence language ids; others show as written. */
const LANGUAGE_LABELS: Record<string, string> = {
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  py: 'Python',
  python: 'Python',
  html: 'HTML',
  css: 'CSS',
  sql: 'SQL',
  md: 'Markdown',
  markdown: 'Markdown',
  toml: 'TOML',
};

/**
 * Highlighted code. Tokenizes to an HTML string and injects it; falls back to
 * plain text when the language isn't supported. Memoized so re-renders that
 * don't change the code (e.g. toggling the copy button) skip re-highlighting.
 */
const HighlightedCode = memo(
  ({
    code,
    language,
    fallback,
  }: {
    code: string;
    language: string;
    fallback: ReactElement;
  }): ReactElement => {
    const html = highlightToHtml(code, language);
    if (html === null) return fallback;
    return (
      <pre className={styles.codeBlockFallback}>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: highlighter output, escaped by hast-util-to-html; never raw agent HTML. */}
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
  const inline = !props.node || props.node.position?.start.line === props.node.position?.end.line;

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
        <span className={styles.codeBlockLang}>
          {LANGUAGE_LABELS[match[1].toLowerCase()] ?? match[1]}
        </span>
        <button
          className={styles.codeBlockCopy}
          onClick={handleCopy}
          type="button"
          title={copied ? 'Copied' : 'Copy code'}
          aria-label="Copy code"
        >
          {copied ? <LuCheck size={15} /> : <LuCopy size={15} />}
        </button>
      </div>
      <HighlightedCode code={code} language={match[1]} fallback={plainCode} />
    </div>
  );
};

// Wraps tables so the rounded border can clip them and wide tables can scroll.
const TableWrapper = ({
  children,
  node,
  ...props
}: ComponentProps<'table'> & ExtraProps): ReactElement => {
  void node; // react-markdown's AST node must not reach the DOM.
  return (
    <div className={styles.tableWrap}>
      <table {...props}>{children}</table>
    </div>
  );
};

/** File extensions that `![alt](url)` renders as a video player instead of an image. */
const VIDEO_EXTENSION = /\.(mp4|webm|ogv|mov|m4v)$/i;

// Checks the path only, so `clip.mp4?token=…` and `clip.mp4#t=10` still match.
const isVideoUrl = (src: string): boolean => VIDEO_EXTENSION.test(src.split(/[?#]/)[0]);

// Wraps images (and videos written with image syntax) so they never exceed the
// message width and keep their aspect ratio. A <span> because markdown images
// sit inside a <p>, where a <div> is invalid HTML.
const MediaWrapper = ({
  node,
  alt,
  src,
  ...props
}: ComponentProps<'img'> & ExtraProps): ReactElement => {
  void node; // react-markdown's AST node must not reach the DOM.
  const renderMedia = (): ReactElement => {
    if (typeof src === 'string' && isVideoUrl(src)) {
      return (
        // biome-ignore lint/a11y/useMediaCaption: the video comes from agent output, which never ships captions.
        <video src={src} title={alt} controls preload="metadata">
          <a href={src} target="_blank" rel="noopener noreferrer">
            {alt || src}
          </a>
        </video>
      );
    }
    return <img src={src} alt={alt ?? ''} loading="lazy" {...props} />;
  };
  return <span className={styles.mediaWrap}>{renderMedia()}</span>;
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
  table: TableWrapper,
  img: MediaWrapper,
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
