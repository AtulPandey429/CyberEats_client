'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/features/cart/useCart';
import { isAuthenticated } from '@/lib/auth';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/lib/utils';

interface CartNavButtonProps {
  className?: string;
}

export function CartNavButton({ className }: CartNavButtonProps) {
  const mounted = useMounted();
  const authed = mounted && isAuthenticated();
  const { itemCount } = useCart({ enabled: authed });

  return (
    <Link
      href={authed ? '/checkout' : '/login?next=%2Fcheckout'}
      prefetch
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-md border border-theme bg-accent-soft text-accent transition-colors hover:border-theme-strong hover:bg-accent-soft/80',
        className,
      )}
      aria-label={itemCount > 0 ? `Cart, ${itemCount} items` : 'Cart'}
      title={itemCount > 0 ? `${itemCount} items in cart` : 'View cart'}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden />
      {authed && itemCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-[var(--background)]">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}
