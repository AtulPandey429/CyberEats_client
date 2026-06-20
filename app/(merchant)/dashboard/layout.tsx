'use client';

import { RequireAuth } from '@/components/RequireAuth';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { MERCHANT_NAV } from '@/features/merchant/merchant-nav';

export default function MerchantDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={['MERCHANT', 'CO_ADMIN']}>
      <div className="relative min-h-[calc(100vh-var(--app-header-height,4rem))]">
        <div className="relative mx-auto max-w-7xl">
          <DashboardShell
            title="Merchant hub"
            subtitle="Restaurant operations"
            status="Vendor terminal"
            items={MERCHANT_NAV}
          >
            {children}
          </DashboardShell>
        </div>
      </div>
    </RequireAuth>
  );
}
