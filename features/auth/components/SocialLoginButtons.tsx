'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { setAuthTokens } from '@/lib/auth';
import { isFirebaseClientConfigured, signInWithGoogleViaFirebase, getFirebaseAuthErrorMessage } from '@/lib/firebase';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/sessionSlice';
import { useToast } from '@/providers/ToastProvider';

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

function SocialButton({
  label,
  onClick,
  className,
  disabled,
}: {
  label: string;
  onClick: () => void;
  className: string;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}

export function SocialLoginButtons() {
  const router = useRouter();
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
      toast('Logged in with Google');
      router.push('/');
    },
    [dispatch, router, toast],
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
        toast(getFirebaseAuthErrorMessage(error), 'error');
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
        toast('Logged in with Telegram');
        router.push('/');
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
    <div className="mx-auto w-full max-w-md space-y-3">
      <SocialButton
        label={googleLoading ? 'Signing in with Google...' : 'Continue with Google'}
        onClick={handleGoogleLogin}
        className="border-slate-600 hover:border-cyan-400/50"
        disabled={googleLoading}
      />
      <SocialButton
        label="Continue with Facebook"
        onClick={() => startOAuth('facebook')}
        className="border-slate-600 hover:border-blue-400/50"
      />
      <SocialButton
        label="Continue with Discord"
        onClick={() => startOAuth('discord')}
        className="border-slate-600 hover:border-indigo-400/50"
      />
      {TELEGRAM_BOT_USERNAME ? (
        <div ref={telegramRef} className="flex justify-center pt-1" />
      ) : null}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-slate-950 px-2 text-slate-500">or continue with email</span>
        </div>
      </div>
    </div>
  );
}
