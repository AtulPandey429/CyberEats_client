'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { isAuthenticated } from '@/lib/auth';
import type { AnalyticsOverview, AnalyticsRange, DashboardStats, LedgerEntry } from '../types';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get<{ data: DashboardStats }>('/admin/dashboard/stats');
      return data.data;
    },
    enabled: isAuthenticated(),
    retry: false,
    staleTime: 120_000,
  });
}

export function useAdminOverview(range: AnalyticsRange) {
  return useQuery({
    queryKey: ['admin-overview', range],
    queryFn: async () => {
      const { data } = await api.get<{ data: AnalyticsOverview }>(
        `/admin/analytics/overview?range=${range}`,
      );
      return data.data;
    },
    enabled: isAuthenticated(),
    retry: false,
    staleTime: 120_000,
  });
}

export function useAdminLedger() {
  return useInfiniteQuery({
    queryKey: ['admin-ledger'],
    queryFn: async ({ pageParam }) => {
      const params = pageParam ? `?cursor=${pageParam}&limit=15` : '?limit=15';
      const { data } = await api.get<{
        data: LedgerEntry[];
        meta: { nextCursor: string | null; hasMore: boolean };
      }>(`/admin/dashboard/ledger${params}`);
      return { items: data.data, meta: data.meta };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.meta.hasMore ? last.meta.nextCursor ?? undefined : undefined),
    enabled: isAuthenticated(),
    retry: false,
  });
}
