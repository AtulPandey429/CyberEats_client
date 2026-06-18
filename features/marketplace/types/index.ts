export interface Restaurant {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  categories: string[];
  rating: number;
  reviewsCount?: number;
  prepTimeRange: { min: number; max: number };
  sector: string;
  isOpen: boolean;
  freeNftPromo?: boolean;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceUsd: number;
  promoPriceUsd?: number | null;
  categories: string[];
  isAvailable: boolean;
}

export interface RestaurantsResponse {
  status: string;
  data: Restaurant[];
  meta?: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface RestaurantFilters {
  category?: string;
  sector?: string;
  search?: string;
}
