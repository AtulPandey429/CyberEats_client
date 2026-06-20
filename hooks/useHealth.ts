'use client';

import { useQuery } from '@tanstack/react-query';
import { getHealth } from '@/services/api';

export function useHealth(enabled = true) {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    enabled,
    refetchInterval: 30_000,
    retry: 1,
    staleTime: 60_000,
  });
}
