'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Star, Clock, Users, MapPin, ArrowRight, Heart, SlidersHorizontal } from 'lucide-react';
import { usePackages } from '@/hooks/usePackages';
import { formatCurrency } from '@/lib/utils';
import { Package, PackageCategory } from '@/types';

const CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'BOAT_TOUR', label: 'Boat Tour' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'FAMILY', label: 'Family' },
  { value: 'HONEYMOON', label: 'Honeymoon' },
  { value: 'GROUP', label: 'Group' },
  { value: 'WEEKEND', label: 'Weekend' },
  { value: 'OVERNIGHT', label: 'Overnight' },
];

export function PackagesListPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePackages({ search: search || undefined, category: category || undefined, sortBy, page, limit: 12 });
  const packages = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-godavari-800 to-godavari-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Tour Packages</h1>
          <p className="text-white/70 max-w-xl mx-auto">Discover our curated selection of Papikondalu experiences</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search packages..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500"
            />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-godavari-500">
            <option value="createdAt">Newest First</option>
            <option value="price">Price: Low to High</option>
            <option value="avgRating">Top Rated</option>
            <option value="totalBookings">Most Popular</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.value ? 'bg-godavari-500 text-white' : 'bg-muted text-muted-foreground hover:bg-godavari-100'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border overflow-hidden">
                <div className="h-52 bg-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No packages found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg: Package, i: number) => {
              const primaryImage = pkg.images?.find(img => img.isPrimary) || pkg.images?.[0];
              const price = pkg.discountedPrice || pkg.price;
              const hasDiscount = pkg.discountedPrice && pkg.discountedPrice < pkg.price;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-52 overflow-hidden bg-muted">
                    {primaryImage ? (
                      <Image src={primaryImage.url} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-godavari-400 to-godavari-700 flex items-center justify-center text-6xl text-white/30">🚤</div>
                    )}
                    {hasDiscount && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {Math.round((1 - Number(price) / Number(pkg.price)) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold group-hover:text-godavari-500 transition-colors line-clamp-2">{pkg.name}</h3>
                      {pkg.avgRating > 0 && (
                        <span className="flex items-center gap-1 text-xs shrink-0"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{pkg.avgRating.toFixed(1)}</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{pkg.shortDescription}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pkg.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{pkg.availableSeats} left</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <span className="text-lg font-bold text-godavari-600">{formatCurrency(Number(price))}</span>
                        <span className="text-xs text-muted-foreground">/person</span>
                      </div>
                      <Link href={`/packages/${pkg.slug}`} className="flex items-center gap-1 px-4 py-2 bg-godavari-500 text-white rounded-full text-sm font-medium hover:bg-godavari-600 transition-colors">
                        Book <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!meta.hasPrev} className="px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-muted transition-colors">Previous</button>
            <span className="px-4 py-2 text-sm text-muted-foreground">Page {meta.page} of {meta.totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={!meta.hasNext} className="px-4 py-2 rounded-lg border disabled:opacity-50 hover:bg-muted transition-colors">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
