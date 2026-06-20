'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { isAuthenticated } from '@/lib/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/sessionSlice';

export function SessionHydrator() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);

  const { data } = useQuery({
    queryKey: ['me', 'bootstrap'],
    queryFn: async () => {
      const { data: response } = await api.get('/auth/me');
      return response.data as {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    },
    enabled: isAuthenticated() && !user,
    retry: false,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!data || user) return;
    dispatch(
      setUser({
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      }),
    );
  }, [data, user, dispatch]);

  return null;
}
