import Link from 'next/link';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import type { Booking } from '@/types';
import { formatCurrency, formatDateRange, getStatusColor } from '@/lib/utils';

export function BookingCard({ booking }: { booking: Booking }) {
  const car = booking.car;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-200 transition-colors">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-bold text-gray-900">
            {car ? `${car.make} ${car.model}` : 'Vehicle'}
          </h3>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        <div className="space-y-1.5 text-sm text-gray-500">
          <p className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDateRange(booking.startDate, booking.endDate)} ({booking.totalDays} days)</span>
          </p>
          {car && (
            <p className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{car.location}</span>
            </p>
          )}
          <p className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatCurrency(booking.totalAmount)} ({formatCurrency(booking.pricePerDay)}/day)</span>
          </p>
        </div>
      </div>

      <div className="w-full md:w-auto text-right">
        <Link
          href={`/bookings/${booking.id}`}
          className="inline-block w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg text-center transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
