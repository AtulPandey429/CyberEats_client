'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthTokens } from '@/lib/auth';
import { api } from '@/services/api';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/sessionSlice';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/providers/ToastProvider';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast(error, 'error');
      router.replace('/login');
      return;
    }

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const next = searchParams.get('next') ?? '/';

    if (!accessToken || !refreshToken) {
      toast('OAuth login failed — missing tokens', 'error');
      router.replace('/login');
      return;
    }

    setAuthTokens(accessToken, refreshToken);

    api
      .get('/auth/me')
      .then(({ data }) => {
        const user = data.data;
        dispatch(
          setUser({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          }),
        );
        toast('Logged in successfully');
        router.replace(next);
      })
      .catch(() => {
        toast('OAuth login failed', 'error');
        router.replace('/login');
      });
  }, [dispatch, router, searchParams, toast]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <LoadingSpinner />
      <p className="text-sm text-slate-400">Completing sign in...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
