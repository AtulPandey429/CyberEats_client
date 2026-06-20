import { cn } from '@/lib/utils';

const toneMap = {
  success: 'border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-fg)]',
  warning: 'border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-fg)]',
  error: 'border-[var(--error-border)] bg-[var(--error-bg)] text-[var(--error-fg)]',
  info: 'border-[var(--info-border)] bg-[var(--info-bg)] text-[var(--info-fg)]',
  neutral: 'border-theme bg-surface-elevated text-muted',
} as const;

interface StatusBadgeProps {
  label: string;
  tone?: keyof typeof toneMap;
}

export function StatusBadge({ label, tone = 'info' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        toneMap[tone],
      )}
    >
      {label}
    </span>
  );
}
