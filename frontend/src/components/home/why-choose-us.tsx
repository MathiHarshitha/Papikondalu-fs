'use client';
import { motion } from 'framer-motion';
import { Shield, Clock, Headphones, Star, MapPin, CreditCard } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Safe & Trusted', desc: 'Certified operators with 20+ years of experience ensuring your safety on every journey.' },
  { icon: Clock, title: 'On-Time Service', desc: 'We value your time. All tours depart and return on schedule, guaranteed.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated support team is available around the clock to assist you.' },
  { icon: Star, title: 'Premium Experience', desc: 'Luxury boats, expert guides, and curated itineraries for an unforgettable trip.' },
  { icon: MapPin, title: 'Local Expertise', desc: 'Born and raised in Rajahmundry, we know every inch of the Godavari valley.' },
  { icon: CreditCard, title: 'Easy Booking & Pay', desc: 'Book online in minutes with secure Razorpay integration and instant confirmation.' },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-br from-godavari-900 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-godavari-300 font-semibold text-sm uppercase tracking-wider">Why Us</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Why Choose Papikondalu Tourism</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            We go beyond ordinary tourism to create extraordinary memories on the sacred waters of the Godavari.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-godavari-500/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-godavari-300" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
