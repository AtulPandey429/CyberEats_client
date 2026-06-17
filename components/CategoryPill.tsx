import { cn } from '@/lib/utils';

interface CategoryPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryPill({ label, active, onClick }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors',
        active
          ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
          : 'border-cyan-400/20 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-300',
      )}
    >
      {label}
    </button>
  );
}
