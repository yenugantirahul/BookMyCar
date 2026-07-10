'use client';
import { toast } from 'react-hot-toast';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers';
import { useSupabaseClient } from '@/hooks/use-supabase-client';
import { getAdminBookings, updateBookingStatus } from '@/lib/api';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateRange, getStatusColor } from '@/lib/utils';
import type { Booking } from '@/types';

export default function AdminBookingsPage() {
  const { session } = useAuth();
  const supabase = useSupabaseClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const loadBookings = () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    getAdminBookings({ status: statusFilter || undefined, limit: 100 }, supabase)
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.message || 'Something went wrong while retrieving bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, [session, statusFilter]);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await updateBookingStatus(bookingId, newStatus, supabase);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: res.data.status } : b)),
      );
      toast.success('Status updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Error updating status');
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving booking logs..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Bookings</h1>
          <p className="text-gray-500 mt-1">Review active rent requests and override booking statuses.</p>
        </div>

        {/* Filter Tab */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-1.5 rounded-lg bg-white text-sm font-semibold focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error ? (
        <ErrorMessage message={error} retry={loadBookings} />
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            No bookings matching criteria found.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Rents Catalog ({bookings.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-xs">{b.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {b.car ? `${b.car.make} ${b.car.model}` : 'Vehicle'}
                      </td>
                      <td className="px-4 py-3 text-xs">{formatDateRange(b.startDate, b.endDate)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(b.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {b.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                              className="text-xs py-1 h-auto"
                            >
                              Confirm
                            </Button>
                          )}
                          {b.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(b.id, 'active')}
                              className="text-xs py-1 h-auto"
                            >
                              Check Out
                            </Button>
                          )}
                          {b.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(b.id, 'completed')}
                              className="text-xs py-1 h-auto text-green-700 hover:text-green-800"
                            >
                              Check In
                            </Button>
                          )}
                          {b.status !== 'cancelled' && b.status !== 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                              className="text-xs py-1 h-auto text-red-600 hover:text-red-700"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
