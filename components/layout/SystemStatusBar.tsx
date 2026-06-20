'use client';

import { useHealth } from '@/hooks/useHealth';

export function SystemStatusBar() {
  const health = useHealth();
  const online = health.data?.status === 'ok';

  return (
    <footer className="mt-8 flex justify-center">
      <p className="font-mono text-xs text-muted">
        <span className={online ? 'text-emerald-400' : 'text-amber-400'}>●</span> System:{' '}
        {online ? 'Online' : 'Degraded'} v2.4.0-STABLE
      </p>
    </footer>
  );
}
