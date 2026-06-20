'use client';

import { useHealth } from '@/hooks/useHealth';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils';

export function ApiStatusBanner() {
  const mounted = useMounted();
  const { data, isError, isLoading } = useHealth(mounted);

  if (!mounted || isLoading) return null;

  const connected = !isError && data?.mongo === 'connected';

  return (
    <div
      className={cn(
        'border-b px-4 py-1.5 text-center text-xs font-medium tracking-wide transition-colors duration-300',
        connected
          ? 'border-theme bg-accent-soft text-accent/90'
          : 'border-red-400/20 bg-red-400/10 text-red-300',
      )}
    >
      API {connected ? 'CONNECTED' : 'DISCONNECTED'}
      {data ? ` | Mongo: ${data.mongo} | Redis: ${data.redis}` : ''}
    </div>
  );
}
