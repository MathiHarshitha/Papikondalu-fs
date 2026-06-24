'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import { useFeaturedPackages } from '@/hooks/usePackages';
import { formatCurrency } from '@/lib/utils';
import { Package } from '@/types';

function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const primaryImage = pkg.images?.find(img => img.isPrimary) || pkg.images?.[0];
  const price = pkg.discountedPrice || pkg.price;
  const hasDiscount = pkg.discountedPrice && pkg.discountedPrice < pkg.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border"
    >
      <div className="relative h-52 overflow-hidden bg-godavari-100">
        {primaryImage ? (
          <Image src={primaryImage.url} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-godavari-400 to-godavari-700 flex items-center justify-center">
            <span className="text-white/50 text-6xl">🚤</span>
          </div>
        )}
        {pkg.isFeatured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
            Featured
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            {Math.round((1 - price / pkg.price) * 100)}% OFF
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-card-foreground group-hover:text-godavari-500 transition-colors line-clamp-2">{pkg.name}</h3>
          {pkg.avgRating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium">{pkg.avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2">{pkg.shortDescription}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pkg.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{pkg.availableSeats} seats</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pkg.startingPoint}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <span className="text-lg font-bold text-godavari-600">{formatCurrency(price)}</span>
            {hasDiscount && <span className="ml-1 text-sm text-muted-foreground line-through">{formatCurrency(pkg.price)}</span>}
            <span className="text-xs text-muted-foreground ml-1">/person</span>
          </div>
          <Link href={`/packages/${pkg.slug}`} className="flex items-center gap-1 text-sm font-medium text-godavari-500 hover:text-godavari-700 transition-colors">
            Book Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border">
      <div className="h-52 bg-muted animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

export function FeaturedPackages() {
  const { data: packages, isLoading } = useFeaturedPackages();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-godavari-500 font-semibold text-sm uppercase tracking-wider">Our Packages</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Featured Tour Packages</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our hand-crafted tour packages designed to give you the most authentic and memorable Papikondalu experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : packages?.map((pkg: Package, i: number) => <PackageCard key={pkg.id} pkg={pkg} index={i} />)
          }
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link href="/packages" className="inline-flex items-center gap-2 px-8 py-3 bg-godavari-500 text-white rounded-full font-semibold hover:bg-godavari-600 transition-colors">
            View All Packages <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
