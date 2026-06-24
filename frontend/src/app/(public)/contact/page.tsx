'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});
type Form = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const send = useMutation({
    mutationFn: (data: Form) => api.post('/contact', data),
    onSuccess: () => { toast.success('Message sent! We\'ll reply within 24 hours.'); reset(); },
    onError: () => toast.error('Failed to send. Please try again.'),
  });

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-godavari-800 to-godavari-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/70">We're here to help plan your perfect Papikondalu adventure.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Get in Touch</h2>
            {[
              { icon: MapPin, label: 'Address', value: 'Boat Ghat, Rajahmundry, Andhra Pradesh 533101' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: Mail, label: 'Email', value: 'info@papikondalu.com' },
              { icon: Clock, label: 'Office Hours', value: 'Mon–Sat: 8 AM – 7 PM' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-godavari-50 dark:bg-godavari-950 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-godavari-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit(d => send.mutate(d))}
            className="lg:col-span-2 bg-card rounded-2xl border p-6 space-y-4"
          >
            <h2 className="font-semibold text-lg">Send a Message</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'name' as const, label: 'Full Name', type: 'text', span: 1 },
                { name: 'email' as const, label: 'Email', type: 'email', span: 1 },
                { name: 'phone' as const, label: 'Phone (optional)', type: 'tel', span: 1 },
                { name: 'subject' as const, label: 'Subject', type: 'text', span: 1 },
              ].map(({ name, label, type, span }) => (
                <div key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
                  <label className="text-sm font-medium block mb-1.5">{label}</label>
                  <input {...register(name)} type={type}
                    className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500" />
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium block mb-1.5">Message</label>
                <textarea {...register('message')} rows={5} placeholder="Tell us about your query..."
                  className="w-full px-3 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500 resize-none" />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>
            </div>
            <button type="submit" disabled={send.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-godavari-500 text-white rounded-xl font-medium hover:bg-godavari-600 transition-colors disabled:opacity-60">
              {send.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
