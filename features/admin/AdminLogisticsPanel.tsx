'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/providers/ToastProvider';
import { isAuthenticated } from '@/lib/auth';

interface DroneRow {
  _id: string;
  name: string;
  status: string;
  batteryLevel: number;
  sector: string;
  isOnline: boolean;
}

export function AdminLogisticsPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const dronesQuery = useQuery({
    queryKey: ['admin-drones'],
    queryFn: async () => {
      const { data } = await api.get<{ data: DroneRow[] }>('/admin/logistics/drones');
      return data.data;
    },
    enabled: isAuthenticated(),
  });

  const deployMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/admin/logistics/drone/${id}/deploy`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-drones'] });
      toast('Drone deployed');
    },
    onError: () => toast('Deploy failed', 'error'),
  });

  if (dronesQuery.isLoading) return <LoadingSpinner label="Loading fleet..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Logistics</h1>
        <p className="text-sm text-muted">Drone fleet status and deployment</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {dronesQuery.data?.map((drone) => (
          <div key={drone._id} className="terminal-panel space-y-3 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-accent">{drone.name}</span>
              <StatusBadge label={drone.status} tone={drone.status === 'IDLE' ? 'success' : 'warning'} />
            </div>
            <p className="text-xs text-muted">{drone.sector} · Battery {drone.batteryLevel}%</p>
            <p className="text-xs text-muted">{drone.isOnline ? 'Online' : 'Offline'}</p>
            {drone.status !== 'IDLE' && (
              <Button size="sm" onClick={() => deployMutation.mutate(drone._id)} disabled={deployMutation.isPending}>
                Deploy / reset
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
