'use client';

import { useState } from 'react';
import type { CarImage } from '@/types';
import { Car as CarIcon } from 'lucide-react';

export function CarImageGallery({ images = [] }: { images?: CarImage[] }) {
  // Sort images so primary is first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.displayOrder - b.displayOrder;
  });

  const [activeIndex, setActiveIndex] = useState(0);

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-video w-full bg-gray-100 flex items-center justify-center rounded-xl border border-gray-100">
        <div className="text-center space-y-2">
          <CarIcon className="h-16 w-16 text-gray-300 mx-auto" />
          <p className="text-sm text-gray-400 font-medium">No images available</p>
        </div>
      </div>
    );
  }

  const activeImage = sortedImages[activeIndex];

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-video w-full bg-gray-50 flex items-center justify-center rounded-xl overflow-hidden border border-gray-100 relative">
        <img
          src={activeImage.url}
          alt="Car view"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 aspect-video rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                idx === activeIndex ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img src={img.url} alt="Thumbnail view" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
