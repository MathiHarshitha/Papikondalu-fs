'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

const statusIcon: Record<string, React.ReactNode> = {
  SUCCESS: <CheckCircle className="w-4 h-4 text-green-500" />,
  FAILED: <XCircle className="w-4 h-4 text-red-500" />,
  PENDING: <Clock className="w-4 h-4 text-yellow-500" />,
  REFUNDED: <CheckCircle className="w-4 h-4 text-blue-500" />,
};
const statusBg: Record<string, string> = {
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  REFUNDED: 'bg-blue-100 text-blue-700',
};

export default function PaymentsPage() {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['my-payments'],
    queryFn: () => api.get('/payments/my').then(r => r.data.data),
  });

  const totalPaid = payments.filter((p: any) => p.status === 'SUCCESS').reduce((s: number, p: any) => s + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment History</h1>
        <p className="text-muted-foreground text-sm">All your transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Paid', value: formatCurrency(totalPaid), icon: CreditCard, color: 'text-godavari-500' },
          { label: 'Transactions', value: payments.length, icon: CheckCircle, color: 'text-green-500' },
          { label: 'Pending', value: payments.filter((p: any) => p.status === 'PENDING').length, icon: Clock, color: 'text-yellow-500' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="font-semibold">All Transactions</h2>
        </div>
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No payments yet.</div>
        ) : (
          <div className="divide-y">
            {payments.map((payment: any, i: number) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {statusIcon[payment.status] ?? <CreditCard className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{payment.booking?.package?.name || 'Package'}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.booking?.bookingNumber} · {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBg[payment.status] ?? 'bg-muted'}`}>
                    {payment.status}
                  </span>
                  <span className="font-bold text-sm">{formatCurrency(Number(payment.amount))}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
