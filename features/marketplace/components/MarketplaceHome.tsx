'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RestaurantCard } from '@/components/RestaurantCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getRestaurants } from '@/services/api';
import type { RestaurantsResponse } from '@/features/marketplace/types';

export function MarketplaceHome() {
  const { data, isLoading, isError } = useQuery<RestaurantsResponse>({
    queryKey: ['restaurants'],
    queryFn: getRestaurants,
  });

  return (
    <div className="relative overflow-hidden pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,212,255,0.12),_transparent_50%)]" />

      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:py-16">
        <div className="flex flex-col gap-4">
          <Badge className="w-fit">Neo-Tokyo Sector - Stellar Testnet</Badge>
          <h1 className="max-w-3xl text-4xl font-bold uppercase leading-tight text-white md:text-5xl">
            Food delivery from the <span className="text-cyan-300">future</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-400">
            Browse cyberpunk restaurants, pay with XLM, and track drone deliveries.
          </p>
          <Button asChild size="lg" className="w-fit">
            <Link href="#restaurants">Browse Marketplace</Link>
          </Button>
        </div>

        <div id="restaurants" className="space-y-4">
          <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Top Rated
          </h2>

          {isLoading && <LoadingSpinner label="Loading restaurants..." />}
          {isError && (
            <p className="text-sm text-red-300">
              Could not load restaurants. Is the backend running?
            </p>
          )}
          {data?.data && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.data.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
