'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { RestaurantHeader } from '@/features/marketplace/components/RestaurantHeader';
import { MenuItemCard } from '@/features/marketplace/components/MenuItemCard';
import { api } from '@/services/api';
import { isAuthenticated } from '@/lib/auth';
import type { MenuItem, Restaurant } from '@/features/marketplace/types';

async function fetchRestaurant(slug: string) {
  const { data } = await api.get(`/restaurants/${slug}`);
  return data.data as Restaurant;
}

async function fetchMenu(slug: string) {
  const { data } = await api.get(`/restaurants/${slug}/menu`);
  return data.data as MenuItem[];
}

export default function RestaurantDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const queryClient = useQueryClient();

  const restaurantQuery = useQuery({
    queryKey: ['restaurant', slug],
    queryFn: () => fetchRestaurant(slug),
    enabled: Boolean(slug),
  });

  const menuQuery = useQuery({
    queryKey: ['restaurant-menu', slug],
    queryFn: () => fetchMenu(slug),
    enabled: Boolean(slug),
  });

  const savedQuery = useQuery({
    queryKey: ['saved-restaurants'],
    queryFn: async () => {
      const { data } = await api.get('/saved-restaurants');
      return data.data as Restaurant[];
    },
    enabled: isAuthenticated(),
  });

  const toggleSave = useMutation({
    mutationFn: async (restaurantId: string) => {
      const isSaved = savedQuery.data?.some((item) => item._id === restaurantId);
      if (isSaved) {
        await api.delete(`/saved-restaurants/${restaurantId}`);
        return false;
      }
      await api.post('/saved-restaurants', { restaurantId });
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-restaurants'] });
    },
  });

  const isSaved = useMemo(
    () => savedQuery.data?.some((item) => item._id === restaurantQuery.data?._id) ?? false,
    [savedQuery.data, restaurantQuery.data?._id],
  );

  if (restaurantQuery.isLoading) {
    return <LoadingSpinner label="Loading restaurant..." />;
  }

  if (restaurantQuery.isError || !restaurantQuery.data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 pb-24">
        <p className="text-red-300">Restaurant not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 pb-24">
      <RestaurantHeader
        restaurant={restaurantQuery.data}
        isSaved={isSaved}
        onToggleSave={
          isAuthenticated()
            ? () => toggleSave.mutate(restaurantQuery.data._id)
            : undefined
        }
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-cyan-300">Menu</h2>
        {menuQuery.isLoading && <LoadingSpinner label="Loading menu..." />}
        {menuQuery.data && menuQuery.data.length === 0 && (
          <p className="text-slate-400">No available menu items right now.</p>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuQuery.data?.map((item) => <MenuItemCard key={item._id} item={item} />)}
        </div>
      </section>
    </div>
  );
}
