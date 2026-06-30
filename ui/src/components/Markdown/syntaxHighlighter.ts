/**
 * Prism tokenizer (refractor) that emits an HTML string.
 *
 * Only the languages registered here are bundled. Highlighting returns HTML
 * carrying Prism token classes (`token`, `comment`, ...), so colors come from
 * CSS rather than a per-token React tree — much cheaper to render.
 */
import { refractor } from 'refractor/core';
import { toHtml } from 'hast-util-to-html';

import markup from 'refractor/markup';
import css from 'refractor/css';
import javascript from 'refractor/javascript';
import jsx from 'refractor/jsx';
import typescript from 'refractor/typescript';
import tsx from 'refractor/tsx';
import c from 'refractor/c';
import cpp from 'refractor/cpp';
import bash from 'refractor/bash';
import python from 'refractor/python';
import json from 'refractor/json';
import yaml from 'refractor/yaml';
import sql from 'refractor/sql';
import markdown from 'refractor/markdown';
import java from 'refractor/java';
import csharp from 'refractor/csharp';
import go from 'refractor/go';
import rust from 'refractor/rust';
import docker from 'refractor/docker';
import diff from 'refractor/diff';

// Dependency order: base grammars before the ones that extend them.
const LANGUAGES = [
  markup, css, javascript, jsx, typescript, tsx, c, cpp,
  bash, python, json, yaml, sql, markdown, java, csharp, go, rust, docker, diff,
];

for (const language of LANGUAGES) {
  refractor.register(language);
}

// Map fenced-code aliases to a registered Prism language name.
const ALIASES: Record<string, string> = {
  sh: 'bash',
  shell: 'bash',
  py: 'python',
  js: 'javascript',
  ts: 'typescript',
  yml: 'yaml',
  md: 'markdown',
  cs: 'csharp',
  rs: 'rust',
  dockerfile: 'docker',
  html: 'markup',
  xml: 'markup',
};

/**
 * Highlight `code` to an HTML string, or null when the language isn't
 * registered so the caller can render plain text.
 *
 * The input is tokenized and escaped by refractor/hast, so the result is safe
 * to inject as HTML.
 */
export function highlightToHtml(code: string, language: string): string | null {
  const name = ALIASES[language] ?? language;
  if (!refractor.registered(name)) return null;
  return toHtml(refractor.highlight(code, name));
}
