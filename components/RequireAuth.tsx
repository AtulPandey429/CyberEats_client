'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { useAppSelector } from '@/store/hooks';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface RequireAuthProps {
  children: ReactNode;
  roles?: string[];
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector((state) => state.session.user);
  const authed = isAuthenticated();

  useEffect(() => {
    if (!authed) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authed, pathname, router]);

  if (!authed) {
    return <LoadingSpinner label="Redirecting..." />;
  }

  if (roles?.length && user && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-red-300">Access denied</h1>
        <p className="mt-2 text-sm text-muted">
          Your account does not have permission to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
