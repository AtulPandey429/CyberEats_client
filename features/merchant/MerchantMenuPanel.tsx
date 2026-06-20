'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/providers/ToastProvider';
import { isAuthenticated } from '@/lib/auth';
import { formatUsd } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';

interface MenuItemRow {
  _id: string;
  name: string;
  description: string;
  priceUsd: number;
  categories: string[];
  isAvailable: boolean;
}

export function MerchantMenuPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    priceUsd: '',
    categories: '',
  });

  const menuQuery = useQuery({
    queryKey: ['merchant-menu'],
    queryFn: async () => {
      const { data } = await api.get<{ data: MenuItemRow[] }>('/merchant/menu-items');
      return data.data;
    },
    enabled: isAuthenticated(),
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/merchant/menu-items', {
        name: form.name,
        description: form.description,
        priceUsd: Number(form.priceUsd),
        categories: form.categories.split(',').map((c) => c.trim()).filter(Boolean),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-menu'] });
      toast('Dish added');
      setShowForm(false);
      setForm({ name: '', description: '', priceUsd: '', categories: '' });
    },
    onError: () => toast('Failed to add dish', 'error'),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
      const { data } = await api.put(`/merchant/menu-items/${id}`, { isAvailable });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-menu'] });
      toast('Menu updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/merchant/menu-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-menu'] });
      toast('Dish removed');
    },
  });

  if (menuQuery.isLoading) return <LoadingSpinner label="Loading menu..." />;

  if (menuQuery.isError) {
    return <p className="text-red-300">Unable to load menu. Contact admin to link your restaurant.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Menu</h1>
          <p className="text-sm text-muted">Add and manage dishes for your restaurant</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? 'Cancel' : 'Add dish'}</Button>
      </div>

      {showForm && (
        <form
          className="terminal-panel grid gap-3 rounded-xl p-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <Input placeholder="Dish name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="Price USD" type="number" step="0.01" value={form.priceUsd} onChange={(e) => setForm({ ...form, priceUsd: e.target.value })} required />
          <Input placeholder="Categories (comma-separated)" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} required />
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <Button type="submit" disabled={createMutation.isPending} className="md:col-span-2">
            Save dish
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {menuQuery.data?.map((item) => (
          <div key={item._id} className="terminal-panel flex flex-wrap items-center justify-between gap-3 rounded-xl p-4">
            <div>
              <p className="font-semibold text-accent">{item.name}</p>
              <p className="text-xs text-muted">{item.description}</p>
              <p className="mt-1 text-sm text-accent">{formatUsd(item.priceUsd)}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge label={item.isAvailable ? 'Available' : 'Hidden'} tone={item.isAvailable ? 'success' : 'warning'} />
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleMutation.mutate({ id: item._id, isAvailable: !item.isAvailable })}
              >
                {item.isAvailable ? 'Hide' : 'Show'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(item._id)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
        {menuQuery.data?.length === 0 && <p className="text-muted">No dishes yet. Add your first item.</p>}
      </div>
    </div>
  );
}
