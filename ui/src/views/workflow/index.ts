// Public edge of the workflow feature. Everything else in this folder is internal.
// Default re-export so the entry can be lazy-loaded: lazy(() => import('@/views/workflow'))
export { WorkflowView, WorkflowView as default } from './WorkflowView';
