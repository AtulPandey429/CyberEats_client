import { PageShell } from '@/components/layout/PageShell';
import { MarketplaceHome } from '@/features/marketplace/components/MarketplaceHome';
import { fetchCategoriesServer, fetchTopRestaurantsServer } from '@/lib/server-api';
import type { Restaurant } from '@/features/marketplace/types';

export default async function HomePage() {
  let initialCategories: string[] = [];
  let initialTopRestaurants: Restaurant[] = [];

  try {
    [initialCategories, initialTopRestaurants] = await Promise.all([
      fetchCategoriesServer(),
      fetchTopRestaurantsServer() as Promise<Restaurant[]>,
    ]);
  } catch {
    // Client hooks will retry if SSR fetch fails (e.g. backend offline during build)
  }

  return (
    <PageShell>
      <MarketplaceHome
        initialCategories={initialCategories}
        initialTopRestaurants={initialTopRestaurants}
      />
    </PageShell>
  );
}
