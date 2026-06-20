import { cn } from '@/lib/utils';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  /** Tighter padding for auth / compact pages */
  compact?: boolean;
  /** Wider max-width for admin dashboards */
  wide?: boolean;
}

export function PageShell({ children, className, compact, wide }: PageShellProps) {
  return (
    <div
      className={cn(
        'relative min-h-[calc(100vh-var(--app-header-height,4rem))]',
        compact ? 'pb-8' : 'pb-24',
        className,
      )}
    >
      <div
        className={cn(
          'relative mx-auto px-4',
          wide ? 'max-w-7xl' : 'max-w-6xl',
          compact ? 'py-8' : 'py-10',
        )}
      >
        {children}
      </div>
    </div>
  );
}
