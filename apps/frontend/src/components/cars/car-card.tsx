import Link from 'next/link';
import { Car as CarIcon, MapPin, Users, Fuel } from 'lucide-react';
import type { Car } from '@/types';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';

export function CarCard({ car }: { car: Car }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all flex flex-col h-full">
      {/* Image Gallery Mockup */}
      <div className="relative aspect-video w-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
        {car.primaryImageUrl ? (
          <img
            src={car.primaryImageUrl}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <CarIcon className="h-12 w-12 text-gray-300" />
        )}
        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
          {getCategoryLabel(car.category)}
        </div>
        {!car.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {car.make} {car.model}
            </h3>
            <span className="text-xs text-gray-400 font-medium shrink-0 ml-2">
              {car.year}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{car.location}</span>
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg">
          <div className="text-center space-y-0.5">
            <span className="block text-gray-400">Trans</span>
            <span className="font-semibold text-gray-700 capitalize">{car.transmission}</span>
          </div>
          <div className="text-center space-y-0.5 border-x">
            <span className="block text-gray-400">Seats</span>
            <span className="font-semibold text-gray-700">{car.seats}</span>
          </div>
          <div className="text-center space-y-0.5">
            <span className="block text-gray-400">Fuel</span>
            <span className="font-semibold text-gray-700 capitalize">{car.fuelType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <span className="text-xl font-extrabold text-blue-600">
              {formatCurrency(car.pricePerDay)}
            </span>
            <span className="text-xs text-gray-400"> / day</span>
          </div>
          <Link
            href={`/cars/${car.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
