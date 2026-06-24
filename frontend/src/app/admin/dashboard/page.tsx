'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import {
  Users, Package, Calendar, CreditCard, TrendingUp, Clock, Anchor
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/reports/dashboard').then(r => r.data.data),
    refetchInterval: 30000,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-monthly'],
    queryFn: () => api.get('/reports/revenue', { params: { period: 'daily', year: new Date().getFullYear(), month: new Date().getMonth() + 1 } }).then(r => r.data.data),
  });

  const { data: trendData } = useQuery({
    queryKey: ['booking-trends'],
    queryFn: () => api.get('/reports/bookings/trends', { params: { days: 14 } }).then(r => r.data.data),
  });

  const widgets = [
    { label: 'Total Revenue', value: stats ? formatCurrency(Number(stats.totalRevenue)) : '—', icon: CreditCard, color: 'text-godavari-500', bg: 'bg-godavari-50 dark:bg-godavari-950' },
    { label: 'Total Tourists', value: stats?.totalUsers ?? '—', icon: Users, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
    { label: 'Active Packages', value: stats?.activePackages ?? '—', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
    { label: "Today's Bookings", value: stats?.todayBookings ?? '—', icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' },
    { label: 'Pending Payments', value: stats?.pendingPayments ?? '—', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950' },
    { label: 'Upcoming Trips', value: stats?.upcomingTrips ?? '—', icon: Anchor, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground text-sm">Real-time platform metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((w, i) => (
          <motion.div key={w.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-card rounded-2xl border p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${w.bg} flex items-center justify-center shrink-0`}>
              <w.icon className={`w-6 h-6 ${w.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold">{w.value}</p>
              <p className="text-xs text-muted-foreground">{w.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border p-5">
          <h2 className="font-semibold mb-4">Daily Revenue (This Month)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.split('-')[2]} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => formatCurrency(v)} labelFormatter={d => `Date: ${d}`} />
              <Line type="monotone" dataKey="revenue" stroke="#0087fb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border p-5">
          <h2 className="font-semibold mb-4">Booking Trends (Last 14 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.split('-')[2] + '/' + d.split('-')[1]} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="confirmed" fill="#22c55e" name="Confirmed" radius={[4,4,0,0]} />
              <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
