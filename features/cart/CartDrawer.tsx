'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/features/cart/useCart';
import { isCartEnabledRoute } from '@/lib/cart-routes';
import { formatUsd } from '@/lib/utils';

export function CartDrawer() {
  const pathname = usePathname();
  const cartRoute = isCartEnabledRoute(pathname);
  const { cart, removeItem, itemCount, subtotal, authed } = useCart({ enabled: cartRoute });

  if (!authed || !cartRoute || itemCount === 0 || pathname.startsWith('/checkout')) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-16 z-40 border-t border-theme bg-[var(--nav-bg)] px-4 py-3 backdrop-blur md:bottom-6 md:left-auto md:right-6 md:max-w-md md:rounded-xl md:border md:shadow-[0_8px_32px_rgba(0,0,0,0.15)] md:cyber-glow dark:md:shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
      role="region"
      aria-label="Cart summary"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-theme bg-accent-soft">
            <ShoppingBag className="h-5 w-5 text-accent" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="section-label text-accent">{itemCount} items in cart</p>
            <p className="truncate font-semibold text-foreground">{formatUsd(subtotal)}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {cart?.items.slice(0, 1).map((item) => (
            <button
              key={item.menuItemId}
              type="button"
              className="hidden max-w-[8rem] truncate text-xs text-muted hover:text-red-300 md:inline"
              onClick={() => removeItem.mutate(item.menuItemId)}
            >
              Remove {item.name}
            </button>
          ))}
          <Button asChild size="sm" className="cyber-glow">
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
