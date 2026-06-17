'use client';

import { AuthForm, type AuthFormValues } from '@/features/auth/components/AuthForm';
import { useSignup } from '@/features/auth/services/useAuth';

export default function SignupPage() {
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
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10 pb-24">
      <AuthForm
        mode="signup"
        onSubmit={onSubmit}
        isLoading={signup.isPending}
        error={signup.isError ? 'Signup failed — email may already exist' : null}
      />
    </div>
  );
}
