import type { ReactElement } from 'react';
import { TooltipProvider } from '@/components';
import { ThemeProvider } from '@/contexts';
import { AdminDashboardView } from '@/views/admin/AdminDashboardView';

const AdminApp = (): ReactElement => (
  <ThemeProvider>
    <TooltipProvider delayDuration={200}>
      <AdminDashboardView />
    </TooltipProvider>
  </ThemeProvider>
);

export default AdminApp;
