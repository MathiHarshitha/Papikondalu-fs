'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function usePackages(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['packages', params],
    queryFn: () => api.get('/packages', { params }).then(r => r.data.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedPackages() {
  return useQuery({
    queryKey: ['packages', 'featured'],
    queryFn: () => api.get('/packages/featured').then(r => r.data.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePackage(idOrSlug: string) {
  return useQuery({
    queryKey: ['package', idOrSlug],
    queryFn: () => api.get(`/packages/${idOrSlug}`).then(r => r.data.data),
    enabled: !!idOrSlug,
  });
}

export function usePackageAvailability(packageId: string, persons: number) {
  return useQuery({
    queryKey: ['availability', packageId, persons],
    queryFn: () => api.get(`/packages/${packageId}/availability`, { params: { persons } }).then(r => r.data.data),
    enabled: !!packageId && persons > 0,
  });
}
