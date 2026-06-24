'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2, User, Mail, Lock, Phone } from 'lucide-react';
import { useRegister } from '@/hooks/useAuth';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Enter valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type Form = z.infer<typeof schema>;

export default function RegisterPage() {
  const register_ = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = ({ confirmPassword, ...data }: Form) => register_.mutate(data);

  const googleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  const fields = [
    { name: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: User },
    { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'john@example.com', icon: Mail },
    { name: 'phone' as const, label: 'Phone', type: 'tel', placeholder: '+91 98765 43210', icon: Phone },
    { name: 'password' as const, label: 'Password', type: 'password', placeholder: '••••••••', icon: Lock },
    { name: 'confirmPassword' as const, label: 'Confirm Password', type: 'password', placeholder: '••••••••', icon: Lock },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md space-y-5"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-muted-foreground mt-2">Join thousands of Papikondalu explorers</p>
      </div>

      <button
        onClick={googleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border rounded-xl hover:bg-muted transition-colors font-medium"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-4">
        <div className="flex-1 border-t" /><span className="text-muted-foreground text-sm">or</span><div className="flex-1 border-t" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
          <div key={name}>
            <label className="text-sm font-medium block mb-1">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                {...register(name)}
                type={type}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500 text-sm"
              />
            </div>
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
          </div>
        ))}

        <button
          type="submit"
          disabled={register_.isPending}
          className="w-full py-3 bg-godavari-500 text-white rounded-xl font-semibold hover:bg-godavari-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
        >
          {register_.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-godavari-500 font-medium hover:underline">Sign in</Link>
      </p>
    </motion.div>
  );
}
