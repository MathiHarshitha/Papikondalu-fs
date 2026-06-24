import { BookingCheckoutPage } from '@/components/booking/booking-checkout-page';

export default async function BookingPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  return <BookingCheckoutPage packageId={packageId} />;
}
