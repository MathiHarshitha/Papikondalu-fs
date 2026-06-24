'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SavedPackagesPage() {
  const qc = useQueryClient();
  const { data: saved = [], isLoading } = useQuery({
    queryKey: ['saved-packages'],
    queryFn: () => api.get('/users/saved-packages').then(r => r.data.data),
  });

  const remove = useMutation({
    mutationFn: (packageId: string) => api.delete(`/users/saved-packages/${packageId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['saved-packages'] }); toast.success('Removed from saved'); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Packages</h1>
        <p className="text-muted-foreground text-sm">Packages you've bookmarked for later</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : saved.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Heart className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p>No saved packages yet.</p>
          <Link href="/packages" className="text-godavari-500 font-medium mt-2 inline-block hover:underline">Explore packages →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((item: any, i: number) => {
            const pkg = item.package;
            const img = pkg?.images?.find((x: any) => x.isPrimary) || pkg?.images?.[0];
            const price = pkg?.discountedPrice || pkg?.price;
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border overflow-hidden group">
                <div className="relative h-40 bg-muted">
                  {img ? <Image src={img.url} alt={pkg.name} fill className="object-cover" /> :
                    <div className="absolute inset-0 bg-gradient-to-br from-godavari-400 to-godavari-700 flex items-center justify-center text-5xl text-white/20">🚤</div>}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-sm mb-1 truncate">{pkg?.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">{pkg?.duration} · {pkg?.startingPoint}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-godavari-600 text-sm">{formatCurrency(Number(price))}</span>
                    <div className="flex gap-2">
                      <button onClick={() => remove.mutate(pkg.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Link href={`/packages/${pkg?.slug}`} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-godavari-500 text-white rounded-lg hover:bg-godavari-600 transition-colors">
                        Book <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
