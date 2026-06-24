'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Download, TrendingUp, Users, Package } from 'lucide-react';

const COLORS = ['#0087fb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminReportsPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: monthly } = useQuery({
    queryKey: ['revenue-monthly', year],
    queryFn: () => api.get('/reports/revenue', { params: { period: 'monthly', year } }).then(r => r.data.data),
  });

  const { data: tourists } = useQuery({
    queryKey: ['tourists', year],
    queryFn: () => api.get('/reports/tourists', { params: { period: 'monthly', year } }).then(r => r.data.data),
  });

  const { data: popular } = useQuery({
    queryKey: ['popular-packages'],
    queryFn: () => api.get('/reports/packages/popular', { params: { limit: 5 } }).then(r => r.data.data),
  });

  const { data: trends } = useQuery({
    queryKey: ['booking-trends-30'],
    queryFn: () => api.get('/reports/bookings/trends', { params: { days: 30 } }).then(r => r.data.data),
  });

  const totalRevenue = (monthly || []).reduce((s: number, m: any) => s + Number(m.revenue), 0);
  const totalTourists = (tourists || []).reduce((s: number, m: any) => s + Number(m.tourists), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm">Platform performance insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={year} onChange={e => setYear(Number(e.target.value))}
            className="px-3 py-2 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-godavari-500">
            {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-godavari-500' },
          { label: 'Total Tourists', value: totalTourists.toLocaleString(), icon: Users, color: 'text-green-500' },
          { label: 'Top Package', value: popular?.[0]?.name?.split(' ').slice(0, 3).join(' ') || '—', icon: Package, color: 'text-purple-500' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="font-bold text-lg">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border p-5">
          <h2 className="font-semibold mb-4">Monthly Revenue ({year})</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={d => d?.split('-')[1]} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [formatCurrency(v), 'Revenue']} />
              <Bar dataKey="revenue" fill="#0087fb" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border p-5">
          <h2 className="font-semibold mb-4">Monthly Tourists ({year})</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={tourists || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={d => d?.split('-')[1]} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="tourists" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border p-5">
          <h2 className="font-semibold mb-4">Booking Trends (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trends || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={d => d?.split('-')[2]} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="confirmed" fill="#22c55e" name="Confirmed" stackId="a" />
              <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl border p-5">
          <h2 className="font-semibold mb-4">Popular Packages</h2>
          <div className="space-y-3">
            {(popular || []).map((pkg: any, i: number) => (
              <div key={pkg.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: COLORS[i] }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{pkg.name}</p>
                  <div className="h-1.5 bg-muted rounded-full mt-1">
                    <div className="h-1.5 rounded-full" style={{ width: `${Math.min((pkg.totalBookings / ((popular?.[0]?.totalBookings || 1))) * 100, 100)}%`, backgroundColor: COLORS[i] }} />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{pkg.totalBookings} bookings</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
