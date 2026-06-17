'use client';

import { QueryClient, QueryClientProvider as TanStackProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      }),
  );

  return <TanStackProvider client={client}>{children}</TanStackProvider>;
}
