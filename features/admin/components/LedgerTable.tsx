'use client';

import { Button } from '@/components/ui/button';
import { formatUsd } from '@/lib/utils';
import type { LedgerEntry } from '../types';
import { ChartPanel } from './ChartPanel';

interface LedgerTableProps {
  entries: LedgerEntry[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

function formatDate(value?: string) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function LedgerTable({
  entries,
  loading,
  hasMore,
  onLoadMore,
  loadingMore,
}: LedgerTableProps) {
  const empty = !loading && entries.length === 0;

  return (
    <ChartPanel title="Payment ledger" subtitle="Confirmed on-chain payments" loading={loading} empty={empty}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-theme text-muted">
              <th className="pb-2 pr-2 font-medium">Tx hash</th>
              <th className="pb-2 pr-2 font-medium">Asset</th>
              <th className="pb-2 pr-2 font-medium">Amount</th>
              <th className="pb-2 pr-2 font-medium">USD</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((row) => (
              <tr key={row._id} className="border-b border-theme">
                <td className="py-2 pr-2 font-mono text-muted" title={row.txHash}>
                  {row.txHash?.slice(0, 12)}…
                </td>
                <td className="py-2 pr-2 text-accent">{row.cryptoAsset}</td>
                <td className="py-2 pr-2 font-mono text-foreground/80">
                  {row.amountCrypto?.toFixed?.(4)} {row.cryptoAsset}
                </td>
                <td className="py-2 pr-2 text-accent">{formatUsd(row.usdEquivalent)}</td>
                <td className="py-2 text-muted">{formatDate(row.confirmedAt ?? row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && onLoadMore && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? 'Loading…' : 'Load more'}
          </Button>
        </div>
      )}
    </ChartPanel>
  );
}
