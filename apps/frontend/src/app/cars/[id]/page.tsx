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
        if (res.success) {
          setCar(res.data);
        } else {
          setError(res.error?.message ?? 'Vehicle not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch vehicle details');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCar();
  }, [id]);

  if (loading) return <div className="py-24"><LoadingSpinner message="Loading vehicle details..." /></div>;
  if (error || !car) return <div className="py-24"><ErrorMessage message={error ?? 'Vehicle not found'} retry={loadCar} /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
      <Link
        href="/cars"
        className="inline-flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Cars</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Car Details Info */}
        <div className="lg:col-span-2 space-y-6">
          <CarImageGallery images={car.images} />

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {car.make} {car.model}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Year: {car.year} | Category: {getCategoryLabel(car.category)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-blue-600">
                  {formatCurrency(car.pricePerDay)}
                </span>
                <span className="text-xs text-gray-400 block"> / day</span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center space-x-2 py-1">
              {car.isAvailable ? (
                <span className="inline-flex items-center space-x-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Available Instantly</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <AlertCircle className="h-4 w-4" />
                  <span>Currently Unavailable</span>
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t pt-4 space-y-2">
              <h3 className="font-bold text-gray-900">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {car.description || 'No description provided for this vehicle.'}
              </p>
            </div>

            {/* Detailed Specs */}
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-bold text-gray-900">Specifications</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border p-3 rounded-lg text-center bg-gray-50/50">
                  <span className="text-xs text-gray-400 block mb-0.5">Transmission</span>
                  <span className="text-sm font-semibold capitalize text-gray-800">{car.transmission}</span>
                </div>
                <div className="border p-3 rounded-lg text-center bg-gray-50/50">
                  <span className="text-xs text-gray-400 block mb-0.5">Seats</span>
                  <span className="text-sm font-semibold text-gray-800">{car.seats} Passengers</span>
                </div>
                <div className="border p-3 rounded-lg text-center bg-gray-50/50">
                  <span className="text-xs text-gray-400 block mb-0.5">Fuel Type</span>
                  <span className="text-sm font-semibold capitalize text-gray-800">{car.fuelType}</span>
                </div>
                <div className="border p-3 rounded-lg text-center bg-gray-50/50">
                  <span className="text-xs text-gray-400 block mb-0.5">Location</span>
                  <span className="text-sm font-semibold text-gray-800">{car.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingForm car={car} />
          </div>
        </div>
      </div>
    </div>
  );
}
