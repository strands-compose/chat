import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { readAppBase } from '@/services/utils';
import '@/index.css';
import AdminApp from './AdminApp';

const rootElement = document.getElementById('admin-root');

if (!rootElement) {
  throw new Error('Admin root element #admin-root not found');
}

// URL prefix injected by the backend into the app-base meta tag.
const appBase = readAppBase();
void appBase;

createRoot(rootElement).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
