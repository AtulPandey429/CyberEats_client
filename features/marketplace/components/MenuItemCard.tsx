'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatUsd } from '@/lib/utils';
import type { MenuItem } from '@/features/marketplace/types';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const price = item.promoPriceUsd ?? item.priceUsd;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 w-full bg-slate-800">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-slate-400">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-cyan-300">{formatUsd(price)}</span>
          <Button type="button" size="sm" disabled title="Cart wiring arrives on Day 5">
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
