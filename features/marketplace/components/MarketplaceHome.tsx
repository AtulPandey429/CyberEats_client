'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
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

interface MarketplaceHomeProps {
  initialCategories?: string[];
  initialTopRestaurants?: Restaurant[];
}

export function MarketplaceHome({
  initialCategories = [],
  initialTopRestaurants = [],
}: MarketplaceHomeProps) {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const { data: categoriesData } = useCategories(
    initialCategories.length > 0
      ? { status: 'success', data: initialCategories }
      : undefined,
  );
  const { data: topData, isLoading: topLoading } = useTopRestaurants(
    initialTopRestaurants.length > 0
      ? { status: 'success', data: initialTopRestaurants }
      : undefined,
  );
  const { data, isLoading, isError } = useRestaurants(filters);

  const categories = categoriesData?.data ?? [];
  const hasActiveFilters = Boolean(filters.category || filters.sector || filters.search);

  const setSearch = useCallback((search: string) => {
    setFilters((current) => ({ ...current, search: search || undefined }));
  }, []);

  const restaurants = useMemo(() => data?.data ?? [], [data]);

  return (
    <section className="flex flex-col gap-10">
      <PageHeader
        status="Neo-Tokyo Sector · Stellar Testnet"
        title={
          <>
            Food delivery from the <span className="text-accent">future</span>
          </>
        }
        subtitle="Browse cyberpunk restaurants, pay with XLM, and track drone deliveries."
        actions={
          <Button asChild size="lg" className="cyber-glow">
            <Link href="#restaurants">Browse Marketplace</Link>
          </Button>
        }
      />

      <div id="restaurants" className="space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="section-label text-accent">
            {hasActiveFilters ? 'Search results' : 'Top rated vendors'}
          </h2>
          <div className="flex flex-col gap-3 md:w-96">
            <SearchBar value={filters.search ?? ''} onChange={setSearch} />
            <select
              className="select-theme w-full"
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
          <p className="text-sm text-red-300">Could not load restaurants. Is the backend running?</p>
        )}

        {!isLoading && !isError && restaurants.length === 0 && (
          <p className="terminal-panel rounded-xl p-6 text-center text-muted">
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
  );
}
