'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('PENDING');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', page, status],
    queryFn: () => api.get('/reviews', { params: { page, limit: 15, status } }).then(r => r.data.data),
  });

  const moderate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/reviews/${id}/moderate`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-reviews'] }); toast.success('Review updated'); },
  });

  const reviews = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <p className="text-muted-foreground text-sm">Approve or reject customer reviews</p>
      </div>

      <div className="flex gap-2">
        {['PENDING', 'APPROVED', 'REJECTED'].map(s => (
          <button key={s} onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${status === s ? 'bg-godavari-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />)
          : reviews.length === 0
            ? <div className="text-center py-16 text-muted-foreground">No {status.toLowerCase()} reviews.</div>
            : reviews.map((review: any, i: number) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-godavari-100 flex items-center justify-center text-godavari-600 font-bold text-sm shrink-0">
                      {review.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{review.package?.name} · {formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="font-semibold text-sm">{review.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
                {status === 'PENDING' && (
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => moderate.mutate({ id: review.id, status: 'APPROVED' })}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => moderate.mutate({ id: review.id, status: 'REJECTED' })}
                      className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => p - 1)} disabled={!meta.hasPrev} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Prev</button>
          <span className="text-sm text-muted-foreground">{meta.page}/{meta.totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={!meta.hasNext} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
