'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, Chrome } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});
type Form = z.infer<typeof schema>;

export default function LoginPage() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = (data: Form) => login.mutate(data);

  const googleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
      </div>

      <button
        onClick={googleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-xl hover:bg-muted transition-colors font-medium"
      >
        <Chrome className="w-5 h-5 text-blue-500" />
        Continue with Google
      </button>

      <div className="flex items-center gap-4">
        <div className="flex-1 border-t" />
        <span className="text-muted-foreground text-sm">or</span>
        <div className="flex-1 border-t" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              {...register('email')}
              type="email"
              placeholder="john@example.com"
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium">Password</label>
            <Link href="/forgot-password" className="text-xs text-godavari-500 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full py-3 bg-godavari-500 text-white rounded-xl font-semibold hover:bg-godavari-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {login.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/register" className="text-godavari-500 font-medium hover:underline">Create one</Link>
      </p>
    </motion.div>
  );
}
