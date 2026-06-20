'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gift, Package, User } from 'lucide-react';
import { useMounted } from '@/hooks/useMounted';
import { isDashboardRoute } from '@/lib/cart-routes';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/rewards', label: 'Rewards', icon: Gift },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const mounted = useMounted();

  if (isDashboardRoute(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-theme bg-[var(--nav-bg)] backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = mounted && pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                prefetch
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors',
                  active ? 'text-accent cyber-glow' : 'text-muted hover:text-accent',
                )}
              >
                <Icon className={cn('h-5 w-5', active && 'text-accent')} />
                <span className="uppercase tracking-wider">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
