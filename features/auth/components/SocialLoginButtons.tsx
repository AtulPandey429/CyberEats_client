'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { setAuthTokens } from '@/lib/auth';
import {
  isFirebaseClientConfigured,
  signInWithGoogleViaFirebase,
  getFirebaseAuthErrorMessage,
} from '@/lib/firebase';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/sessionSlice';
import { useToast } from '@/providers/ToastProvider';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
const USE_FIREBASE_GOOGLE = isFirebaseClientConfigured();

interface TelegramAuthUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramAuthUser) => void;
  }
}

function ProtocolButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-xl border border-theme bg-input',
        'text-foreground/90 transition-all duration-200 hover:scale-105 hover:border-theme-strong hover:bg-accent-soft hover:shadow-[0_0_16px_rgba(0,212,255,0.2)]',
        'disabled:pointer-events-none disabled:opacity-50',
      )}
    >
      {children}
    </button>
  );
}

export function SocialLoginButtons() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const telegramRef = useRef<HTMLDivElement>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const completeLogin = useCallback(
    (tokens: {
      accessToken: string;
      refreshToken: string;
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    }) => {
      setAuthTokens(tokens.accessToken, tokens.refreshToken);
      dispatch(setUser(tokens.user));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast('Session initialized');
      const next = new URLSearchParams(window.location.search).get('next');
      router.replace(next && next.startsWith('/') ? next : '/');
    },
    [dispatch, queryClient, router, toast],
  );

  const startOAuth = (provider: 'google' | 'facebook' | 'discord') => {
    window.location.href = `${API_BASE}/auth/${provider}`;
  };

  const handleGoogleLogin = async () => {
    if (USE_FIREBASE_GOOGLE) {
      setGoogleLoading(true);
      try {
        const idToken = await signInWithGoogleViaFirebase();
        const { data } = await api.post('/auth/firebase', { idToken });
        completeLogin(data.data);
      } catch (error) {
        const apiMessage =
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message ===
            'string'
            ? (error as { response: { data: { message: string } } }).response.data.message
            : null;
        toast(apiMessage ?? getFirebaseAuthErrorMessage(error), 'error');
      } finally {
        setGoogleLoading(false);
      }
      return;
    }

    startOAuth('google');
  };

  const handleTelegramAuth = useCallback(
    async (user: TelegramAuthUser) => {
      try {
        const { data } = await api.post('/auth/telegram', user);
        const tokens = data.data;
        setAuthTokens(tokens.accessToken, tokens.refreshToken);
        dispatch(setUser(tokens.user));
        toast('Session initialized via Telegram');
        router.replace('/');
      } catch {
        toast('Telegram login failed', 'error');
      }
    },
    [dispatch, router, toast],
  );

  useEffect(() => {
    window.onTelegramAuth = handleTelegramAuth;
    return () => {
      delete window.onTelegramAuth;
    };
  }, [handleTelegramAuth]);

  useEffect(() => {
    if (!TELEGRAM_BOT_USERNAME || !telegramRef.current) return;

    telegramRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    telegramRef.current.appendChild(script);
  }, []);

  return (
    <div className="animate-fade-in-up-delay-1 mb-2 space-y-4">
      <p className="section-label text-accent/70">Multi-protocol access</p>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        <ProtocolButton
          label={googleLoading ? 'Signing in with Google' : 'Continue with Google'}
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              fill="#EA4335"
              d="M12 10.2v3.6h5.1c-.2 1.2-1.6 3.5-5.1 3.5-3.1 0-5.6-2.5-5.6-5.6S8.9 6.1 12 6.1c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.8 3.7 14.6 2.8 12 2.8 7.2 2.8 3.3 6.7 3.3 11.5S7.2 20.2 12 20.2c6.9 0 8.6-4.8 8.6-7.2 0-.5 0-1-.1-1.4H12z"
            />
          </svg>
        </ProtocolButton>
        <ProtocolButton label="Continue with Facebook" onClick={() => startOAuth('facebook')}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1877F2]" aria-hidden>
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.037 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.11 24 18.1 24 12.073z" />
          </svg>
        </ProtocolButton>
        <ProtocolButton label="Continue with Discord" onClick={() => startOAuth('discord')}>
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#5865F2]" aria-hidden>
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 12.3 12.3 0 0 0-.608 1.25 18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C1.566 7.8.393 11.12.393 14.473a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-3.857-.838-7.12-3.549-10.064a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
        </ProtocolButton>
      </div>
      {TELEGRAM_BOT_USERNAME ? (
        <div ref={telegramRef} className="flex justify-center sm:justify-start" />
      ) : null}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-700/80" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-3 text-xs uppercase tracking-[0.2em] text-muted">or</span>
        </div>
      </div>
    </div>
  );
}
