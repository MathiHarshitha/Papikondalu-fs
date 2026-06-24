'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn } from 'lucide-react';

const images = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: 'Godavari River gorges', category: 'Scenery' },
  { src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800', alt: 'Boat on river', category: 'Boats' },
  { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800', alt: 'Tribal village', category: 'Culture' },
  { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', alt: 'Forest hills', category: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800', alt: 'River at sunset', category: 'Scenery' },
  { src: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800', alt: 'Traditional boat', category: 'Boats' },
  { src: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800', alt: 'Mountain landscape', category: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800', alt: 'River journey', category: 'Scenery' },
  { src: 'https://images.unsplash.com/photo-1559521783-1d1599583485?w=800', alt: 'Local food', category: 'Culture' },
  { src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800', alt: 'Sunrise view', category: 'Scenery' },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', alt: 'Lush valley', category: 'Nature' },
  { src: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800', alt: 'Tribal art', category: 'Culture' },
];

const categories = ['All', 'Scenery', 'Boats', 'Nature', 'Culture'];

export default function GalleryPage() {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = active === 'All' ? images : images.filter((img) => img.category === active);

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-gradient-to-br from-godavari-800 to-godavari-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-3">Photo Gallery</h1>
          <p className="text-white/70">A visual journey through the beauty of Papikondalu</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Filter tabs */}
        <div className="flex gap-2 justify-center flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active === cat
                  ? 'bg-godavari-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-godavari-100 dark:hover:bg-godavari-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img, i) => (
            <motion.div
              key={img.src}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group bg-muted"
              onClick={() => setSelected(img.src)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="text-xs px-2 py-0.5 bg-black/50 text-white rounded-full">{img.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-4 right-4 p-2 text-white hover:text-gray-300" aria-label="Close">
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={selected} alt="Gallery enlarged view" fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
