'use client';

import { Suspense, useState } from 'react';
import { AuthForm, type AuthFormValues } from '@/features/auth/components/AuthForm';
import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButtons';
import { useLogin, useTwoFactorLogin } from '@/features/auth/services/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageShell } from '@/components/layout/PageShell';
import { SystemStatusBar } from '@/components/layout/SystemStatusBar';

function LoginForm() {
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
    <div className="terminal-panel animate-fade-in-up-delay-2 space-y-6 rounded-2xl p-6 md:p-8">
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

export default function LoginPage() {
  return (
    <PageShell compact>
      <div className="mx-auto w-full max-w-md space-y-8">
        <PageHeader
          className="animate-fade-in-up mb-0"
          status="Status: Terminal Secure"
          title="Secure Terminal"
          subtitle="Authorize session to access neural delivery network."
        />
        <Suspense fallback={<LoadingSpinner label="Loading login..." />}>
          <LoginForm />
        </Suspense>
        <div className="animate-fade-in-up-delay-2">
          <SystemStatusBar />
        </div>
      </div>
    </PageShell>
  );
}
