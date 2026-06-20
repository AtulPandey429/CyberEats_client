import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';

export default function NotFound() {
  return (
    <PageShell compact>
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center text-center">
        <p className="section-label text-accent/80">Signal lost</p>
        <h1 className="text-4xl font-bold uppercase tracking-[0.2em] text-accent">404</h1>
        <p className="mt-4 text-muted">This sector of Neo-Tokyo doesn&apos;t exist.</p>
        <Link
          href="/"
          className="mt-6 rounded-md bg-accent-soft px-4 py-2 text-sm uppercase tracking-wider text-accent hover:bg-accent-soft"
        >
          Return to marketplace
        </Link>
      </div>
    </PageShell>
  );
}
