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

export interface RestaurantsResponse {
  status: string;
  data: Restaurant[];
}
