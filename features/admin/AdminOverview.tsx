'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DateRangeFilter } from './components/DateRangeFilter';
import { KpiGrid } from './components/KpiGrid';
import { useAdminOverview, useAdminStats } from './hooks/useAdminDashboard';
import type { AnalyticsRange } from './types';

const AdminCharts = dynamic(() => import('./components/AdminCharts'), {
  ssr: false,
  loading: () => <LoadingSpinner label="Loading charts..." />,
});

export function AdminOverview() {
  const [range, setRange] = useState<AnalyticsRange>('30d');

  const statsQuery = useAdminStats();
  const overviewQuery = useAdminOverview(range);

  if (statsQuery.isLoading) {
    return <LoadingSpinner label="Loading analytics..." />;
  }

  if (statsQuery.isError) {
    return (
      <p className="text-red-300">
        Unable to load admin stats. Ensure your account has FULL_ACCESS permissions.
      </p>
    );
  }

  const overview = overviewQuery.data;
  const timeseries = overview?.timeseries ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Overview</h1>
          <p className="text-sm text-muted">Platform analytics and KPIs</p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <KpiGrid stats={statsQuery.data ?? {}} />

      <AdminCharts
        timeseries={timeseries}
        orderStatus={overview?.orderStatus ?? {}}
        payments={
          overview?.payments ?? { byAsset: {}, byProvider: {}, successRate: 0 }
        }
        topRestaurants={overview?.topRestaurants ?? []}
        loading={overviewQuery.isLoading}
      />
    </div>
  );
}
