import type { Metadata } from 'next';
import { PackagesListPage } from '@/components/packages/packages-list-page';

export const metadata: Metadata = {
  title: 'Tour Packages',
  description: 'Browse our premium Papikondalu tour packages - boat tours, adventures, family trips, and more.',
};

export default function PackagesPage() {
  return <PackagesListPage />;
}
