'use client';

import Link from 'next/link';
import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageShell } from '@/components/layout/PageShell';
import { RequireAuth } from '@/components/RequireAuth';
import { useUserOrderUpdates } from '@/hooks/useWebSocket';
import { api } from '@/services/api';
import { formatUsd } from '@/lib/utils';
import { isAuthenticated } from '@/lib/auth';

interface OrderSummary {
  _id: string;
  status: string;
  pricingSnapshot: { totalUsd: number };
  createdAt: string;
}

const statusTone: Record<string, 'info' | 'warning' | 'success' | 'neutral'> = {
  PENDING: 'warning',
  COOKING: 'info',
  DELIVERING: 'info',
  DELIVERED: 'success',
  CANCELLED: 'neutral',
};

async function fetchOrders() {
  const { data } = await api.get('/orders');
  return data.data as OrderSummary[];
}

function OrdersContent() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    enabled: isAuthenticated(),
    retry: false,
  });

  const onOrderUpdate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  }, [queryClient]);

  useUserOrderUpdates(onOrderUpdate);

  if (ordersQuery.isLoading) return <LoadingSpinner label="Loading orders..." />;

  if (ordersQuery.isError) {
    return <p className="text-red-300">Could not load orders. Try logging in again.</p>;
  }

  return (
    <>
      {ordersQuery.data?.length === 0 && (
        <p className="terminal-panel rounded-xl p-6 text-center text-muted">
          No orders yet — browse the marketplace to get started.
        </p>
      )}
      <ul className="space-y-3">
        {ordersQuery.data?.map((order) => (
          <li key={order._id}>
            <Link
              href={`/orders/${order._id}`}
              className="terminal-panel flex items-center justify-between rounded-xl p-4 transition hover:border-theme-strong"
            >
              <div>
                <p className="font-mono text-sm text-foreground/80">#{order._id.slice(-8)}</p>
                <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-accent">
                  {formatUsd(order.pricingSnapshot.totalUsd)}
                </span>
                <StatusBadge label={order.status} tone={statusTone[order.status] ?? 'neutral'} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function OrdersPage() {
  return (
    <RequireAuth>
      <PageShell>
        <PageHeader
          status="Delivery log"
          title="Orders"
          subtitle="Track active drone deliveries and payment status."
        />
        <OrdersContent />
      </PageShell>
    </RequireAuth>
  );
}
