'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Car as CarIcon, MapPin } from 'lucide-react';
import type { Car } from '@/types';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import { motion } from 'framer-motion';

export function CarCard({ car }: { car: Car }) {
  return (
    <motion.div 
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full group"
    >
      {/* Image Gallery Mockup */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
        {car.primaryImageUrl ? (
            <Image
              src={car.primaryImageUrl}
              alt={`${car.make} ${car.model}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <CarIcon className="h-12 w-12 text-slate-300" />
          )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          {getCategoryLabel(car.category)}
        </div>
        {!car.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {car.make} {car.model}
            </h3>
            <span className="text-xs text-slate-500 font-medium shrink-0 ml-2 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              {car.year}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2 flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-slate-400" />
            <span className="truncate">{car.location}</span>
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-center space-y-1">
            <span className="block text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Trans</span>
            <span className="font-semibold text-slate-700 capitalize">{car.transmission}</span>
          </div>
          <div className="text-center space-y-1 border-x border-slate-200">
            <span className="block text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Seats</span>
            <span className="font-semibold text-slate-700">{car.seats}</span>
          </div>
          <div className="text-center space-y-1">
            <span className="block text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Fuel</span>
            <span className="font-semibold text-slate-700 capitalize">{car.fuelType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-extrabold text-slate-900">
              {formatCurrency(car.pricePerDay)}
            </span>
            <span className="text-sm text-slate-500 font-medium"> / day</span>
          </div>
          <Link
            href={`/cars/${car.id}`}
            className="bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
