'use client';

import { useLogout, useMe } from '@/features/auth/services/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { WalletLinkButton } from '@/features/auth/components/WalletLinkButton';
import { TwoFactorSetup } from '@/features/auth/components/TwoFactorSetup';

export default function ProfilePage() {
  const { data, isLoading, isError, refetch } = useMe();
  const logout = useLogout();

  if (isLoading) {
    return <LoadingSpinner label="Loading profile..." />;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 pb-24">
        <p className="text-red-300">Please log in to view your profile.</p>
        <Button asChild className="mt-4">
          <a href="/login">Go to login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-white">Profile</h1>
          <p className="text-slate-400">
            {data.firstName} {data.lastName} · {data.email}
          </p>
        </div>
        <StatusBadge label={data.role} tone="info" />
      </div>

      {data.rewards && (
        <div className="rounded-xl border border-cyan-400/20 bg-slate-900/60 p-4">
          <p className="text-sm text-slate-400">Credits balance</p>
          <p className="text-2xl font-bold text-cyan-300">{data.rewards.creditsBalance}</p>
          <p className="text-sm text-slate-500">
            Tier: {data.rewards.tier} · Code: {data.rewards.referralCode}
          </p>
        </div>
      )}

      <WalletLinkButton onLinked={() => refetch()} />

      {data.linkedWallets?.length > 0 && (
        <div className="rounded-xl border border-cyan-400/20 p-4">
          <p className="mb-2 text-sm font-medium text-slate-300">Linked wallets</p>
          {data.linkedWallets.map((wallet: { address: string; provider: string }) => (
            <p key={wallet.address} className="font-mono text-xs text-cyan-300">
              {wallet.provider}: {wallet.address}
            </p>
          ))}
        </div>
      )}

      <TwoFactorSetup />

      <Button variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
        Logout
      </Button>
    </div>
  );
}
