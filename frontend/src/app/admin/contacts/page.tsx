'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminContactsPage() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', page],
    queryFn: () => api.get('/contact', { params: { page, limit: 15 } }).then(r => r.data.data),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.patch(`/contact/${id}/read`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-contacts'] }); toast.success('Marked as read'); },
  });

  const messages = data?.data || [];
  const meta = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground text-sm">Customer inquiries and messages</p>
      </div>

      <div className="space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)
          : messages.length === 0
            ? <div className="text-center py-16 text-muted-foreground">No messages yet.</div>
            : messages.map((msg: any, i: number) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`bg-card rounded-2xl border p-5 space-y-3 transition-all ${!msg.isRead ? 'border-godavari-200 dark:border-godavari-800' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${!msg.isRead ? 'bg-godavari-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                      {msg.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{msg.name}</p>
                        {!msg.isRead && <span className="w-2 h-2 rounded-full bg-godavari-500 inline-block" />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{msg.email}</span>
                        {msg.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{msg.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
                    {!msg.isRead && (
                      <button onClick={() => markRead.mutate(msg.id)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 border rounded-lg hover:bg-muted transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Read
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm text-godavari-600 mb-1">{msg.subject}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                </div>
              </motion.div>
            ))}
      </div>

      {meta && meta.total > 15 && (
        <div className="flex justify-center items-center gap-2">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Prev</button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={messages.length < 15} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
