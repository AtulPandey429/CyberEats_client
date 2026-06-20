'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { isAuthenticated } from '@/lib/auth';

export function NotificationBell() {
  const queryClient = useQueryClient();
  const authed = isAuthenticated();
  const notesQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data as { data: Array<{ _id: string; message: string; read: boolean }>; meta: { unread: number } };
    },
    enabled: authed,
    refetchInterval: 30000,
    retry: false,
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = notesQuery.data?.meta?.unread ?? 0;

  return (
    <div className="relative group">
      <button type="button" className="text-sm text-muted hover:text-accent" aria-label="Notifications">
        🔔{unread > 0 && <span className="ml-1 text-accent">{unread}</span>}
      </button>
      <div className="absolute right-0 top-full z-50 hidden w-72 rounded border border-slate-700 bg-input p-2 shadow-lg group-hover:block">
        {notesQuery.data?.data?.length === 0 && (
          <p className="px-2 py-3 text-xs text-muted">No notifications</p>
        )}
        {notesQuery.data?.data?.slice(0, 5).map((n) => (
          <button
            key={n._id}
            type="button"
            className={`block w-full rounded px-2 py-2 text-left text-xs hover:bg-surface-elevated ${n.read ? 'text-muted' : 'text-foreground/90'}`}
            onClick={() => !n.read && markRead.mutate(n._id)}
          >
            {n.message}
          </button>
        ))}
      </div>
    </div>
  );
}
