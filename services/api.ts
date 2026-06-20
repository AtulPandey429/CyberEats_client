'use client';

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { clearAuthTokens, getRefreshToken, setAuthTokens } from '@/lib/auth';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
const rootURL = baseURL.replace('/api/v1', '');

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && config && !config._retry && !config.url?.includes('/auth/refresh')) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          config._retry = true;
          const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
          const tokens = data.data as { accessToken: string; refreshToken: string };
          setAuthTokens(tokens.accessToken, tokens.refreshToken);
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
          return api(config);
        } catch {
          clearAuthTokens();
        }
      }
    }

    if (typeof window !== 'undefined') {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ?? 'API request failed';
      window.dispatchEvent(new CustomEvent('api-error', { detail: { message } }));
    }
    return Promise.reject(error);
  },
);

export interface HealthResponse {
  status: string;
  mongo: string;
  redis: string;
}

export async function getHealth(): Promise<HealthResponse> {
  const { data } = await axios.get<HealthResponse>(`${rootURL}/health`);
  return data;
}

export async function getRestaurants(params?: {
  category?: string;
  sector?: string;
  search?: string;
}) {
  const { data } = await api.get('/restaurants', { params });
  return data;
}

export async function fetchTopRestaurants() {
  const { data } = await api.get('/restaurants/top');
  return data;
}

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data;
}
