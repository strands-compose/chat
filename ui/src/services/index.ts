// ====== NETWORK — main app API ======
export {
  streamChat,
  fetchAgents,
  fetchSessions,
  renameSession,
  deleteSession,
  fetchCurrentUser,
  fetchAuthProviders,
  startProviderLogin,
  login,
  register,
  logout,
  patchCurrentUser,
  fetchSessionMessages,
  fetchSessionUsage,
  fetchMediaCapabilities,
  fetchUserUsageSummary,
} from './api';

export type {
  Agent,
  Session,
  CurrentUser,
  LoginCredentials,
  LoginResult,
  RegisterPayload,
  SessionMessage,
  SessionUsageSummary,
  AuthProviderInfo,
  AuthProvidersResponse,
  ProfilePatchPayload,
} from './api';

// ====== NETWORK — admin / analytics API ======
export {
  getFilters,
  postSummary,
  postTimeline,
  postBreakdown,
  getBudgets,
} from './adminApi';

// ====== PURE HELPERS ======
export {
  cn,
  formatCost,
  formatFileSize,
  readMeta,
  readAppBase,
  toDateParam,
  validateAttachments,
  startOfCurrentMonth,
  endOfCurrentMonth,
} from './utils';

export type { AttachmentValidation } from './utils';
