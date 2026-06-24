'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Search, UserX, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () => api.get('/users', { params: { page, limit: 15, search: search || undefined } }).then(r => r.data.data),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User deactivated'); },
  });

  const users = data?.data || [];
  const meta = data?.meta;

  const roleColors: Record<string, string> = {
    USER: 'bg-blue-100 text-blue-700', ADMIN: 'bg-purple-100 text-purple-700', SUPER_ADMIN: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground text-sm">All registered users</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500 text-sm" />
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {['User', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
                : users.map((u: any, i: number) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-godavari-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-xs">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[u.role] || 'bg-muted'}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { if (confirm(`Deactivate ${u.name}?`)) deactivate.mutate(u.id); }}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors" title="Deactivate">
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t">
            <button onClick={() => setPage(p => p - 1)} disabled={!meta.hasPrev} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Prev</button>
            <span className="text-sm text-muted-foreground">{meta.page}/{meta.totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={!meta.hasNext} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
