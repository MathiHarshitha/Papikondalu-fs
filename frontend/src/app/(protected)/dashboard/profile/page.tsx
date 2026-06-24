'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import { useProfile } from '@/hooks/useAuth';
import api from '@/lib/api';

const schema = z.object({
  name: z.string().min(2, 'Min 2 chars'),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});
type Form = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { data: profile } = useProfile();
  const qc = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<Form>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (profile) reset({
      name: profile.name || '',
      phone: profile.phone || '',
      gender: profile.gender || '',
      dateOfBirth: profile.dateOfBirth?.split('T')[0] || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      pincode: profile.pincode || '',
    });
  }, [profile, reset]);

  const update = useMutation({
    mutationFn: (data: Form) => api.patch('/users/profile', data).then(r => r.data.data),
    onSuccess: (data) => { setUser(data); qc.invalidateQueries({ queryKey: ['profile'] }); toast.success('Profile updated'); },
    onError: () => toast.error('Update failed'),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your personal information</p>
      </div>

      <div className="bg-card rounded-2xl border p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-godavari-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${user?.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {user?.isEmailVerified ? 'Email Verified' : 'Email Unverified'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(d => update.mutate(d))} className="bg-card rounded-2xl border p-6 space-y-5">
        <h2 className="font-semibold">Personal Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'name' as const, label: 'Full Name', type: 'text', span: 2 },
            { name: 'phone' as const, label: 'Phone', type: 'tel', span: 1 },
            { name: 'gender' as const, label: 'Gender', type: 'select', span: 1, options: ['Male', 'Female', 'Other'] },
            { name: 'dateOfBirth' as const, label: 'Date of Birth', type: 'date', span: 1 },
            { name: 'address' as const, label: 'Address', type: 'text', span: 2 },
            { name: 'city' as const, label: 'City', type: 'text', span: 1 },
            { name: 'state' as const, label: 'State', type: 'text', span: 1 },
            { name: 'pincode' as const, label: 'Pincode', type: 'text', span: 1 },
          ].map(({ name, label, type, span, options }) => (
            <div key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
              <label className="text-sm font-medium block mb-1.5">{label}</label>
              {type === 'select' ? (
                <select {...register(name)} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500">
                  <option value="">Select</option>
                  {options?.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input {...register(name)} type={type} className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
              )}
              {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
            </div>
          ))}
        </div>
        <button type="submit" disabled={!isDirty || update.isPending} className="flex items-center gap-2 px-6 py-2.5 bg-godavari-500 text-white rounded-xl text-sm font-medium hover:bg-godavari-600 disabled:opacity-50 transition-colors">
          {update.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </form>
    </div>
  );
}
