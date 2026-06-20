'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/providers/ToastProvider';
import { isAuthenticated } from '@/lib/auth';

interface RestaurantData {
  restaurant: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    sector: string;
    isOpen: boolean;
    categories: string[];
    prepTimeRange: { min: number; max: number };
    rating: number;
  };
  staffRole: string;
}

export function MerchantRestaurantPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const restaurantQuery = useQuery({
    queryKey: ['merchant-restaurant'],
    queryFn: async () => {
      const { data } = await api.get<{ data: RestaurantData }>('/merchant/restaurant');
      return data.data;
    },
    enabled: isAuthenticated(),
    retry: false,
  });

  const toggleMutation = useMutation({
    mutationFn: async (isOpen: boolean) => {
      const { data } = await api.patch('/merchant/restaurant', { isOpen });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-restaurant'] });
      toast('Restaurant updated');
    },
  });

  if (restaurantQuery.isLoading) return <LoadingSpinner label="Loading restaurant..." />;

  if (restaurantQuery.isError || !restaurantQuery.data) {
    return <p className="text-red-300">No restaurant linked. Ask admin to assign you via Restaurants tab.</p>;
  }

  const { restaurant, staffRole } = restaurantQuery.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Restaurant</h1>
        <p className="text-sm text-muted">Your venue profile and availability</p>
      </div>

      <div className="terminal-panel space-y-4 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-accent">{restaurant.name}</h2>
          <StatusBadge label={restaurant.isOpen ? 'Open' : 'Closed'} tone={restaurant.isOpen ? 'success' : 'warning'} />
        </div>
        <p className="text-sm text-muted">{restaurant.description}</p>
        <dl className="grid gap-2 text-sm md:grid-cols-2">
          <div><dt className="text-muted">Slug</dt><dd className="font-mono text-accent">/{restaurant.slug}</dd></div>
          <div><dt className="text-muted">Sector</dt><dd className="text-foreground/80">{restaurant.sector}</dd></div>
          <div><dt className="text-muted">Prep time</dt><dd className="text-foreground/80">{restaurant.prepTimeRange.min}–{restaurant.prepTimeRange.max} min</dd></div>
          <div><dt className="text-muted">Your role</dt><dd className="text-foreground/80">{staffRole}</dd></div>
          <div><dt className="text-muted">Categories</dt><dd className="text-foreground/80">{restaurant.categories.join(', ')}</dd></div>
          <div><dt className="text-muted">Rating</dt><dd className="text-foreground/80">{restaurant.rating.toFixed(1)}</dd></div>
        </dl>
        <Button
          onClick={() => toggleMutation.mutate(!restaurant.isOpen)}
          disabled={toggleMutation.isPending}
        >
          {restaurant.isOpen ? 'Close restaurant' : 'Open restaurant'}
        </Button>
      </div>
    </div>
  );
}
