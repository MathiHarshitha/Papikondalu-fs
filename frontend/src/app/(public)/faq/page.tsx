'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    q: 'What is the best time to visit Papikondalu?',
    a: 'October to March is ideal. The weather is pleasant and the Godavari is at its most scenic. Avoid monsoon season (July–September) as river levels can be high and unsafe.',
  },
  {
    q: 'How long is the boat journey?',
    a: 'The standard day trip is about 12–14 hours including stops. The round trip covers approximately 160 km along the Godavari river.',
  },
  {
    q: 'Is it safe for children and elderly?',
    a: 'Yes. We provide life jackets for all passengers and our boats are equipped with safety gear. The journey is generally calm and suitable for all ages.',
  },
  {
    q: 'What should I carry for the trip?',
    a: 'Comfortable clothing, sunscreen, a hat, sunglasses, a light jacket (especially for winter mornings), personal medications, camera, and some cash for local purchases.',
  },
  {
    q: 'Can I cancel my booking?',
    a: '100% refund if cancelled 48+ hours before departure. 50% refund for cancellations 24–48 hours prior. No refund within 24 hours of the trip.',
  },
  {
    q: 'Are meals included?',
    a: 'Yes, most packages include breakfast and lunch. The overnight package includes dinner and next morning breakfast. We serve authentic local and tribal cuisine.',
  },
  {
    q: 'How do I reach the boarding point?',
    a: 'The main boarding point is at the Boat Ghat in Rajahmundry, about 2 km from Rajahmundry railway station. Autos, taxis, and buses are available.',
  },
  {
    q: 'Do you provide guides?',
    a: 'Yes, all tours include certified guides who are native to the region and knowledgeable about local culture, flora, and fauna.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept UPI, credit/debit cards, net banking, and popular wallets through our secure Razorpay payment gateway.',
  },
  {
    q: 'Can I get an invoice for my booking?',
    a: 'Yes, an invoice PDF is automatically generated after successful payment and is available in your booking dashboard.',
  },
  {
    q: 'Are there group discounts?',
    a: 'Yes, we offer special rates for groups of 10 or more. Contact us at info@papikondalu.com for group booking enquiries.',
  },
  {
    q: 'What if the trip is cancelled due to bad weather?',
    a: 'Safety is our priority. If we cancel due to weather or river conditions, you receive a full refund or can reschedule at no extra charge.',
  },
];

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border rounded-2xl overflow-hidden bg-card"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-medium pr-4">{faq.q}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-godavari-800 to-godavari-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-white/70">Everything you need to know about your Papikondalu journey</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        <div className="mt-10 p-6 bg-godavari-50 dark:bg-godavari-950/30 rounded-2xl text-center">
          <p className="font-medium mb-2">Still have questions?</p>
          <p className="text-muted-foreground text-sm mb-4">Our team is happy to help you plan your perfect trip.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-godavari-500 text-white rounded-xl text-sm font-medium hover:bg-godavari-600 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
