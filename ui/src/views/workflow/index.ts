// Public edge of the workflow feature. Everything else in this folder is internal.
export { WorkflowView } from './WorkflowView';
// Default re-export so the entry can be lazy-loaded: lazy(() => import('@/views/workflow'))
export { WorkflowView as default } from './WorkflowView';
