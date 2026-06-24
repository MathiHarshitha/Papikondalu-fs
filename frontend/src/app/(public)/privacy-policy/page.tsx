import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

const sections = [
  {
    title: '1. Information We Collect',
    content:
      'We collect information you provide directly to us, including your name, email address, phone number, Aadhaar number (for verification), and payment information when you make a booking. We also collect information automatically when you use our services, such as IP address, browser type, and usage data.',
  },
  {
    title: '2. How We Use Your Information',
    content:
      'We use your information to process bookings and payments, send booking confirmations and notifications, provide customer support, improve our services, send marketing communications (with your consent), and comply with legal obligations.',
  },
  {
    title: '3. Information Sharing',
    content:
      'We do not sell or rent your personal information to third parties. We may share your information with service providers who assist in our operations (payment processors, email providers), and when required by law.',
  },
  {
    title: '4. Data Security',
    content:
      'We implement industry-standard security measures including SSL encryption, secure payment processing through Razorpay, and regular security audits to protect your personal information.',
  },
  {
    title: '5. Data Retention',
    content:
      'We retain your personal data for as long as necessary to provide services and comply with legal obligations. You may request deletion of your account and associated data at any time.',
  },
  {
    title: '6. Your Rights',
    content:
      'You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, contact us at privacy@papikondalu.com.',
  },
  {
    title: '7. Cookies',
    content:
      'We use cookies and similar tracking technologies to improve your experience. You can control cookie settings through your browser preferences.',
  },
  {
    title: '8. Changes to This Policy',
    content:
      'We may update this policy periodically. We will notify you of significant changes via email or a prominent notice on our website.',
  },
  {
    title: '9. Contact Us',
    content:
      'For privacy-related questions, contact our Data Protection Officer at privacy@papikondalu.com or write to us at Boat Ghat, Rajahmundry, Andhra Pradesh 533101.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-godavari-800 to-godavari-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-white/70">Last updated: January 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6">
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
