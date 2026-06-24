'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

const statusColors: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-700', FAILED: 'bg-red-100 text-red-700',
  PENDING: 'bg-yellow-100 text-yellow-700', REFUNDED: 'bg-blue-100 text-blue-700',
};

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', page],
    queryFn: () => api.get('/bookings', { params: { page, limit: 20 } }).then(r => r.data.data),
  });

  const bookings = (data?.data || []).filter((b: any) => b.payment);
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground text-sm">All transaction records</p>
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {['Booking #', 'Customer', 'Package', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>
                ))
                : bookings.map((b: any, i: number) => (
                  <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{b.bookingNumber}</td>
                    <td className="px-4 py-3 text-xs">{b.user?.name}</td>
                    <td className="px-4 py-3 max-w-[140px] truncate text-xs">{b.package?.name}</td>
                    <td className="px-4 py-3 font-medium text-xs">{formatCurrency(Number(b.payment?.amount))}</td>
                    <td className="px-4 py-3 text-xs capitalize">{b.payment?.method || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.payment?.status] || 'bg-muted'}`}>
                        {b.payment?.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{b.payment?.paidAt ? formatDate(b.payment.paidAt) : '—'}</td>
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
