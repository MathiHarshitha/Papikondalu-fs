'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const schema = z.object({
  password: z.string().min(8, 'Min 8 characters'),
  confirm: z.string(),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });
type Form = z.infer<typeof schema>;

function ResetPasswordContent() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const reset = useMutation({
    mutationFn: (data: Form) => api.post('/auth/reset-password', { token, newPassword: data.password }).then(r => r.data),
    onSuccess: () => {
      toast.success('Password reset successfully!');
      router.push('/login');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Reset failed. Link may have expired.'),
  });

  if (!token) {
    return (
      <div className="text-center space-y-4 py-8">
        <p className="text-muted-foreground">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-godavari-500 hover:underline text-sm font-medium">
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-godavari-50 dark:bg-godavari-950 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-godavari-500" />
        </div>
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground text-sm">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(d => reset.mutate(d))} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">New Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPw ? 'text' : 'password'}
              placeholder="Min 8 characters"
              className="w-full px-4 py-2.5 pr-10 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Confirm Password</label>
          <input
            {...register('confirm')}
            type={showPw ? 'text' : 'password'}
            placeholder="Repeat your password"
            className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500"
          />
          {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
        </div>

        <button
          type="submit"
          disabled={reset.isPending}
          className="w-full flex items-center justify-center gap-2 py-3 bg-godavari-500 text-white rounded-xl font-semibold hover:bg-godavari-600 transition-colors disabled:opacity-60"
        >
          {reset.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Reset Password
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-card rounded-3xl border shadow-xl p-8 space-y-6">
          <Suspense fallback={<div className="h-40 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-godavari-500" /></div>}>
            <ResetPasswordContent />
          </Suspense>
          <div className="text-center">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
