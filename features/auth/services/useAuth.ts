'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import { clearAuthTokens, isAuthenticated, setAuthTokens } from '@/lib/auth';
import { useAppDispatch } from '@/store/hooks';
import { clearUser, setUser } from '@/store/sessionSlice';
import { useToast } from '@/providers/ToastProvider';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginResponse {
  status: string;
  data:
    | {
        accessToken: string;
        refreshToken: string;
        user: AuthUser;
      }
    | {
        requires2FA: true;
        tempToken: string;
      };
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data.data;
    },
    enabled: isAuthenticated(),
    retry: false,
  });
}

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: { email: string; password: string; totpCode?: string }) => {
      const { data } = await api.post<LoginResponse>('/auth/login', payload);
      return data.data;
    },
    onSuccess: (data) => {
      if ('requires2FA' in data) return;
      setAuthTokens(data.accessToken, data.refreshToken);
      dispatch(setUser(data.user));
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast('Logged in successfully');
      const next = searchParams.get('next');
      router.replace(next && next.startsWith('/') ? next : '/');
    },
    onError: () => {
      toast('Invalid email or password', 'error');
    },
  });
}

export function useTwoFactorLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: { tempToken: string; totpCode: string }) => {
      const { data } = await api.post('/auth/2fa/login', payload);
      return data.data;
    },
    onSuccess: (data) => {
      setAuthTokens(data.accessToken, data.refreshToken);
      dispatch(setUser(data.user));
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast('Logged in successfully');
      const next = searchParams.get('next');
      router.replace(next && next.startsWith('/') ? next : '/');
    },
    onError: () => {
      toast('Invalid 2FA code', 'error');
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const { data } = await api.post('/auth/signup', payload);
      return data.data;
    },
    onSuccess: (data) => {
      setAuthTokens(data.accessToken, data.refreshToken);
      dispatch(setUser(data.user));
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast('Account created successfully');
      const next = searchParams.get('next');
      router.replace(next && next.startsWith('/') ? next : '/');
    },
    onError: () => {
      toast('Signup failed — email may already exist', 'error');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    },
    onSettled: () => {
      clearAuthTokens();
      dispatch(clearUser());
      queryClient.clear();
      toast('Logged out');
      router.push('/login');
    },
  });
}
