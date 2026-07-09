'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers';
import { getBookings } from '@/lib/api';
import type { Booking } from '@/types';
import { BookingCard } from '@/components/booking/booking-card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorMessage } from '@/components/shared/error-message';
import Link from 'next/link';

export default function BookingsPage() {
  const { user, session } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const loadBookings = () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    getBookings({ status: statusFilter || undefined }, session.access_token)
      .then((res) => {
        if (res.success) {
          setBookings(res.data);
        } else {
          setError(res.error?.message ?? 'Failed to load booking history');
        }
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while fetching booking history');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, [session, statusFilter]);

  if (loading) return <div className="py-24"><LoadingSpinner message="Loading your bookings..." /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">Manage and view your vehicle rental history.</p>
        </div>

        {/* Status Filter Tab Group Mock */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg self-start text-xs font-semibold">
          {[
            { id: '', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Paid' },
            { id: 'active', label: 'Active' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === tab.id
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <ErrorMessage message={error} retry={loadBookings} />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description={
            statusFilter
              ? `You have no bookings matching the status filter.`
              : 'Start searching our fleet and rent your first vehicle today!'
          }
          action={
            <Link
              href="/cars"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm shadow transition-colors"
            >
              Browse Fleet
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
