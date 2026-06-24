import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms & Conditions' };

const sections = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing and using the Papikondalu Tourism website and booking services, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.',
  },
  {
    title: '2. Booking & Payment',
    content:
      'All bookings are subject to availability. Full payment is required at the time of booking. We accept UPI, credit/debit cards, net banking, and popular wallets via Razorpay. Prices are inclusive of applicable GST (5%).',
  },
  {
    title: '3. Cancellation & Refund Policy',
    content:
      '100% refund for cancellations made 48+ hours before departure. 50% refund for cancellations made 24–48 hours before departure. No refund for cancellations made within 24 hours of departure. Refunds will be processed to the original payment method within 7–10 business days.',
  },
  {
    title: '4. Tour Modifications',
    content:
      'We reserve the right to modify or cancel tours due to adverse weather conditions, government restrictions, safety concerns, or force majeure events. In such cases, we will offer a full refund or alternative dates at no extra charge.',
  },
  {
    title: '5. Participant Responsibilities',
    content:
      'Participants must follow all safety instructions provided by our guides and staff. We reserve the right to refuse or remove any participant who poses a risk to themselves or others. Participants are responsible for their personal belongings throughout the tour.',
  },
  {
    title: '6. Health & Safety',
    content:
      'Participants with medical conditions, disabilities, or who are pregnant must inform us before booking. We may require a medical clearance for certain activities. Life jackets are mandatory and provided for all water activities.',
  },
  {
    title: '7. Liability',
    content:
      'Papikondalu Tourism is not liable for personal injury, loss of property, or unforeseen expenses arising from participation in our tours, unless caused by our direct negligence. We strongly recommend purchasing travel insurance.',
  },
  {
    title: '8. Photography & Media',
    content:
      'By participating in our tours, you grant Papikondalu Tourism permission to use photographs or videos taken during the tour for promotional purposes. You may opt out by notifying us in writing before the tour.',
  },
  {
    title: '9. Intellectual Property',
    content:
      'All content on this website including text, images, logos, and designs are the property of Papikondalu Tourism and are protected by copyright law. Unauthorized use is strictly prohibited.',
  },
  {
    title: '10. Governing Law',
    content:
      'These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Rajahmundry, Andhra Pradesh.',
  },
  {
    title: '11. Contact',
    content:
      'For any questions regarding these Terms, please contact us at legal@papikondalu.com or write to: Papikondalu Tourism, Boat Ghat, Rajahmundry, Andhra Pradesh 533101.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-godavari-800 to-godavari-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Terms & Conditions</h1>
          <p className="text-white/70">Last updated: January 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Please read these Terms and Conditions carefully before using the Papikondalu Tourism
          booking platform. These terms govern your use of our website and services.
        </p>

        {sections.map(({ title, content }) => (
          <div key={title}>
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
