import { cn } from '@/lib/utils';

const toneMap = {
  success: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  warning: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  error: 'border-red-400/30 bg-red-400/10 text-red-300',
  info: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  neutral: 'border-slate-600 bg-slate-800 text-slate-300',
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
