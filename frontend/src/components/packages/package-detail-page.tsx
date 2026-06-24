'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, Users, MapPin, Check, X, ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { usePackage } from '@/hooks/usePackages';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Review } from '@/types';

export function PackageDetailPage({ slug }: { slug: string }) {
  const { data: pkg, isLoading } = usePackage(slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');

  if (isLoading) return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10 space-y-6">
        <div className="h-96 bg-muted rounded-2xl animate-pulse" />
        <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
      </div>
    </div>
  );

  if (!pkg) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-semibold mb-2">Package not found</p>
        <Link href="/packages" className="text-godavari-500 hover:underline">Browse all packages</Link>
      </div>
    </div>
  );

  const price = pkg.discountedPrice || pkg.price;
  const hasDiscount = pkg.discountedPrice && Number(pkg.discountedPrice) < Number(pkg.price);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/packages" className="hover:text-foreground">Packages</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate">{pkg.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-muted">
                {pkg.images?.[selectedImage] ? (
                  <Image src={pkg.images[selectedImage].url} alt={pkg.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-godavari-400 to-godavari-700 flex items-center justify-center text-8xl text-white/20">🚤</div>
                )}
              </div>
              {pkg.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {pkg.images.map((img: any, i: number) => (
                    <button key={i} onClick={() => setSelectedImage(i)} className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-godavari-500' : 'border-transparent'}`}>
                      <Image src={img.url} alt="" width={80} height={64} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{pkg.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {pkg.avgRating > 0 && (
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{pkg.avgRating.toFixed(1)} ({pkg.totalRatings} reviews)</span>
                )}
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{pkg.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{pkg.availableSeats} seats available</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{pkg.startingPoint} → {pkg.endingPoint}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex gap-6">
                {(['overview', 'itinerary', 'reviews'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-godavari-500 text-godavari-500' : 'border-transparent text-muted-foreground'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">About this tour</h3>
                  <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
                </div>

                {pkg.highlights?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Highlights</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pkg.highlights.map((h: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500 shrink-0" />{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-green-600">Included</h3>
                    <ul className="space-y-2">
                      {pkg.includedServices?.map((s: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500 shrink-0" />{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-red-500">Excluded</h3>
                    <ul className="space-y-2">
                      {pkg.excludedServices?.map((s: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-sm"><X className="w-4 h-4 text-red-400 shrink-0" />{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-xl border">
                  <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                  <p className="text-sm text-muted-foreground">{pkg.cancellationPolicy}</p>
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {Array.isArray(pkg.itinerary) && pkg.itinerary.map((item: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-godavari-500 text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
                      {i < pkg.itinerary.length - 1 && <div className="w-0.5 h-full bg-godavari-200 mt-2" />}
                    </div>
                    <div className="pb-6">
                      {item.time && <div className="text-xs text-godavari-500 font-medium mb-1">{item.time}</div>}
                      {item.day && <div className="text-sm font-semibold mb-1">Day {item.day}</div>}
                      {item.activity && <p className="text-sm text-muted-foreground">{item.activity}</p>}
                      {item.activities && (
                        <ul className="space-y-1">
                          {item.activities.map((a: string, j: number) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="w-3 h-3 text-godavari-400" />{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {pkg.reviews?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                  pkg.reviews?.map((review: Review) => (
                    <div key={review.id} className="p-4 rounded-xl border space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-godavari-100 flex items-center justify-center text-sm font-bold text-godavari-600">
                            {review.user.name?.[0]}
                          </div>
                          <span className="font-medium text-sm">{review.user.name}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="font-medium text-sm">{review.title}</p>
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right - Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl border bg-card shadow-lg space-y-5">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-godavari-600">{formatCurrency(Number(price))}</span>
                  <span className="text-muted-foreground">/person</span>
                </div>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">{formatCurrency(Number(pkg.price))}</span>
                )}
              </div>

              <div className="space-y-3 py-3 border-y">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{pkg.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Seats</span>
                  <span className={`font-medium ${pkg.availableSeats < 5 ? 'text-red-500' : 'text-green-500'}`}>{pkg.availableSeats} remaining</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Starting From</span>
                  <span className="font-medium">{pkg.startingPoint}</span>
                </div>
              </div>

              <Link href={`/booking/${pkg.id}`} className="block w-full text-center py-3 bg-godavari-500 text-white rounded-xl font-semibold hover:bg-godavari-600 transition-colors">
                Book This Package
              </Link>
              <p className="text-xs text-center text-muted-foreground">Free cancellation up to 48 hours before departure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
