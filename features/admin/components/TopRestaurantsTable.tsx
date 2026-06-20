'use client';

import Link from 'next/link';
import { ChartPanel } from './ChartPanel';
import { formatUsd } from '@/lib/utils';

interface TopRestaurantsTableProps {
  restaurants: Array<{
    name: string;
    slug: string;
    orderCount: number;
    revenueUsd: number;
  }>;
  loading?: boolean;
}

export function TopRestaurantsTable({ restaurants, loading }: TopRestaurantsTableProps) {
  const empty = !loading && restaurants.length === 0;

  return (
    <ChartPanel title="Top restaurants" subtitle="By order volume in range" loading={loading} empty={empty}>
      <ul className="space-y-2">
        {restaurants.map((r, i) => (
          <li
            key={r.slug}
            className="flex items-center justify-between rounded-lg border border-theme bg-accent-soft px-3 py-2 text-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-accent-soft text-xs font-bold text-accent">
                {i + 1}
              </span>
              <Link href={`/restaurants/${r.slug}`} className="truncate text-accent hover:underline">
                {r.name}
              </Link>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-xs text-accent">{r.orderCount} orders</p>
              <p className="text-xs text-muted">{formatUsd(r.revenueUsd)}</p>
            </div>
          </li>
        ))}
      </ul>
    </ChartPanel>
  );
}
