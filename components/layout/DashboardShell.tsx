'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface DashboardShellProps {
  title: string;
  subtitle: string;
  status: string;
  items: SidebarItem[];
  children: React.ReactNode;
}

export function DashboardShell({ title, subtitle, status, items, children }: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-var(--app-header-height,4rem))] flex-col lg:flex-row">
      <aside className="border-b border-theme bg-surface/80 lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="hidden p-4 lg:block">
          <p className="section-label text-accent/80">{status}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-foreground">{title}</p>
          <p className="text-xs text-muted">{subtitle}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:gap-0.5 lg:p-3" aria-label="Dashboard navigation">
          {items.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors lg:text-sm',
                  active
                    ? 'bg-accent-soft text-accent cyber-glow'
                    : 'text-muted hover:bg-accent-soft hover:text-accent',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">{children}</div>
    </div>
  );
}
