'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMyBookings, useCancelBooking } from '@/hooks/useBookings';
import { formatCurrency, formatDate } from '@/lib/utils';
import { QRCodeSVG } from 'qrcode.react';
import { Download, X, ChevronDown } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export default function MyBookingsPage() {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data, isLoading } = useMyBookings(page);
  const cancelBooking = useCancelBooking();

  const bookings = data?.data || [];
  const meta = data?.meta;

  const handleCancel = (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    cancelBooking.mutate({ id, reason: 'Customer requested cancellation' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground text-sm">Your past and upcoming trips</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No bookings found.</p>
          <Link href="/packages" className="text-godavari-500 font-medium mt-2 inline-block hover:underline">Book a package →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking: any, i: number) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{booking.package?.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[booking.status] || 'bg-muted'}`}>{booking.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {booking.bookingNumber} · Travel: {formatDate(booking.travelDate)} · {booking.numberOfPersons} pax
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-godavari-600 text-sm">{formatCurrency(Number(booking.finalAmount))}</span>
                  <button onClick={() => setExpanded(expanded === booking.id ? null : booking.id)} className="p-1.5 hover:bg-muted rounded-lg">
                    <ChevronDown className={`w-4 h-4 transition-transform ${expanded === booking.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {expanded === booking.id && (
                <div className="border-t p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                          ['Booked On', formatDate(booking.createdAt)],
                          ['Payment', booking.payment?.status || 'N/A'],
                          ['Route', `${booking.package?.startingPoint} → ${booking.package?.endingPoint}`],
                          ['Refund', booking.refundAmount ? formatCurrency(Number(booking.refundAmount)) : 'N/A'],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <p className="text-muted-foreground text-xs mb-0.5">{k}</p>
                            <p className="font-medium text-sm">{v}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                          <button onClick={() => handleCancel(booking.id)}
                            className="flex items-center gap-1.5 text-xs px-3 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        )}
                        <button className="flex items-center gap-1.5 text-xs px-3 py-2 border rounded-lg hover:bg-muted transition-colors">
                          <Download className="w-3.5 h-3.5" /> Download Ticket
                        </button>
                      </div>
                    </div>
                    {booking.qrCode && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-white p-2 rounded-xl"><QRCodeSVG value={booking.bookingNumber} size={90} /></div>
                        <p className="text-xs text-muted-foreground">Show at boarding</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => p - 1)} disabled={!meta.hasPrev} className="px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-muted text-sm">Prev</button>
          <span className="px-4 py-2 text-sm text-muted-foreground">{meta.page} / {meta.totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={!meta.hasNext} className="px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-muted text-sm">Next</button>
        </div>
      )}
    </div>
  );
}
