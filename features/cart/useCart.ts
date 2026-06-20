'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { api } from '@/services/api';
import { isAuthenticated } from '@/lib/auth';

export interface CartItem {
  menuItemId: string;
  name: string;
  priceUsd: number;
  quantity: number;
}

export interface CartState {
  restaurantId: string | null;
  items: CartItem[];
}

export interface AddCartInput {
  menuItemId: string;
  quantity: number;
  replace?: boolean;
}

const emptyCart: CartState = { restaurantId: null, items: [] };

export function isCartRestaurantConflict(error: unknown) {
  const axiosError = error as AxiosError<{ code?: string }>;
  return axiosError.response?.status === 409 && axiosError.response?.data?.code === 'CART_RESTAURANT_CONFLICT';
}

async function fetchCart() {
  const { data } = await api.get('/checkout/cart');
  return data.data as CartState;
}

export function useCart(options?: { enabled?: boolean }) {
  const queryClient = useQueryClient();
  const authed = isAuthenticated();
  const cartEnabled = options?.enabled ?? true;

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: authed && cartEnabled,
    retry: false,
    placeholderData: emptyCart,
  });

  const addItem = useMutation({
    mutationFn: async (input: AddCartInput) => {
      const { data } = await api.post('/checkout/cart/items', input);
      return data.data as CartState;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart);
    },
  });

  const updateItem = useMutation({
    mutationFn: async (input: { menuItemId: string; quantity: number }) => {
      const { data } = await api.patch(`/checkout/cart/items/${input.menuItemId}`, {
        quantity: input.quantity,
      });
      return data.data as CartState;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart);
    },
  });

  const removeItem = useMutation({
    mutationFn: async (menuItemId: string) => {
      const { data } = await api.delete(`/checkout/cart/items/${menuItemId}`);
      return data.data as CartState | null;
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(['cart'], cart ?? emptyCart);
    },
  });

  const clear = useMutation({
    mutationFn: async () => {
      await api.delete('/checkout/cart');
    },
    onSuccess: () => {
      queryClient.setQueryData(['cart'], emptyCart);
    },
  });

  const cart = cartQuery.data ?? emptyCart;
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.priceUsd * i.quantity, 0);

  return { cartQuery, addItem, updateItem, removeItem, clear, itemCount, subtotal, cart, authed };
}

export interface CheckoutRates {
  xlm: { pair: string; rate: number };
  xrp: { pair: string; rate: number };
}

export function useExchangeRate() {
  return useQuery({
    queryKey: ['exchange-rate'],
    queryFn: async () => {
      const { data } = await api.get('/checkout/rates');
      return data.data as CheckoutRates;
    },
    enabled: isAuthenticated(),
    refetchInterval: 30 * 60 * 1000,
    retry: false,
  });
}
