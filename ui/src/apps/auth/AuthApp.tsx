import type { ReactElement } from 'react';
import { Suspense, lazy } from 'react';
import { AppConfigProvider, ThemeProvider } from '@/contexts';

const AuthView = lazy(() => import('@/views/auth/AuthView'));

interface AuthAppProps {
  title: string | null;
  baseUrl: string;
}

const AuthApp = ({ title, baseUrl }: AuthAppProps): ReactElement => (
  <AppConfigProvider config={{ title, baseUrl }}>
    <ThemeProvider>
      <Suspense fallback={null}>
        <AuthView />
      </Suspense>
    </ThemeProvider>
  </AppConfigProvider>
);

export default AuthApp;
