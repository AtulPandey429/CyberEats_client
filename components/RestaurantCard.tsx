import Link from 'next/link';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryPill } from '@/components/CategoryPill';
import type { Restaurant } from '@/features/marketplace/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.slug}`}>
      <Card className="transition hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base uppercase tracking-wide">{restaurant.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-cyan-300">
              <Star className="h-4 w-4 fill-cyan-300" />
              {restaurant.rating.toFixed(1)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm text-slate-400">{restaurant.description}</p>
          <div className="flex flex-wrap gap-2">
            {restaurant.categories.slice(0, 2).map((cat) => (
              <CategoryPill key={cat} label={cat} />
            ))}
          </div>
          {restaurant.freeNftPromo && <Badge>Free NFT Promo</Badge>}
        </CardContent>
      </Card>
    </Link>
  );
}
