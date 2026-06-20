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
          ? 'border-theme-strong bg-accent-soft text-accent'
          : 'border-theme text-muted hover:border-theme-strong hover:text-accent',
      )}
    >
      {label}
    </button>
  );
}
