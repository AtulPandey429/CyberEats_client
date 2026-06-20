import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  status?: string;
  className?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, status, className, actions }: PageHeaderProps) {
  return (
    <header className={cn('mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="space-y-2">
        {status && (
          <p className="section-label text-accent/80">{status}</p>
        )}
        <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-foreground md:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="max-w-2xl text-sm text-muted md:text-base">{subtitle}</p>}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
