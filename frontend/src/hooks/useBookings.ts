'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export function useMyBookings(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['bookings', 'my', page],
    queryFn: () => api.get('/bookings/my', { params: { page, limit } }).then(r => r.data.data),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => api.get(`/bookings/my/${id}`).then(r => r.data.data),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/bookings', data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created! Proceed to payment.');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Booking failed'),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => api.patch(`/bookings/my/${id}/cancel`, { reason }).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking cancelled');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to cancel'),
  });
}
