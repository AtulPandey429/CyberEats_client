'use client';

import { useState } from 'react';
import { AuthForm, type AuthFormValues } from '@/features/auth/components/AuthForm';
import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButtons';
import { useLogin, useTwoFactorLogin } from '@/features/auth/services/useAuth';

export default function LoginPage() {
  const login = useLogin();
  const twoFactorLogin = useTwoFactorLogin();
  const [tempToken, setTempToken] = useState<string | null>(null);

  const onSubmit = async (values: AuthFormValues) => {
    if (tempToken) {
      await twoFactorLogin.mutateAsync({
        tempToken,
        totpCode: values.totpCode ?? '',
      });
      return;
    }

    const result = await login.mutateAsync({
      email: values.email,
      password: values.password,
    });

    if ('requires2FA' in result) {
      setTempToken(result.tempToken);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-10 pb-24">
      {!tempToken && <SocialLoginButtons />}
      <AuthForm
        mode="login"
        show2FA={Boolean(tempToken)}
        onSubmit={onSubmit}
        isLoading={login.isPending || twoFactorLogin.isPending}
        error={
          login.isError || twoFactorLogin.isError ? 'Invalid email, password, or 2FA code' : null
        }
      />
    </div>
  );
}
