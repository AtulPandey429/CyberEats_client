'use client';

import { cn } from '@/lib/utils';
import type { AnalyticsRange } from '../types';

const RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

interface DateRangeFilterProps {
  value: AnalyticsRange;
  onChange: (range: AnalyticsRange) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div
      className="flex gap-1 rounded-lg border border-theme bg-surface/80 p-1"
      role="group"
      aria-label="Date range filter"
    >
      {RANGES.map(({ value: range, label }) => (
        <button
          key={range}
          type="button"
          onClick={() => onChange(range)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors',
            value === range
              ? 'bg-accent-soft text-accent shadow-[0_0_12px_rgba(0,212,255,0.2)]'
              : 'text-muted hover:text-foreground/80',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
