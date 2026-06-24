import type { Metadata } from 'next';
import { PackageDetailPage } from '@/components/packages/package-detail-page';

export const metadata: Metadata = {
  title: 'Package Details',
};

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PackageDetailPage slug={slug} />;
}
