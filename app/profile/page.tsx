'use client';



import { useLogout, useMe } from '@/features/auth/services/useAuth';
import Link from 'next/link';
import { Terminal, Store } from 'lucide-react';

import { LoadingSpinner } from '@/components/LoadingSpinner';

import { StatusBadge } from '@/components/StatusBadge';

import { Button } from '@/components/ui/button';

import { PageHeader } from '@/components/layout/PageHeader';

import { PageShell } from '@/components/layout/PageShell';

import { WalletLinkButton } from '@/features/auth/components/WalletLinkButton';

import { TwoFactorSetup } from '@/features/auth/components/TwoFactorSetup';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/providers/ThemeProvider';

import { RequireAuth } from '@/components/RequireAuth';



export default function ProfilePage() {

  return (

    <RequireAuth>

      <ProfileContent />

    </RequireAuth>

  );

}



function ProfileContent() {

  const { data, isLoading, isError, refetch } = useMe();
  const { theme } = useTheme();

  const logout = useLogout();



  if (isLoading) {

    return (

      <PageShell>

        <LoadingSpinner label="Loading profile..." />

      </PageShell>

    );

  }



  if (isError || !data) {

    return (

      <PageShell>

        <p className="text-red-300">Please log in to view your profile.</p>

        <Button asChild className="mt-4">

          <a href="/login">Go to login</a>

        </Button>

      </PageShell>

    );

  }



  return (

    <PageShell>

      <PageHeader

        status="Operator dossier"

        title="Profile"

        subtitle={`${data.firstName} ${data.lastName} · ${data.email}`}

        actions={<StatusBadge label={data.role} tone="info" />}

      />



      <div className="space-y-6">

        {data.rewards && (

          <div className="terminal-panel rounded-xl p-5">

            <p className="section-label mb-2">Credits balance</p>

            <p className="text-3xl font-bold text-accent">{data.rewards.creditsBalance}</p>

            <p className="mt-1 text-sm text-muted">

              Tier: {data.rewards.tier} · Code: {data.rewards.referralCode}

            </p>

          </div>

        )}



        <WalletLinkButton onLinked={() => refetch()} />

        <div className="terminal-panel flex items-center justify-between rounded-xl p-5">
          <div>
            <p className="section-label mb-1">Appearance</p>
            <p className="text-sm text-muted">
              {theme === 'dark' ? 'Dark mode' : 'Light mode'} active
            </p>
          </div>
          <ThemeToggle showLabel />
        </div>

        {data.linkedWallets?.length > 0 && (

          <div className="terminal-panel rounded-xl p-5">

            <p className="section-label mb-3">Linked wallets</p>

            {data.linkedWallets.map((wallet: { address: string; provider: string }) => (

              <p key={wallet.address} className="font-mono text-xs text-accent">

                {wallet.provider}: {wallet.address}

              </p>

            ))}

          </div>

        )}



        <TwoFactorSetup />



        {data.role === 'FULL_ACCESS' && (
          <Link
            href="/terminal"
            className="terminal-panel flex items-center gap-3 rounded-xl p-5 transition-colors hover:border-theme-strong"
          >
            <Terminal className="h-5 w-5 text-accent" aria-hidden />
            <div>
              <p className="section-label text-accent">Admin terminal</p>
              <p className="text-sm text-muted">Analytics, restaurants, staff, and logistics</p>
            </div>
          </Link>
        )}

        {(data.role === 'MERCHANT' || data.role === 'CO_ADMIN') && (
          <Link
            href="/dashboard"
            className="terminal-panel flex items-center gap-3 rounded-xl p-5 transition-colors hover:border-theme-strong"
          >
            <Store className="h-5 w-5 text-accent" aria-hidden />
            <div>
              <p className="section-label text-accent">Merchant hub</p>
              <p className="text-sm text-muted">Orders, menu, and restaurant settings</p>
            </div>
          </Link>
        )}



        <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>

          Logout

        </Button>

      </div>

    </PageShell>

  );

}


