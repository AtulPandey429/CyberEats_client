'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/providers/ToastProvider';
import { isAuthenticated } from '@/lib/auth';
import { StatusBadge } from '@/components/StatusBadge';

interface RestaurantRow {
  _id: string;
  name: string;
  slug: string;
  sector: string;
  isOpen: boolean;
  menuItemCount: number;
  staff: Array<{
    role: string;
    user: { email: string; firstName: string; lastName: string };
  }>;
}

export function AdminRestaurantsPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    categories: '',
    sector: 'NEO-TOKYO SECTOR 7',
    prepTimeMin: '15',
    prepTimeMax: '30',
  });
  const [assignForm, setAssignForm] = useState({ email: '', firstName: '', lastName: '' });

  const restaurantsQuery = useQuery({
    queryKey: ['admin-restaurants'],
    queryFn: async () => {
      const { data } = await api.get<{ data: RestaurantRow[] }>('/admin/restaurants');
      return data.data;
    },
    enabled: isAuthenticated(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/admin/restaurants', {
        name: form.name,
        description: form.description,
        categories: form.categories.split(',').map((c) => c.trim()).filter(Boolean),
        sector: form.sector,
        prepTimeMin: Number(form.prepTimeMin),
        prepTimeMax: Number(form.prepTimeMax),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      toast('Restaurant created');
      setShowForm(false);
      setForm({ name: '', description: '', categories: '', sector: 'NEO-TOKYO SECTOR 7', prepTimeMin: '15', prepTimeMax: '30' });
    },
    onError: () => toast('Failed to create restaurant', 'error'),
  });

  const toggleOpenMutation = useMutation({
    mutationFn: async ({ id, isOpen }: { id: string; isOpen: boolean }) => {
      const { data } = await api.put(`/admin/restaurants/${id}`, { isOpen });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      toast('Restaurant updated');
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (restaurantId: string) => {
      const { data } = await api.post(`/admin/restaurants/${restaurantId}/assign-merchant`, assignForm);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      toast('Merchant assigned (temp password: Temp@1234 for new users)');
      setAssignId(null);
      setAssignForm({ email: '', firstName: '', lastName: '' });
    },
    onError: () => toast('Failed to assign merchant', 'error'),
  });

  if (restaurantsQuery.isLoading) return <LoadingSpinner label="Loading restaurants..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Restaurants</h1>
          <p className="text-sm text-muted">Create venues and assign merchants</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cancel' : 'Add restaurant'}</Button>
      </div>

      {showForm && (
        <form
          className="terminal-panel grid gap-3 rounded-xl p-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="Categories (comma-separated)" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} required />
          <Input placeholder="Sector" value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} required />
          <Input placeholder="Prep min (mins)" type="number" value={form.prepTimeMin} onChange={(e) => setForm({ ...form, prepTimeMin: e.target.value })} required />
          <Input placeholder="Prep max (mins)" type="number" value={form.prepTimeMax} onChange={(e) => setForm({ ...form, prepTimeMax: e.target.value })} required />
          <Input className="md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <Button type="submit" disabled={createMutation.isPending} className="md:col-span-2">
            Create restaurant
          </Button>
        </form>
      )}

      <div className="space-y-3">
        {restaurantsQuery.data?.map((r) => (
          <div key={r._id} className="terminal-panel rounded-xl p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-accent">{r.name}</h2>
                <p className="text-xs text-muted">/{r.slug} · {r.sector}</p>
                <p className="mt-1 text-xs text-muted">{r.menuItemCount} menu items</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={r.isOpen ? 'Open' : 'Closed'} tone={r.isOpen ? 'success' : 'warning'} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleOpenMutation.mutate({ id: r._id, isOpen: !r.isOpen })}
                >
                  {r.isOpen ? 'Close' : 'Open'}
                </Button>
                <Button size="sm" onClick={() => setAssignId(assignId === r._id ? null : r._id)}>
                  Assign merchant
                </Button>
              </div>
            </div>

            {r.staff.length > 0 && (
              <ul className="mt-3 space-y-1 border-t border-theme pt-3 text-xs text-muted">
                {r.staff.map((s, i) => (
                  <li key={i}>
                    {s.user.firstName} {s.user.lastName} ({s.user.email}) — {s.role}
                  </li>
                ))}
              </ul>
            )}

            {assignId === r._id && (
              <form
                className="mt-3 grid gap-2 border-t border-theme pt-3 md:grid-cols-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  assignMutation.mutate(r._id);
                }}
              >
                <Input placeholder="Merchant email" type="email" value={assignForm.email} onChange={(e) => setAssignForm({ ...assignForm, email: e.target.value })} required />
                <Input placeholder="First name" value={assignForm.firstName} onChange={(e) => setAssignForm({ ...assignForm, firstName: e.target.value })} />
                <Input placeholder="Last name" value={assignForm.lastName} onChange={(e) => setAssignForm({ ...assignForm, lastName: e.target.value })} />
                <Button type="submit" size="sm" disabled={assignMutation.isPending} className="md:col-span-3">
                  Assign as OWNER
                </Button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
