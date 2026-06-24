'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, Trash2, User, Loader2, ChevronRight, CreditCard } from 'lucide-react';
import { usePackage } from '@/hooks/usePackages';
import { useCreateBooking } from '@/hooks/useBookings';
import { formatCurrency, formatDate } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const passengerSchema = z.object({
  name: z.string().min(2, 'Required'),
  age: z.coerce.number().min(1).max(100),
  gender: z.string().min(1, 'Required'),
  aadhaarNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
});

const schema = z.object({
  travelDate: z.string().min(1, 'Select travel date'),
  passengers: z.array(passengerSchema).min(1),
  specialRequests: z.string().optional(),
});

type Form = z.infer<typeof schema>;

export function BookingCheckoutPage({ packageId }: { packageId: string }) {
  const router = useRouter();
  const { data: pkg, isLoading } = usePackage(packageId);
  const createBooking = useCreateBooking();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { passengers: [{ name: '', age: 18, gender: 'Male' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'passengers' });
  const passengers = watch('passengers');
  const unitPrice = pkg ? Number(pkg.discountedPrice || pkg.price) : 0;
  const subtotal = unitPrice * passengers.length;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const onSubmit = async (data: Form) => {
    const result = await createBooking.mutateAsync({ packageId, ...data });
    setBookingId(result.id);
    setStep('payment');
  };

  const initiatePayment = async () => {
    if (!bookingId) return;
    try {
      const { data: res } = await api.post(`/payments/create-order/${bookingId}`);
      const order = res.data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Papikondalu Tourism',
        description: pkg?.name,
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', response);
            router.push(`/booking/success?bookingId=${bookingId}`);
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: {},
        theme: { color: '#0087fb' },
      };
      const win = window as any;
      if (win.Razorpay) {
        const rp = new win.Razorpay(options);
        rp.open();
      } else {
        toast.error('Razorpay not loaded. Refresh the page.');
      }
    } catch { toast.error('Failed to create payment order'); }
  };

  if (isLoading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-godavari-500" />
    </div>
  );

  if (!pkg) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <p>Package not found</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-10">
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {['details', 'payment'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === s || (i === 0 && step === 'payment') ? 'bg-godavari-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</div>
              <span className="capitalize text-sm font-medium hidden sm:block">{s}</span>
              {i === 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 'details' ? (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Travel Date */}
                <div className="bg-card rounded-2xl border p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Travel Date</h2>
                  <div>
                    <input
                      type="date"
                      {...register('travelDate')}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500"
                    />
                    {errors.travelDate && <p className="text-red-500 text-xs mt-1">{errors.travelDate.message}</p>}
                  </div>
                </div>

                {/* Passengers */}
                <div className="bg-card rounded-2xl border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Passenger Details</h2>
                    <button
                      type="button"
                      onClick={() => append({ name: '', age: 18, gender: 'Male' })}
                      disabled={fields.length >= (pkg.availableSeats || 10)}
                      className="flex items-center gap-1 text-sm text-godavari-500 hover:text-godavari-700 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" /> Add Passenger
                    </button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-xl space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-godavari-500" />
                          <span className="text-sm font-medium">Passenger {index + 1}</span>
                        </div>
                        {index > 0 && (
                          <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium block mb-1">Full Name *</label>
                          <input {...register(`passengers.${index}.name`)} placeholder="Name" className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500" />
                          {errors.passengers?.[index]?.name && <p className="text-red-500 text-xs mt-0.5">{errors.passengers[index]?.name?.message}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium block mb-1">Age *</label>
                          <input {...register(`passengers.${index}.age`)} type="number" placeholder="Age" className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500" />
                        </div>
                        <div>
                          <label className="text-xs font-medium block mb-1">Gender *</label>
                          <select {...register(`passengers.${index}.gender`)} className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500">
                            <option>Male</option><option>Female</option><option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium block mb-1">Aadhaar (optional)</label>
                          <input {...register(`passengers.${index}.aadhaarNumber`)} placeholder="XXXX XXXX XXXX" className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-medium block mb-1">Emergency Contact (optional)</label>
                          <input {...register(`passengers.${index}.emergencyContact`)} placeholder="+91 XXXXX XXXXX" className="w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Special Requests */}
                <div className="bg-card rounded-2xl border p-6">
                  <h2 className="text-lg font-semibold mb-3">Special Requests</h2>
                  <textarea
                    {...register('specialRequests')}
                    rows={3}
                    placeholder="Any special requirements or dietary needs..."
                    className="w-full px-4 py-3 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createBooking.isPending}
                  className="w-full py-4 bg-godavari-500 text-white rounded-xl font-semibold hover:bg-godavari-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {createBooking.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Continue to Payment
                </button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border p-8 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto">
                  <CreditCard className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">Booking Created!</h2>
                  <p className="text-muted-foreground">Proceed to complete your payment securely via Razorpay.</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl text-sm text-left space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span className="font-medium">{pkg.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Passengers</span><span className="font-medium">{passengers.length}</span></div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total</span><span className="text-godavari-600">{formatCurrency(total)}</span></div>
                </div>
                <button
                  onClick={initiatePayment}
                  className="w-full py-4 bg-godavari-500 text-white rounded-xl font-semibold hover:bg-godavari-600 transition-colors"
                >
                  Pay {formatCurrency(total)} via Razorpay
                </button>
              </motion.div>
            )}
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-24 bg-card rounded-2xl border p-5 space-y-4">
              <h3 className="font-semibold">Booking Summary</h3>
              <div className="p-3 bg-muted/50 rounded-xl">
                <p className="font-medium text-sm">{pkg.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{pkg.duration} · {pkg.startingPoint}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">× {passengers.length} passenger{passengers.length > 1 ? 's' : ''}</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (5%)</span><span>{formatCurrency(tax)}</span></div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span className="text-godavari-600">{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>✓ Instant confirmation</p>
                <p>✓ Free cancellation (48h)</p>
                <p>✓ Secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
