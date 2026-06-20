'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useToast } from '@/providers/ToastProvider';
import { useWebSocket } from '@/hooks/useWebSocket';
import { isAuthenticated } from '@/lib/auth';
import { useEffect } from 'react';

export function MerchantOrdersPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const socket = useWebSocket();

  const ordersQuery = useQuery({
    queryKey: ['merchant-orders'],
    queryFn: async () => {
      const { data } = await api.get('/merchant/orders');
      return data.data as Array<{ _id: string; status: string; version: number }>;
    },
    enabled: isAuthenticated(),
    retry: false,
  });

  useEffect(() => {
    if (!socket) return;
    socket.on('order:status', () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-orders'] });
    });
    return () => {
      socket.off('order:status');
    };
  }, [socket, queryClient]);

  const advance = useMutation({
    mutationFn: async (order: { _id: string; status: string; version: number }) => {
      const next =
        order.status === 'PENDING'
          ? 'COOKING'
          : order.status === 'COOKING'
            ? 'DELIVERING'
            : order.status === 'DELIVERING'
              ? 'DELIVERED'
              : null;
      if (!next) throw new Error('Cannot advance');
      const { data } = await api.patch(`/merchant/orders/${order._id}/status`, {
        status: next,
        version: order.version,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-orders'] });
      toast('Order updated');
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { status?: number } })?.response?.status === 409
          ? 'Conflict — refetching orders'
          : 'Update failed';
      toast(msg, 'error');
      queryClient.invalidateQueries({ queryKey: ['merchant-orders'] });
    },
  });

  if (ordersQuery.isLoading) return <LoadingSpinner label="Loading orders..." />;

  if (ordersQuery.isError) {
    return (
      <p className="text-red-300">
        Unable to load orders. Ensure you are assigned to a restaurant by an admin.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Orders</h1>
        <p className="text-sm text-muted">Live order queue — advance through cooking and delivery</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ordersQuery.data?.length === 0 && (
          <p className="text-muted">No orders yet.</p>
        )}
        {ordersQuery.data?.map((order) => (
          <div key={order._id} className="terminal-panel space-y-3 rounded-xl p-4">
            <div className="flex justify-between">
              <span className="font-mono text-sm text-foreground/80">#{order._id.slice(-8)}</span>
              <StatusBadge label={order.status} />
            </div>
            {['PENDING', 'COOKING', 'DELIVERING'].includes(order.status) && (
              <Button size="sm" className="cyber-glow" disabled={advance.isPending} onClick={() => advance.mutate(order)}>
                Advance status
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
