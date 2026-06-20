'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { isAuthenticated } from '@/lib/auth';
import { useLogout } from '@/features/auth/services/useAuth';
import { NotificationBell } from '@/components/NotificationBell';
import { CartNavButton } from '@/components/CartNavButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Marketplace', href: '/' },
  { label: 'Rewards', href: '/rewards' },
  { label: 'Orders', href: '/orders' },
  { label: 'Profile', href: '/profile' },
];

interface NavbarProps {
  scrolled?: boolean;
}

export function Navbar({ scrolled = false }: NavbarProps) {
  const pathname = usePathname();
  const mounted = useMounted();
  const user = useAppSelector((state) => state.session.user);
  const loggedIn = mounted && (Boolean(user) || isAuthenticated());
  const logout = useLogout();

  return (
    <header
      className={cn(
        'border-b border-theme transition-all duration-300 ease-out',
        scrolled
          ? 'bg-[var(--header-bg)] shadow-[var(--panel-shadow)] backdrop-blur-xl backdrop-saturate-150'
          : 'border-transparent bg-[var(--header-bg-top)] backdrop-blur-md backdrop-saturate-125',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.22em] text-accent transition-opacity hover:opacity-80"
          >
            CYBEREATS
          </Link>
          <p className="section-label hidden lg:block">Neo-Tokyo Grid</p>
        </div>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = mounted && pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={cn(
                  'rounded-md px-3 py-2 text-sm uppercase tracking-wider transition-all duration-200',
                  active
                    ? 'bg-accent-soft text-accent cyber-glow'
                    : 'text-muted hover:bg-accent-soft hover:text-accent',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex min-h-[2rem] items-center gap-3">
          <CartNavButton />
          <ThemeToggle />
          {!mounted ? (
            <div className="h-5 w-28" aria-hidden />
          ) : loggedIn ? (
            <>
              <NotificationBell />
              <Link
                href="/profile"
                className="text-sm text-foreground/80 transition-colors hover:text-accent"
              >
                {user ? user.firstName : 'Account'}
              </Link>
              <button
                type="button"
                onClick={() => logout.mutate()}
                className="text-sm text-muted transition-colors hover:text-accent hover:underline"
                disabled={logout.isPending}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm uppercase tracking-wider text-muted transition-colors hover:text-accent"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-accent-soft px-3 py-1.5 text-sm font-medium uppercase tracking-wider text-accent transition-all duration-200 hover:opacity-90 cyber-glow"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
