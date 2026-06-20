'use client';

import {
  Activity,
  DollarSign,
  Package,
  Store,
  UserPlus,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { formatUsd } from '@/lib/utils';

interface KpiGridProps {
  stats: {
    orderCount?: number;
    revenueUsd?: number;
    activeNow?: number;
    totalCustomers?: number;
    todayOrders?: number;
    todayRevenueUsd?: number;
    todaySignups?: number;
    restaurantCount?: number;
    openRestaurants?: number;
  };
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="terminal-panel rounded-xl p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="section-label">{label}</p>
        <Icon className="h-4 w-4 text-accent/60" aria-hidden />
      </div>
      <p className="text-2xl font-bold text-accent">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function KpiGrid({ stats }: KpiGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard label="Total orders" value={String(stats.orderCount ?? '—')} icon={Package} />
      <KpiCard label="Revenue USD" value={formatUsd(stats.revenueUsd ?? 0)} icon={DollarSign} />
      <KpiCard
        label="Active now"
        value={String(stats.activeNow ?? '—')}
        sub="Logged-in sessions"
        icon={Activity}
      />
      <KpiCard label="Customers" value={String(stats.totalCustomers ?? '—')} icon={Users} />
      <KpiCard
        label="Today orders"
        value={String(stats.todayOrders ?? '—')}
        sub={formatUsd(stats.todayRevenueUsd ?? 0)}
        icon={Package}
      />
      <KpiCard
        label="Restaurants"
        value={`${stats.openRestaurants ?? 0}/${stats.restaurantCount ?? 0}`}
        sub={`${stats.todaySignups ?? 0} signups today`}
        icon={Store}
      />
    </div>
  );
}
