'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const authSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  totpCode: z.string().min(6, 'Enter your 6-digit code').optional(),
});

export type AuthFormValues = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (values: AuthFormValues) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  show2FA?: boolean;
}

export function AuthForm({ mode, onSubmit, isLoading, error, show2FA }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="uppercase tracking-[0.2em]">
          {show2FA ? 'Two-factor auth' : mode === 'login' ? 'Login' : 'Sign Up'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {show2FA ? (
            <div>
              <Input placeholder="6-digit code" inputMode="numeric" {...register('totpCode')} />
              {errors.totpCode && (
                <p className="mt-1 text-xs text-red-400">{errors.totpCode.message}</p>
              )}
            </div>
          ) : (
            <>
              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input placeholder="First name" {...register('firstName')} />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Input placeholder="Last name" {...register('lastName')} />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              )}
              <div>
                <Input type="email" placeholder="Email" {...register('email')} />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>
              <div>
                <Input type="password" placeholder="Password" {...register('password')} />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>
            </>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? 'Please wait...'
              : show2FA
                ? 'Verify code'
                : mode === 'login'
                  ? 'Login'
                  : 'Create account'}
          </Button>
          <p className="text-center text-sm text-slate-400">
            {mode === 'login' ? (
              <>
                No account?{' '}
                <Link href="/signup" className="text-cyan-300 hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Have an account?{' '}
                <Link href="/login" className="text-cyan-300 hover:underline">
                  Login
                </Link>
              </>
            )}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
