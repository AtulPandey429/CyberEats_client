'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
  children: ReactNode;
}

export function ChartPanel({
  title,
  subtitle,
  loading,
  empty,
  emptyMessage = 'No data for this period.',
  className,
  children,
}: ChartPanelProps) {
  return (
    <section className={cn('terminal-panel rounded-xl p-4 md:p-5', className)}>
      <div className="mb-4">
        <h2 className="section-label text-accent">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
      </div>
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-theme border-t-accent" />
        </div>
      ) : empty ? (
        <p className="py-12 text-center text-sm text-muted">{emptyMessage}</p>
      ) : (
        children
      )}
    </section>
  );
}

export const CHART_COLORS = {
  cyan: '#00d4ff',
  teal: '#14b8a6',
  violet: '#8b5cf6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  slate: '#64748b',
};

export const chartTooltipStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--border-strong)',
  borderRadius: '8px',
  fontSize: '12px',
  fontFamily: 'var(--font-geist-mono)',
  color: 'var(--foreground)',
};

export const chartAxisStyle = {
  fill: 'var(--foreground-muted)',
  fontSize: 10,
  fontFamily: 'var(--font-geist-mono)',
};
