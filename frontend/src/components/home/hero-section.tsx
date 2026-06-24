'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Search, Star, Users, Calendar } from 'lucide-react';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 bg-gradient-to-br from-godavari-900 via-godavari-800 to-gray-900">
        {/* Animated water effect overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-godavari-900/80" />
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 C25 0, 75 20, 100 10 L100 20 L0 20 Z" fill="rgba(255,255,255,0.05)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,135,251,0.15),transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>Andhra Pradesh's #1 Tourism Destination</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Discover the Magic of{' '}
            <span className="bg-gradient-to-r from-godavari-300 to-blue-300 bg-clip-text text-transparent">
              Papikondalu
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Embark on a breathtaking boat journey through the majestic Godavari gorges, surrounded by the ancient Papikondalu hills and pristine tribal villages.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/packages" className="flex items-center gap-2 px-8 py-4 bg-godavari-500 hover:bg-godavari-400 text-white rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-godavari-500/30">
              Explore Packages
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/about" className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full font-semibold text-lg border border-white/30 transition-all">
              Learn More
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
          >
            {[
              { icon: Calendar, label: '20+ Years Experience', value: '20+' },
              { icon: Users, label: 'Tourists Served', value: '7 Lakh+' },
              { icon: Star, label: 'Average Rating', value: '4.9/5' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 text-white/80">
                <stat.icon className="w-5 h-5 text-godavari-300" />
                <div>
                  <div className="font-bold text-white text-lg">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2"
      >
        <div className="w-1 h-2 bg-white/60 rounded-full" />
      </motion.div>
    </section>
  );
}
