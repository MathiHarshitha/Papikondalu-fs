'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Award, Anchor, ThumbsUp } from 'lucide-react';

const stats = [
  { icon: Award, value: '20+', label: 'Years Experience', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950' },
  { icon: Users, value: '7 Lakh+', label: 'Tourists Served', color: 'text-godavari-500', bg: 'bg-godavari-50 dark:bg-godavari-950' },
  { icon: Anchor, value: '50+', label: 'Tour Packages', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
  { icon: ThumbsUp, value: '4.9/5', label: 'Customer Rating', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
];

export function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <section ref={ref} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card shadow-sm"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
