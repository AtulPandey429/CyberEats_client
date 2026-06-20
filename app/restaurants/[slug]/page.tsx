import { RestaurantDetailClient } from '@/features/marketplace/components/RestaurantDetailClient';
import {
  fetchRestaurantBySlugServer,
  fetchRestaurantMenuServer,
} from '@/lib/server-api';
import type { MenuItem, Restaurant } from '@/features/marketplace/types';

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantDetailPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  let initialRestaurant: Restaurant | undefined;
  let initialMenu: MenuItem[] | undefined;

  try {
    const [restaurant, menu] = await Promise.all([
      fetchRestaurantBySlugServer(slug) as Promise<Restaurant>,
      fetchRestaurantMenuServer(slug) as Promise<MenuItem[]>,
    ]);
    initialRestaurant = restaurant;
    initialMenu = menu;
  } catch {
    // Client queries will fetch if SSR fails
  }

  return (
    <RestaurantDetailClient
      slug={slug}
      initialRestaurant={initialRestaurant}
      initialMenu={initialMenu}
    />
  );
}
