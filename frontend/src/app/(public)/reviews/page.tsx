'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

const STATIC_REVIEWS = [
  { id: 's1', user: { name: 'Rajesh Kumar' }, rating: 5, title: 'Absolutely breathtaking!', content: 'The boat journey through the gorges was unlike anything I have ever experienced. The guides were knowledgeable and the scenery spectacular.', createdAt: '2025-01-10' },
  { id: 's2', user: { name: 'Priya Sharma' }, rating: 5, title: 'Perfect family trip', content: 'Took my family including kids and elderly parents. The team was very accommodating and everyone had a fantastic time.', createdAt: '2025-01-08' },
  { id: 's3', user: { name: 'Venkat Rao' }, rating: 4, title: 'Great experience overall', content: 'Beautiful scenery and knowledgeable guides. The food at the tribal village was authentic and delicious. Highly recommend!', createdAt: '2025-01-05' },
  { id: 's4', user: { name: 'Anita Reddy' }, rating: 5, title: 'Exceeded expectations', content: 'We booked the overnight package and it was incredible. Sleeping by the Godavari under the stars was a once-in-a-lifetime experience.', createdAt: '2024-12-28' },
  { id: 's5', user: { name: 'Suresh Babu' }, rating: 5, title: 'Best holiday ever', content: 'Highly organized team, great food, and the views are simply stunning. Will definitely come back with more friends.', createdAt: '2024-12-20' },
  { id: 's6', user: { name: 'Meena Iyer' }, rating: 4, title: 'Loved the tribal culture', content: 'The tribal village visit was the highlight. Learning about their traditions and tasting their food was a unique cultural experience.', createdAt: '2024-12-15' },
];

const STATS = {
  avg: 4.8,
  total: 1247,
  breakdown: [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ],
};

export default function ReviewsPage() {
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ['public-reviews', page],
    queryFn: () =>
      api
        .get('/reviews', { params: { page, limit: 6, status: 'APPROVED' } })
        .then((r) => r.data?.data)
        .catch(() => null),
  });

  const apiReviews = data?.data ?? [];
  const allReviews = [...STATIC_REVIEWS, ...apiReviews];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-godavari-800 to-godavari-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Customer Reviews</h1>
          <p className="text-white/70">What our travellers say about their Papikondalu experience</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Overall rating card */}
        <div className="bg-card rounded-2xl border p-8 mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <p className="text-6xl font-bold text-godavari-500">{STATS.avg}</p>
            <div className="flex gap-1 justify-center my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(STATS.avg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-muted-foreground text-sm">{STATS.total.toLocaleString()} reviews</p>
          </div>
          <div className="flex-1 w-full space-y-2">
            {STATS.breakdown.map(({ stars, pct }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm w-4 text-right">{stars}</span>
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-8">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allReviews.map((review: any, i: number) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-godavari-500 flex items-center justify-center text-white font-bold text-sm">
                    {review.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="font-semibold text-sm">{review.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Pagination for API results */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm rounded-xl border disabled:opacity-40 hover:bg-muted transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm rounded-xl border disabled:opacity-40 hover:bg-muted transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
