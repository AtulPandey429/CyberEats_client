import { StatusBadge } from '@/components/StatusBadge';

export default function RewardsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 pb-24">
      <h1 className="mb-2 text-2xl font-bold uppercase tracking-wide text-white">Rewards</h1>
      <p className="mb-6 text-slate-400">$EATS credits and perk redemptions — Day 6.</p>
      <StatusBadge label="Coming Day 6" tone="warning" />
    </div>
  );
}
