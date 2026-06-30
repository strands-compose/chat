// React contexts — providers and consumer hooks.

export { AppConfigProvider, useAppConfig } from './AppConfigContext';
export type { AppConfig } from './AppConfigContext';

export { ThemeProvider, useTheme } from './ThemeContext';
export type { ThemeContextValue } from './ThemeContext';

export { CollapseProvider, useCollapseContext } from './CollapseContext';
export type { CollapseContextValue } from './CollapseContext';

export { AuthProvider, useAuth } from './AuthContext';
export type { AuthContextValue } from './AuthContext';

export { MediaCapabilitiesProvider, useMediaCapabilities } from './MediaCapabilitiesContext';
export type { MediaCapabilitiesContextValue } from './MediaCapabilitiesContext';
