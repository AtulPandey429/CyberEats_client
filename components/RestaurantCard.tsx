import Link from 'next/link';
import { Clock, Star } from 'lucide-react';
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
      <Card className="overflow-hidden transition hover:border-theme-strong hover:shadow-[var(--panel-shadow)]">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base uppercase tracking-wide">{restaurant.name}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-accent">
              <Star className="h-4 w-4 fill-[var(--accent-foreground)] text-accent" />
              {restaurant.rating.toFixed(1)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="line-clamp-2 text-sm text-muted">{restaurant.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Clock className="h-3.5 w-3.5" />
            {restaurant.prepTimeRange.min}-{restaurant.prepTimeRange.max} min
          </div>
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
