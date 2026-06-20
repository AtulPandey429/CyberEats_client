'use client';

import { Suspense } from 'react';
import { AuthForm, type AuthFormValues } from '@/features/auth/components/AuthForm';
import { SocialLoginButtons } from '@/features/auth/components/SocialLoginButtons';
import { useSignup } from '@/features/auth/services/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageShell } from '@/components/layout/PageShell';
import { SystemStatusBar } from '@/components/layout/SystemStatusBar';

function SignupForm() {
  const signup = useSignup();

  const onSubmit = async (values: AuthFormValues) => {
    await signup.mutateAsync({
      email: values.email,
      password: values.password,
      firstName: values.firstName ?? 'User',
      lastName: values.lastName ?? 'Cyber',
    });
  };

  return (
    <div className="terminal-panel animate-fade-in-up-delay-2 space-y-6 rounded-2xl p-6 md:p-8">
      <SocialLoginButtons />
      <AuthForm
        mode="signup"
        onSubmit={onSubmit}
        isLoading={signup.isPending}
        error={signup.isError ? 'Signup failed — email may already exist' : null}
      />
    </div>
  );
}

export default function SignupPage() {
  return (
    <PageShell compact>
      <div className="mx-auto w-full max-w-md space-y-8">
        <PageHeader
          className="animate-fade-in-up mb-0"
          status="Status: Terminal Open"
          title="Register Operator"
          subtitle="Create credentials to join the CyberEats delivery grid."
        />
        <Suspense fallback={<LoadingSpinner label="Loading signup..." />}>
          <SignupForm />
        </Suspense>
        <div className="animate-fade-in-up-delay-2">
          <SystemStatusBar />
        </div>
      </div>
    </PageShell>
  );
}
