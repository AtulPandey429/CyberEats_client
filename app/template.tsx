'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className="animate-page-enter">
      {children}
    </div>
  );
}
