'use client';

import { useEffect, useState } from 'react';

/** Avoid SSR/client hydration mismatches for browser-only state (localStorage, etc.). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
