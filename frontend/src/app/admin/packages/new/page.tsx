'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Plus, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import api from '@/lib/api';

const schema = z.object({
  name: z.string().min(3, 'Min 3 chars'),
  category: z.string().min(1, 'Required'),
  description: z.string().min(20, 'Min 20 chars'),
  shortDescription: z.string().min(10).max(200),
  duration: z.string().min(1, 'Required'),
  durationDays: z.coerce.number().min(1),
  durationNights: z.coerce.number().min(0),
  startingPoint: z.string().min(1, 'Required'),
  endingPoint: z.string().min(1, 'Required'),
  price: z.coerce.number().min(1, 'Required'),
  discountedPrice: z.coerce.number().optional(),
  capacity: z.coerce.number().min(1, 'Required'),
  cancellationPolicy: z.string().min(10, 'Required'),
  meetingPoint: z.string().optional(),
  status: z.string().default('DRAFT'),
  isFeatured: z.boolean().default(false),
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

export default function NewPackagePage() {
  const router = useRouter();
  const [included, setIncluded] = useState(['']);
  const [excluded, setExcluded] = useState(['']);
  const [highlights, setHighlights] = useState(['']);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'DRAFT', isFeatured: false, durationNights: 0 },
  });

  const create = useMutation({
    mutationFn: (data: any) => api.post('/packages', data).then(r => r.data.data),
    onSuccess: () => { toast.success('Package created!'); router.push('/admin/packages'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create'),
  });

  const onSubmit = (data: Form) => {
    create.mutate({
      ...data,
      includedServices: included.filter(Boolean),
      excludedServices: excluded.filter(Boolean),
      highlights: highlights.filter(Boolean),
      itinerary: [],
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/packages" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">New Package</h1>
          <p className="text-muted-foreground text-sm">Create a new tour package</p>
        </div>
      </div>

      <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
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
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
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
              <label className="text-sm font-medium block mb-1.5">Short Description * (max 200 chars)</label>
              <input {...register('shortDescription')} maxLength={200} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
              {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium block mb-1.5">Full Description *</label>
              <textarea {...register('description')} rows={4} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500 resize-none" />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Duration & Route */}
        <div className="bg-card rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold">Duration & Route</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([
              { name: 'duration', label: 'Duration Label', placeholder: 'e.g. 1 Day' },
              { name: 'durationDays', label: 'Days', placeholder: '1' },
              { name: 'durationNights', label: 'Nights', placeholder: '0' },
              { name: 'startingPoint', label: 'Starting Point', placeholder: 'Rajahmundry' },
              { name: 'endingPoint', label: 'Ending Point', placeholder: 'Papikondalu' },
              { name: 'meetingPoint', label: 'Meeting Point (optional)', placeholder: 'Boat Ghat...' },
            ] as const).map(f => (
              <div key={f.name}>
                <label className="text-sm font-medium block mb-1.5">{f.label}</label>
                <input {...register(f.name as any)} placeholder={f.placeholder} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div className="bg-card rounded-2xl border p-6 space-y-4">
          <h2 className="font-semibold">Pricing & Capacity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Price (₹) *</label>
              <input {...register('price')} type="number" min="0" className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Discounted Price (₹)</label>
              <input {...register('discountedPrice')} type="number" min="0" className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Capacity (seats) *</label>
              <input {...register('capacity')} type="number" min="1" className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input {...register('isFeatured')} type="checkbox" id="featured" className="w-4 h-4 accent-godavari-500" />
            <label htmlFor="featured" className="text-sm font-medium cursor-pointer">Mark as Featured</label>
          </div>
        </div>

        {/* Services & Highlights */}
        <div className="bg-card rounded-2xl border p-6 space-y-5">
          <h2 className="font-semibold">Services & Highlights</h2>
          <ListField label="Included Services" items={included} setItems={setIncluded} />
          <ListField label="Excluded Services" items={excluded} setItems={setExcluded} />
          <ListField label="Highlights" items={highlights} setItems={setHighlights} />
        </div>

        {/* Cancellation Policy */}
        <div className="bg-card rounded-2xl border p-6 space-y-3">
          <h2 className="font-semibold">Cancellation Policy *</h2>
          <textarea {...register('cancellationPolicy')} rows={3} placeholder="e.g. 100% refund if cancelled 48+ hours before departure..." className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500 resize-none" />
          {errors.cancellationPolicy && <p className="text-red-500 text-xs mt-1">{errors.cancellationPolicy.message}</p>}
        </div>

        <div className="flex gap-3 pb-6">
          <button type="submit" disabled={create.isPending} className="flex items-center gap-2 px-6 py-3 bg-godavari-500 text-white rounded-xl font-semibold hover:bg-godavari-600 transition-colors disabled:opacity-60">
            {create.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Package
          </button>
          <Link href="/admin/packages" className="px-6 py-3 border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
            Cancel
          </Link>
        </div>
      </motion.form>
    </div>
  );
}
