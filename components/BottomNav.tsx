'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gift, Package, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/rewards', label: 'Rewards', icon: Gift },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-cyan-400/10 bg-[#111827]/95 backdrop-blur md:hidden">
      <ul className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors',
                  active ? 'text-cyan-300' : 'text-slate-500 hover:text-slate-300',
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
