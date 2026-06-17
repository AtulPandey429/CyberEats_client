'use client';

import axios from 'axios';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      const message = error.response?.data?.message ?? 'API request failed';
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

export async function getRestaurants() {
  const { data } = await api.get('/restaurants');
  return data;
}
