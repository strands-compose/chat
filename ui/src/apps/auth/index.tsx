import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { readMeta } from '@/services/utils';
import '@/index.css';
import AuthApp from './AuthApp';

const rootElement = document.getElementById('auth-root');

if (!rootElement) {
  throw new Error('Auth root element #auth-root not found');
}

const baseUrl = readMeta('app-base');
const title = readMeta('app-title') || null;

createRoot(rootElement).render(
  <StrictMode>
    <AuthApp title={title} baseUrl={baseUrl} />
  </StrictMode>,
);
