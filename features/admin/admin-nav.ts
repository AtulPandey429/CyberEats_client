import {
  BarChart3,
  Building2,
  Plane,
  Receipt,
  Users,
} from 'lucide-react';
import type { SidebarItem } from '@/components/layout/DashboardShell';

export const ADMIN_NAV: SidebarItem[] = [
  { href: '/terminal', label: 'Overview', icon: BarChart3, exact: true },
  { href: '/terminal/restaurants', label: 'Restaurants', icon: Building2 },
  { href: '/terminal/staff', label: 'Staff', icon: Users },
  { href: '/terminal/ledger', label: 'Ledger', icon: Receipt },
  { href: '/terminal/logistics', label: 'Logistics', icon: Plane },
];
