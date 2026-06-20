'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="section-label text-muted" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {show2FA ? (
        <Field label="Verification code" htmlFor="totpCode" error={errors.totpCode?.message}>
          <Input id="totpCode" placeholder="6-digit code" inputMode="numeric" {...register('totpCode')} />
        </Field>
      ) : (
        <>
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Given name" htmlFor="firstName" error={errors.firstName?.message}>
                <Input id="firstName" placeholder="First name" {...register('firstName')} />
              </Field>
              <Field label="Surname" htmlFor="lastName" error={errors.lastName?.message}>
                <Input id="lastName" placeholder="Last name" {...register('lastName')} />
              </Field>
            </div>
          )}
          <Field label="Identity token" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" placeholder="operator@cybereats.io" {...register('email')} />
          </Field>
          <Field label="Access key" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
          </Field>
        </>
      )}
      {error && (
        <p className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        className={cn('w-full transition-all duration-300 hover:cyber-glow', isLoading && 'opacity-80')}
        disabled={isLoading}
      >
        {isLoading
          ? 'Please wait...'
          : show2FA
            ? 'Verify code'
            : mode === 'login'
              ? 'Initialize Session'
              : 'Create operator'}
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
        {mode === 'login' ? (
          <>
            <Link href="/signup" className="text-accent transition-colors hover:text-accent hover:underline">
              Register Operator
            </Link>
            <span className="text-muted">·</span>
            <span className="text-muted">Forgot Key?</span>
          </>
        ) : (
          <Link href="/login" className="text-accent transition-colors hover:text-accent hover:underline">
            Back to Secure Terminal
          </Link>
        )}
      </div>
    </form>
  );
}
