'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, Calendar, Loader2 } from 'lucide-react';
import { useBooking } from '@/hooks/useBookings';
import { QRCodeSVG } from 'qrcode.react';
import { formatDate, formatCurrency } from '@/lib/utils';

function BookingSuccessContent() {
  const params = useSearchParams();
  const bookingId = params.get('bookingId') || '';
  const { data: booking, isLoading } = useBooking(bookingId);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-godavari-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl border shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-br from-godavari-500 to-godavari-700 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-1">Booking Confirmed!</h1>
            <p className="text-white/80">Your adventure awaits. Have a great trip!</p>
            {booking && (
              <p className="mt-3 font-mono text-sm bg-white/10 px-4 py-2 rounded-full inline-block">
                {booking.bookingNumber}
              </p>
            )}
          </div>

          {booking && (
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-muted-foreground text-xs mb-1">Package</p>
                  <p className="font-medium">{booking.package?.name}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-muted-foreground text-xs mb-1">Travel Date</p>
                  <p className="font-medium">{formatDate(booking.travelDate)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-muted-foreground text-xs mb-1">Passengers</p>
                  <p className="font-medium">{booking.numberOfPersons} persons</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <p className="text-muted-foreground text-xs mb-1">Amount Paid</p>
                  <p className="font-medium text-green-600">{formatCurrency(Number(booking.finalAmount))}</p>
                </div>
              </div>

              {booking.qrCode && (
                <div className="flex flex-col items-center gap-3 p-6 bg-muted/30 rounded-2xl">
                  <p className="text-sm font-medium text-muted-foreground">Your Ticket QR Code</p>
                  <div className="bg-white p-4 rounded-xl">
                    <QRCodeSVG value={booking.bookingNumber} size={140} />
                  </div>
                  <p className="text-xs text-muted-foreground">Present this at the boarding point</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/dashboard/bookings"
                  className="flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Calendar className="w-4 h-4" /> My Bookings
                </Link>
                <button className="flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                  <Download className="w-4 h-4" /> Download Ticket
                </button>
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-godavari-500 text-white rounded-xl text-sm font-medium hover:bg-godavari-600 transition-colors"
                >
                  <Home className="w-4 h-4" /> Go Home
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-godavari-500" />
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
