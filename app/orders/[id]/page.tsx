'use client';

import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageShell } from '@/components/layout/PageShell';
import { RequireAuth } from '@/components/RequireAuth';
import { useOrderStatus } from '@/hooks/useWebSocket';
import { api } from '@/services/api';
import { formatUsd } from '@/lib/utils';
import { isAuthenticated } from '@/lib/auth';

const TIMELINE = ['PENDING', 'COOKING', 'DELIVERING', 'DELIVERED'] as const;

function OrderDetailContent() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ['order', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${params.id}`);
      return data.data;
    },
    enabled: isAuthenticated() && Boolean(params.id),
    retry: false,
  });

  const onOrderUpdate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['order', params.id] });
  }, [queryClient, params.id]);

  useOrderStatus(params.id, onOrderUpdate);

  if (orderQuery.isLoading) return <LoadingSpinner label="Loading order..." />;
  if (orderQuery.isError || !orderQuery.data) {
    return <p className="text-red-300">Order not found.</p>;
  }

  const order = orderQuery.data;
  const currentIdx = TIMELINE.indexOf(order.status as (typeof TIMELINE)[number]);

  return (
    <PageShell>
      <PageHeader
        status="Live tracking"
        title={`Order #${order._id.slice(-8)}`}
        actions={<StatusBadge label={order.status} />}
      />

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="section-label text-accent">Timeline</h2>
          <ol className="space-y-3">
            {TIMELINE.map((step, idx) => (
              <li
                key={step}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  idx <= currentIdx
                    ? 'border-theme-strong bg-accent-soft cyber-glow'
                    : 'border-theme opacity-50'
                }`}
              >
                <span className="font-mono text-xs text-muted">{idx + 1}</span>
                <span className="font-semibold uppercase tracking-wide">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="terminal-panel rounded-xl p-5">
          <h2 className="section-label mb-4 text-accent">Items</h2>
          <ul className="space-y-2">
            {order.items.map(
              (item: { name: string; quantity: number; priceUsd: number }, i: number) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}× {item.name}
                  </span>
                  <span>{formatUsd(item.priceUsd * item.quantity)}</span>
                </li>
              ),
            )}
          </ul>
          <p className="mt-4 border-t border-theme pt-4 text-right font-semibold text-accent">
            Total {formatUsd(order.pricingSnapshot.totalUsd)}
          </p>
        </section>
      </div>
    </PageShell>
  );
}

export default function OrderDetailPage() {
  return (
    <RequireAuth>
      <OrderDetailContent />
    </RequireAuth>
  );
}
