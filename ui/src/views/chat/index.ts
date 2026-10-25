// Public edge of the chat feature. Everything else in this folder is internal.
export { ChatView } from './ChatView';
export { AgentDescriptionPanel } from './AgentDescriptionPanel';
// Default re-export so the entry can be lazy-loaded: lazy(() => import('@/views/chat'))
export { ChatView as default } from './ChatView';
