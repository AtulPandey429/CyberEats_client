'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/providers/ToastProvider';
import { isAuthenticated } from '@/lib/auth';

interface StaffRow {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  roleName: string;
}

interface RoleRow {
  _id: string;
  name: string;
}

export function AdminStaffPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ email: '', firstName: '', lastName: '', roleId: '' });

  const staffQuery = useQuery({
    queryKey: ['admin-staff'],
    queryFn: async () => {
      const { data } = await api.get<{ data: StaffRow[] }>('/admin/staff');
      return data.data;
    },
    enabled: isAuthenticated(),
  });

  const rolesQuery = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const { data } = await api.get<{ data: RoleRow[] }>('/admin/roles');
      return data.data;
    },
    enabled: isAuthenticated(),
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/admin/staff/invite', invite);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
      toast('Staff invited (temp password: Temp@1234)');
      setShowInvite(false);
      setInvite({ email: '', firstName: '', lastName: '', roleId: '' });
    },
    onError: () => toast('Invite failed', 'error'),
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, roleId }: { id: string; roleId: string }) => {
      const { data } = await api.put(`/admin/staff/${id}/role`, { roleId });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
      toast('Role updated');
    },
  });

  if (staffQuery.isLoading) return <LoadingSpinner label="Loading staff..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-foreground">Staff</h1>
          <p className="text-sm text-muted">Platform users and roles</p>
        </div>
        <Button onClick={() => setShowInvite((v) => !v)}>{showInvite ? 'Cancel' : 'Invite user'}</Button>
      </div>

      {showInvite && (
        <form
          className="terminal-panel grid gap-3 rounded-xl p-4 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            inviteMutation.mutate();
          }}
        >
          <Input placeholder="Email" type="email" value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} required />
          <select
            className="rounded-md border border-theme bg-surface px-3 py-2 text-sm text-foreground"
            value={invite.roleId}
            onChange={(e) => setInvite({ ...invite, roleId: e.target.value })}
            required
          >
            <option value="">Select role</option>
            {rolesQuery.data?.map((r) => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
          <Input placeholder="First name" value={invite.firstName} onChange={(e) => setInvite({ ...invite, firstName: e.target.value })} required />
          <Input placeholder="Last name" value={invite.lastName} onChange={(e) => setInvite({ ...invite, lastName: e.target.value })} required />
          <Button type="submit" disabled={inviteMutation.isPending} className="md:col-span-2">
            Send invite
          </Button>
        </form>
      )}

      <div className="overflow-x-auto terminal-panel rounded-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-theme text-muted">
              <th className="p-3 font-medium">User</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {staffQuery.data?.map((u) => (
              <tr key={u._id} className="border-b border-theme">
                <td className="p-3 text-accent">{u.firstName} {u.lastName}</td>
                <td className="p-3 text-muted">{u.email}</td>
                <td className="p-3">
                  <select
                    className="rounded border border-theme bg-surface px-2 py-1 text-xs text-foreground"
                    value={u.roleId}
                    onChange={(e) => roleMutation.mutate({ id: u._id, roleId: e.target.value })}
                  >
                    {rolesQuery.data?.map((r) => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
