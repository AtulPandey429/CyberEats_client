'use client';

import { useHealth } from '@/hooks/useHealth';
import { cn } from '@/lib/utils';

export function ApiStatusBanner() {
  const { data, isError, isLoading } = useHealth();

  if (isLoading) return null;

  const connected = !isError && data?.mongo === 'connected';

  return (
    <div
      className={cn(
        'border-b px-4 py-1.5 text-center text-xs font-medium tracking-wide',
        connected
          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
          : 'border-red-400/20 bg-red-400/10 text-red-300',
      )}
    >
      API {connected ? 'CONNECTED' : 'DISCONNECTED'}
      {data ? ` | Mongo: ${data.mongo} | Redis: ${data.redis}` : ''}
    </div>
  );
}
