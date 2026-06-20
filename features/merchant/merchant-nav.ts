import { ClipboardList, Store, UtensilsCrossed } from 'lucide-react';
import type { SidebarItem } from '@/components/layout/DashboardShell';

export const MERCHANT_NAV: SidebarItem[] = [
  { href: '/dashboard', label: 'Orders', icon: ClipboardList, exact: true },
  { href: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/dashboard/restaurant', label: 'Restaurant', icon: Store },
];
