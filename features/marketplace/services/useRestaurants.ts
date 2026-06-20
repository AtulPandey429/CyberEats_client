'use client';

import { useQuery } from '@tanstack/react-query';
import { getRestaurants, fetchTopRestaurants, fetchCategories } from '@/services/api';
import type { Restaurant, RestaurantFilters } from '@/features/marketplace/types';

type CategoriesResponse = Awaited<ReturnType<typeof fetchCategories>>;
type TopRestaurantsResponse = Awaited<ReturnType<typeof fetchTopRestaurants>>;

export function useCategories(initialData?: CategoriesResponse) {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000,
    initialData,
  });
}

export function useTopRestaurants(initialData?: TopRestaurantsResponse) {
  return useQuery({
    queryKey: ['restaurants', 'top'],
    queryFn: fetchTopRestaurants,
    staleTime: 5 * 60 * 1000,
    initialData,
  });
}

export function useRestaurants(filters: RestaurantFilters) {
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => getRestaurants(filters),
  });
}
