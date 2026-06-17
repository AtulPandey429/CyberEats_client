import { StatusBadge } from '@/components/StatusBadge';

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 pb-24">
      <h1 className="mb-2 text-2xl font-bold uppercase tracking-wide text-white">Orders</h1>
      <p className="mb-6 text-slate-400">Track your drone deliveries — Day 5.</p>
      <StatusBadge label="Coming Day 5" tone="warning" />
    </div>
  );
}
