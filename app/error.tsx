'use client';

import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageShell compact>
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center text-center">
        <p className="section-label text-red-400/80">Critical fault</p>
        <h1 className="text-2xl font-bold uppercase tracking-[0.18em] text-red-300">System error</h1>
        <p className="mt-4 text-muted">Something went wrong in the grid.</p>
        <Button type="button" className="mt-6 cyber-glow" onClick={reset}>
          Retry
        </Button>
      </div>
    </PageShell>
  );
}
