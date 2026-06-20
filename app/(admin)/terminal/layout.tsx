'use client';

import { RequireAuth } from '@/components/RequireAuth';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { ADMIN_NAV } from '@/features/admin/admin-nav';

export default function AdminTerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={['FULL_ACCESS']}>
      <div className="relative min-h-[calc(100vh-var(--app-header-height,4rem))]">
        <div className="relative mx-auto max-w-7xl">
          <DashboardShell
            title="Admin terminal"
            subtitle="Platform control"
            status="Command node"
            items={ADMIN_NAV}
          >
            {children}
          </DashboardShell>
        </div>
      </div>
    </RequireAuth>
  );
}
