'use client';
import { useAuthStore } from '@/store/auth.store';
import { useMyBookings } from '@/hooks/useBookings';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Calendar, CreditCard, Heart, ArrowRight, Anchor } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: bookingsData } = useMyBookings(1, 5);
  const bookings = bookingsData?.data || [];

  const stats = [
    { label: 'Total Bookings', value: bookingsData?.meta?.total || 0, icon: Calendar, color: 'text-godavari-500', bg: 'bg-godavari-50 dark:bg-godavari-950' },
    { label: 'Upcoming Trips', value: bookings.filter((b: any) => b.status === 'CONFIRMED').length, icon: Anchor, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
    { label: 'Payments Made', value: bookings.filter((b: any) => b.payment?.status === 'SUCCESS').length, icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
  ];

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's a summary of your travel journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-card rounded-2xl border">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold">Recent Bookings</h2>
          <Link href="/dashboard/bookings" className="text-sm text-godavari-500 flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <p>No bookings yet.</p>
            <Link href="/packages" className="text-godavari-500 text-sm font-medium mt-2 inline-block hover:underline">Browse packages →</Link>
          </div>
        ) : (
          <div className="divide-y">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{booking.package?.name}</p>
                  <p className="text-xs text-muted-foreground">{booking.bookingNumber} · {formatDate(booking.travelDate)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[booking.status] || 'bg-muted text-muted-foreground'}`}>
                    {booking.status}
                  </span>
                  <span className="text-sm font-semibold text-godavari-600">{formatCurrency(Number(booking.finalAmount))}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/packages" className="bg-gradient-to-br from-godavari-500 to-godavari-700 text-white rounded-2xl p-6 space-y-2 hover:opacity-90 transition-opacity">
          <Anchor className="w-7 h-7" />
          <p className="font-bold text-lg">Explore Packages</p>
          <p className="text-white/70 text-sm">Discover new adventures on the Godavari</p>
        </Link>
        <Link href="/dashboard/saved" className="bg-card border rounded-2xl p-6 space-y-2 hover:shadow-md transition-shadow">
          <Heart className="w-7 h-7 text-pink-500" />
          <p className="font-bold text-lg">Saved Packages</p>
          <p className="text-muted-foreground text-sm">View packages you've saved for later</p>
        </Link>
      </div>
    </div>
  );
}
