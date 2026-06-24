'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

const schema = z.object({
  name: z.string().min(3),
  category: z.string().min(1),
  description: z.string().min(20),
  shortDescription: z.string().min(10).max(200),
  duration: z.string().min(1),
  durationDays: z.coerce.number().min(1),
  durationNights: z.coerce.number().min(0),
  startingPoint: z.string().min(1),
  endingPoint: z.string().min(1),
  price: z.coerce.number().min(1),
  discountedPrice: z.coerce.number().optional(),
  capacity: z.coerce.number().min(1),
  cancellationPolicy: z.string().min(10),
  meetingPoint: z.string().optional(),
  status: z.string(),
  isFeatured: z.boolean(),
});
type Form = z.infer<typeof schema>;

const CATEGORIES = ['BOAT_TOUR','ADVENTURE','FAMILY','HONEYMOON','GROUP','CORPORATE','WEEKEND','OVERNIGHT'];

function ListField({ label, items, setItems }: { label: string; items: string[]; setItems: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <button type="button" onClick={() => setItems([...items, ''])} className="text-xs text-godavari-500 flex items-center gap-1 hover:underline">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={e => { const u = [...items]; u[i] = e.target.value; setItems(u); }}
            placeholder={`${label} ${i + 1}`}
            className="flex-1 px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500"
          />
          {items.length > 1 && (
            <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default function EditPackagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [included, setIncluded] = useState(['']);
  const [excluded, setExcluded] = useState(['']);
  const [highlights, setHighlights] = useState(['']);

  const { data: pkg, isLoading } = useQuery({
    queryKey: ['package-edit', params.id],
    queryFn: () => api.get(`/packages/${params.id}`).then(r => r.data.data),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (pkg) {
      reset({
        name: pkg.name,
        category: pkg.category,
        description: pkg.description,
        shortDescription: pkg.shortDescription,
        duration: pkg.duration,
        durationDays: pkg.durationDays,
        durationNights: pkg.durationNights,
        startingPoint: pkg.startingPoint,
        endingPoint: pkg.endingPoint,
        price: Number(pkg.price),
        discountedPrice: pkg.discountedPrice ? Number(pkg.discountedPrice) : undefined,
        capacity: pkg.capacity,
        cancellationPolicy: pkg.cancellationPolicy,
        meetingPoint: pkg.meetingPoint || '',
        status: pkg.status,
        isFeatured: pkg.isFeatured,
      });
      setIncluded(pkg.includedServices?.length ? pkg.includedServices : ['']);
      setExcluded(pkg.excludedServices?.length ? pkg.excludedServices : ['']);
      setHighlights(pkg.highlights?.length ? pkg.highlights : ['']);
    }
  }, [pkg, reset]);

  const update = useMutation({
    mutationFn: (data: any) => api.patch(`/packages/${params.id}`, data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-packages'] });
      toast.success('Package updated!');
      router.push('/admin/packages');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Update failed'),
  });

  const onSubmit = (data: Form) => {
    update.mutate({
      ...data,
      includedServices: included.filter(Boolean),
      excludedServices: excluded.filter(Boolean),
      highlights: highlights.filter(Boolean),
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-godavari-500" />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/packages" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Package</h1>
          <p className="text-muted-foreground text-sm truncate max-w-xs">{pkg?.name}</p>
        </div>
      </div>

      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-card rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium block mb-1.5">Package Name *</label>
              <input {...register('name')} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Category *</label>
              <select {...register('category')} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Status</label>
              <select {...register('status')} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500">
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium block mb-1.5">Short Description *</label>
              <input {...register('shortDescription')} maxLength={200} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium block mb-1.5">Full Description *</label>
              <textarea {...register('description')} rows={4} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500 resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold">Duration & Route</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([
              { name: 'duration', label: 'Duration Label' },
              { name: 'durationDays', label: 'Days' },
              { name: 'durationNights', label: 'Nights' },
              { name: 'startingPoint', label: 'Starting Point' },
              { name: 'endingPoint', label: 'Ending Point' },
              { name: 'meetingPoint', label: 'Meeting Point' },
            ] as const).map(f => (
              <div key={f.name}>
                <label className="text-sm font-medium block mb-1.5">{f.label}</label>
                <input {...register(f.name as any)} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold">Pricing & Capacity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([
              { name: 'price', label: 'Price (₹)' },
              { name: 'discountedPrice', label: 'Discounted Price (₹)' },
              { name: 'capacity', label: 'Capacity' },
            ] as const).map(f => (
              <div key={f.name}>
                <label className="text-sm font-medium block mb-1.5">{f.label}</label>
                <input {...register(f.name as any)} type="number" min="0" className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input {...register('isFeatured')} type="checkbox" id="featured" className="w-4 h-4 accent-godavari-500" />
            <label htmlFor="featured" className="text-sm font-medium cursor-pointer">Mark as Featured</label>
          </div>
        </div>

        <div className="bg-card rounded-2xl border p-6 space-y-5">
          <h2 className="font-semibold">Services & Highlights</h2>
          <ListField label="Included Services" items={included} setItems={setIncluded} />
          <ListField label="Excluded Services" items={excluded} setItems={setExcluded} />
          <ListField label="Highlights" items={highlights} setItems={setHighlights} />
        </div>

        <div className="bg-card rounded-2xl border p-6 space-y-3">
          <h2 className="font-semibold">Cancellation Policy *</h2>
          <textarea {...register('cancellationPolicy')} rows={3} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500 resize-none" />
        </div>

        <div className="flex gap-3 pb-6">
          <button type="submit" disabled={update.isPending} className="flex items-center gap-2 px-6 py-3 bg-godavari-500 text-white rounded-xl font-semibold hover:bg-godavari-600 transition-colors disabled:opacity-60">
            {update.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
          <Link href="/admin/packages" className="px-6 py-3 border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
            Cancel
          </Link>
        </div>
      </motion.form>
    </div>
  );
}
