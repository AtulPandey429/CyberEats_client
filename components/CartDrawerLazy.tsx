'use client';

import dynamic from 'next/dynamic';

const CartDrawer = dynamic(
  () => import('@/features/cart/CartDrawer').then((m) => ({ default: m.CartDrawer })),
  { ssr: false },
);

export function CartDrawerLazy() {
  return <CartDrawer />;
}
