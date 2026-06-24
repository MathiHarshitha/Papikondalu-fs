'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const schema = z.object({ email: z.string().email('Valid email required') });
type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const forgot = useMutation({
    mutationFn: (data: Form) => api.post('/auth/forgot-password', data).then(r => r.data),
    onSuccess: () => setSent(true),
    onError: () => toast.error('Something went wrong. Try again.'),
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-card rounded-3xl border shadow-xl p-8 space-y-6">
          {!sent ? (
            <>
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-godavari-50 dark:bg-godavari-950 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-godavari-500" />
                </div>
                <h1 className="text-2xl font-bold">Forgot Password?</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(d => forgot.mutate(d))} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Email Address</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={forgot.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-godavari-500 text-white rounded-xl font-semibold hover:bg-godavari-600 transition-colors disabled:opacity-60"
                >
                  {forgot.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Reset Link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h2 className="text-xl font-bold">Check Your Email</h2>
              <p className="text-muted-foreground text-sm">
                We've sent a password reset link to <span className="font-medium text-foreground">{getValues('email')}</span>.
              </p>
              <p className="text-xs text-muted-foreground">
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-godavari-500 hover:underline font-medium">
                  try again
                </button>.
              </p>
            </div>
          )}

          <div className="text-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
