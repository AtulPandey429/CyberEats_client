'use client';

import { useQuery } from '@tanstack/react-query';
import { getRestaurants, fetchTopRestaurants, fetchCategories } from '@/services/api';
import type { RestaurantFilters } from '@/features/marketplace/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000,
  });
}

export function useTopRestaurants() {
  return useQuery({
    queryKey: ['restaurants', 'top'],
    queryFn: fetchTopRestaurants,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRestaurants(filters: RestaurantFilters) {
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => getRestaurants(filters),
  });
}
