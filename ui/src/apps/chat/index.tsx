import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { readMeta } from '@/services/utils';
import '@/index.css';
import ChatApp from './ChatApp';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

const baseUrl = readMeta('app-base');
const title = readMeta('app-title') || (import.meta.env.VITE_CUSTOM_TITLE as string | undefined) || null;

createRoot(rootElement).render(
  <StrictMode>
    <Suspense fallback={null}>
      <ChatApp title={title} baseUrl={baseUrl} />
    </Suspense>
  </StrictMode>,
);
