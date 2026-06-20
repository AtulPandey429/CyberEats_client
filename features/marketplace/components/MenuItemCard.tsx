'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartReplaceDialog } from '@/features/cart/CartReplaceDialog';
import { isCartRestaurantConflict, useCart } from '@/features/cart/useCart';
import { formatUsd } from '@/lib/utils';
import { useToast } from '@/providers/ToastProvider';
import { isAuthenticated } from '@/lib/auth';
import type { MenuItem } from '@/features/marketplace/types';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const price = item.promoPriceUsd ?? item.priceUsd;
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);

  function addToCart(replace = false) {
    addItem.mutate(
      { menuItemId: item._id, quantity: 1, replace },
      {
        onSuccess: () => {
          setShowReplaceDialog(false);
          toast(`Added ${item.name}`);
        },
        onError: (err: unknown) => {
          const status = (err as { response?: { status?: number } })?.response?.status;
          if (status === 401) {
            router.push(`/login?next=${encodeURIComponent(pathname)}`);
            return;
          }
          if (isCartRestaurantConflict(err)) {
            setShowReplaceDialog(true);
            return;
          }
          toast('Could not add to cart', 'error');
        },
      },
    );
  }

  function handleAdd() {
    if (!isAuthenticated()) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    addToCart(false);
  }

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-theme-strong hover:shadow-[var(--panel-shadow)]">
        <div className="relative h-32 w-full bg-surface-elevated">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-base uppercase tracking-wide">{item.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm text-muted">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-accent">{formatUsd(price)}</span>
            <Button type="button" size="sm" disabled={addItem.isPending} onClick={handleAdd}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <CartReplaceDialog
        open={showReplaceDialog}
        itemName={item.name}
        isPending={addItem.isPending}
        onConfirm={() => addToCart(true)}
        onCancel={() => setShowReplaceDialog(false)}
      />
    </>
  );
}
