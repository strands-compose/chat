import type { ReactElement } from 'react';
import { TooltipProvider } from '@/components';
import {
  AppConfigProvider,
  AuthProvider,
  MediaCapabilitiesProvider,
  ThemeProvider,
} from '@/contexts';
import AppShell from './AppShell';

interface ChatAppProps {
  title: string | null;
  baseUrl: string;
}

const ChatApp = ({ title, baseUrl }: ChatAppProps): ReactElement => (
  <AppConfigProvider config={{ title, baseUrl }}>
    <ThemeProvider>
      <AuthProvider>
        <MediaCapabilitiesProvider>
          <TooltipProvider delayDuration={200}>
            <AppShell />
          </TooltipProvider>
        </MediaCapabilitiesProvider>
      </AuthProvider>
    </ThemeProvider>
  </AppConfigProvider>
);

export default ChatApp;
