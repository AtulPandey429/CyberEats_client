'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useCart } from '@/features/cart/useCart';
import { isCartEnabledRoute } from '@/lib/cart-routes';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const cartRoute = isCartEnabledRoute(pathname);
  const { itemCount, authed } = useCart({ enabled: cartRoute });
  const cartVisible =
    cartRoute &&
    authed &&
    itemCount > 0 &&
    !pathname.startsWith('/checkout');

  return (
    <main
      className={cn(
        'relative min-h-[calc(100vh-var(--app-header-height,4rem))] flex-1',
        cartVisible && 'pb-[5.5rem] md:pb-28',
      )}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 app-background" aria-hidden />
      <div className="relative">{children}</div>
    </main>
  );
}
