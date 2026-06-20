'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LedgerTable } from './components/LedgerTable';
import { useAdminLedger } from './hooks/useAdminDashboard';

export function AdminLedgerPanel() {
  const ledgerQuery = useAdminLedger();
  const entries = ledgerQuery.data?.pages.flatMap((p) => p.items) ?? [];

  if (ledgerQuery.isLoading) return <LoadingSpinner label="Loading ledger..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Payment ledger</h1>
        <p className="text-sm text-muted">Confirmed on-chain payments</p>
      </div>
      <LedgerTable
        entries={entries}
        loading={false}
        hasMore={ledgerQuery.hasNextPage}
        onLoadMore={() => ledgerQuery.fetchNextPage()}
        loadingMore={ledgerQuery.isFetchingNextPage}
      />
    </div>
  );
}
