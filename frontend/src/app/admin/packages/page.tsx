'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, ToggleLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminPackagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-packages', page, search],
    queryFn: () => api.get('/packages', { params: { page, limit: 10, search: search || undefined, status: undefined } }).then(r => r.data.data),
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/packages/${id}`, { status: status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-packages'] }); toast.success('Status updated'); },
  });

  const deletePackage = useMutation({
    mutationFn: (id: string) => api.delete(`/packages/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-packages'] }); toast.success('Package deactivated'); },
  });

  const packages = data?.data || [];
  const meta = data?.meta;

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700', INACTIVE: 'bg-red-100 text-red-700', DRAFT: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Package Management</h1>
          <p className="text-muted-foreground text-sm">Manage all tour packages</p>
        </div>
        <Link href="/admin/packages/new"
          className="flex items-center gap-2 px-4 py-2 bg-godavari-500 text-white rounded-xl text-sm font-medium hover:bg-godavari-600 transition-colors">
          <Plus className="w-4 h-4" /> New Package
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search packages..."
          className="w-full pl-9 pr-4 py-2.5 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500 text-sm" />
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {['Package', 'Category', 'Price', 'Seats', 'Status', 'Rating', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
                : packages.map((pkg: any, i: number) => (
                  <motion.tr key={pkg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium truncate max-w-[180px]">{pkg.name}</p>
                      <p className="text-xs text-muted-foreground">{pkg.duration}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{pkg.category.replace('_', ' ')}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(Number(pkg.discountedPrice || pkg.price))}</td>
                    <td className="px-4 py-3">{pkg.availableSeats}/{pkg.capacity}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[pkg.status] || 'bg-muted'}`}>{pkg.status}</span>
                    </td>
                    <td className="px-4 py-3">{pkg.avgRating > 0 ? `⭐ ${pkg.avgRating.toFixed(1)}` : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/packages/${pkg.slug}`} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link href={`/admin/packages/${pkg.id}/edit`} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => { if (confirm('Deactivate?')) deletePackage.mutate(pkg.id); }}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
