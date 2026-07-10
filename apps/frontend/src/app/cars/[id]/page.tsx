'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getCar } from '@/lib/api';
import type { Car } from '@/types';
import { CarImageGallery } from '@/components/cars/car-image-gallery';
import { BookingForm } from '@/components/booking/booking-form';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCar = () => {
    setLoading(true);
    setError(null);
    getCar(id)
      .then((res) => {
        setCar(res.data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch vehicle details');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCar();
  }, [id]);

  if (loading) return <div className="py-32 flex justify-center"><LoadingSpinner message="Retrieving vehicle specifications..." /></div>;
  if (error || !car) return <div className="py-24"><ErrorMessage message={error ?? 'Vehicle not found'} retry={loadCar} /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <Link
        href="/cars"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span>Return to Fleet</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Car Details Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <CarImageGallery images={car.images} />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {car.make} {car.model}
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Year: {car.year}
                  </span>
                  <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Category: {getCategoryLabel(car.category)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatCurrency(car.pricePerDay)}
                </span>
                <span className="text-sm text-slate-500 block font-medium"> / day</span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center space-x-2 py-2">
              {car.isAvailable ? (
                <span className="inline-flex items-center space-x-1.5 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full border border-green-200 shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Available Instantly</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 bg-red-50 text-red-700 text-sm font-semibold px-4 py-2 rounded-full border border-red-200 shadow-sm">
                  <AlertCircle className="h-5 w-5" />
                  <span>Currently Unavailable</span>
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Vehicle Overview</h3>
              <p className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap">
                {car.description || 'Experience the perfect blend of performance and comfort with this exceptional vehicle. Designed to meet your travel needs whether for a quick city trip or a long weekend getaway.'}
              </p>
            </div>

            {/* Detailed Specs */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-slate-100 p-4 rounded-2xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Transmission</span>
                  <span className="text-base font-bold capitalize text-slate-800">{car.transmission}</span>
                </div>
                <div className="border border-slate-100 p-4 rounded-2xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Seats</span>
                  <span className="text-base font-bold text-slate-800">{car.seats} Pass</span>
                </div>
                <div className="border border-slate-100 p-4 rounded-2xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Fuel Type</span>
                  <span className="text-base font-bold capitalize text-slate-800">{car.fuelType}</span>
                </div>
                <div className="border border-slate-100 p-4 rounded-2xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Location</span>
                  <span className="text-base font-bold text-slate-800 truncate block">{car.location}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Booking Form Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-24">
            <BookingForm car={car} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
