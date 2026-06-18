'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CategoryPill } from '@/components/CategoryPill';
import type { Restaurant } from '@/features/marketplace/types';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export function RestaurantHeader({ restaurant, isSaved, onToggleSave }: RestaurantHeaderProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-900/60">
      <div className="relative h-40 w-full bg-slate-800">
        <Image
          src={restaurant.bannerUrl}
          alt={`${restaurant.name} banner`}
          fill
          className="object-cover opacity-80"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wide text-white">
              {restaurant.name}
            </h1>
            <p className="text-sm text-slate-400">{restaurant.sector}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-cyan-300">
              <Star className="h-4 w-4 fill-cyan-300" />
              {restaurant.rating.toFixed(1)}
            </div>
            {onToggleSave && (
              <button
                type="button"
                onClick={onToggleSave}
                className="text-xl"
                aria-label={isSaved ? 'Unsave restaurant' : 'Save restaurant'}
              >
                {isSaved ? '♥' : '♡'}
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-300">{restaurant.description}</p>
        <div className="flex flex-wrap gap-2">
          {restaurant.categories.map((cat) => (
            <CategoryPill key={cat} label={cat} />
          ))}
        </div>
        {restaurant.freeNftPromo && <Badge>Free NFT Promo</Badge>}
      </div>
    </div>
  );
}
