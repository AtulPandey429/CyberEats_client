'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RestaurantCard } from '@/components/RestaurantCard';
import { RestaurantCardSkeleton } from '@/components/RestaurantCardSkeleton';
import { SearchBar } from '@/features/marketplace/components/SearchBar';
import { CategoryFilter } from '@/features/marketplace/components/CategoryFilter';
import {
  useCategories,
  useRestaurants,
  useTopRestaurants,
} from '@/features/marketplace/services/useRestaurants';
import type { Restaurant, RestaurantFilters } from '@/features/marketplace/types';

const SECTORS = ['NEO-TOKYO SECTOR 7', 'NEO-TOKYO SECTOR'];

export function MarketplaceHome() {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const { data: categoriesData } = useCategories();
  const { data: topData, isLoading: topLoading } = useTopRestaurants();
  const { data, isLoading, isError } = useRestaurants(filters);

  const categories = categoriesData?.data ?? [];
  const hasActiveFilters = Boolean(filters.category || filters.sector || filters.search);

  const setSearch = useCallback((search: string) => {
    setFilters((current) => ({ ...current, search: search || undefined }));
  }, []);

  const restaurants = useMemo(() => data?.data ?? [], [data]);

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
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {hasActiveFilters ? 'Results' : 'Top Rated'}
            </h2>
            <div className="flex flex-col gap-3 md:w-96">
              <SearchBar value={filters.search ?? ''} onChange={setSearch} />
              <select
                className="rounded-md border border-cyan-400/20 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                value={filters.sector ?? ''}
                onChange={(e) =>
                  setFilters((current) => ({
                    ...current,
                    sector: e.target.value || undefined,
                  }))
                }
              >
                <option value="">All sectors</option>
                {SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <CategoryFilter
            categories={categories}
            selected={filters.category}
            onSelect={(category) => setFilters((current) => ({ ...current, category }))}
          />

          {(isLoading || (!hasActiveFilters && topLoading)) && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <RestaurantCardSkeleton key={index} />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-sm text-red-300">
              Could not load restaurants. Is the backend running?
            </p>
          )}

          {!isLoading && !isError && restaurants.length === 0 && (
            <p className="rounded-xl border border-cyan-400/20 p-6 text-center text-slate-400">
              No restaurants match your filters.
            </p>
          )}

          {!isLoading && !isError && restaurants.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(hasActiveFilters ? restaurants : (topData?.data ?? restaurants)).map(
                (restaurant: Restaurant) => (
                  <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
