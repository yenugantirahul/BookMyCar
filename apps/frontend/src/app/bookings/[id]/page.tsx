'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { getBooking, cancelBooking } from '@/lib/api';
import type { Booking } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';
import { formatCurrency, formatDateRange, getStatusColor } from '@/lib/utils';
import { ArrowLeft, AlertTriangle, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { session } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Mock Payment state
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const loadBooking = () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    getBooking(id, session.access_token)
      .then((res) => {
        if (res.success) {
          setBooking(res.data);
        } else {
          setError(res.error?.message ?? 'Booking not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch booking details');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBooking();
  }, [id, session]);

  const handleCancelBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !booking) return;

    setCancelLoading(true);
    setCancelError(null);

    try {
      const res = await cancelBooking(booking.id, cancelReason || undefined, session.access_token);
      if (res.success) {
        setShowCancelModal(false);
        setBooking(res.data);
        router.refresh();
      } else {
        setCancelError(res.error?.message ?? 'Failed to cancel booking');
      }
    } catch (err: any) {
      setCancelError(err.message || 'Something went wrong while cancelling');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleMockPayment = async () => {
    if (!session || !booking) return;
    setPayLoading(true);
    setPayError(null);

    try {
      const { confirmBookingPayment } = await import('@/lib/api');
      const res = await confirmBookingPayment(booking.id);
      
      if (!res.success) {
        throw new Error('Failed to confirm dummy payment');
      }

      // Refresh page to load updated booking status (confirmed)
      setTimeout(() => {
        loadBooking();
        setPayLoading(false);
      }, 500);

    } catch (err: any) {
      setPayError(err.message || 'Payment simulation failed');
      setPayLoading(false);
    }
  };

  if (loading) return <div className="py-24"><LoadingSpinner message="Loading booking details..." /></div>;
  if (error || !booking) return <div className="py-24"><ErrorMessage message={error ?? 'Booking not found'} retry={loadBooking} /></div>;

  const car = booking.car;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <Link
        href="/bookings"
        className="inline-flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Bookings</span>
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header banner */}
        <div className="bg-gray-50 border-b px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div className="space-y-0.5">
            <span className="text-xs text-gray-400 font-mono">ID: {booking.id}</span>
            <h2 className="text-lg font-bold text-gray-900">
              {car ? `${car.make} ${car.model}` : 'Vehicle Booking'}
            </h2>
          </div>
          <span className={`self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        <div className="p-6 space-y-8">
          {/* Status Alert Banner */}
          {booking.status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex items-start space-x-3 text-sm text-yellow-800">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="font-medium">Booking pending payment. Complete payment to secure your vehicle.</p>
                {payError && <p className="text-red-700 text-xs">{payError}</p>}
                <Button size="sm" onClick={handleMockPayment} disabled={payLoading} className="bg-yellow-600 hover:bg-yellow-700 text-white border-0 shadow-none">
                  {payLoading ? 'Processing...' : 'Confirm & Pay (Simulate)'}
                </Button>
              </div>
            </div>
          )}

          {booking.status === 'confirmed' && (
            <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-start space-x-3 text-sm text-green-800">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Booking Confirmed & Paid!</p>
                <p className="text-xs text-green-600 mt-1">Present your driver license at pick-up location.</p>
              </div>
            </div>
          )}

          {booking.status === 'cancelled' && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start space-x-3 text-sm text-red-800">
              <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Booking Cancelled</p>
                {booking.cancellationReason && (
                  <p className="text-xs text-red-600 mt-1">Reason: {booking.cancellationReason}</p>
                )}
              </div>
            </div>
          )}

          {/* Booking Info Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 text-sm text-gray-600">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Rental Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-400">Date Range</span><span className="font-medium text-gray-800">{formatDateRange(booking.startDate, booking.endDate)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Total Duration</span><span className="font-medium text-gray-800">{booking.totalDays} days</span></div>
                {car && <div className="flex justify-between"><span className="text-gray-400">Pick-up Location</span><span className="font-medium text-gray-800">{car.location}</span></div>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Financial Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-gray-400">Daily Rate</span><span className="font-medium text-gray-800">{formatCurrency(booking.pricePerDay)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="font-medium text-gray-800">{formatCurrency(booking.totalAmount)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 border-t pt-2 mt-1">
                  <span>Total Charges</span>
                  <span className="text-blue-600">{formatCurrency(booking.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle specs info */}
          {car && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Vehicle Information</h3>
              <div className="flex items-center space-x-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="w-20 aspect-video rounded overflow-hidden bg-gray-100 shrink-0">
                  {car.primaryImageUrl ? (
                    <img src={car.primaryImageUrl} alt={car.model} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">🚗</div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{car.make} {car.model}</h4>
                  <p className="text-xs text-gray-400 capitalize">{car.transmission} | {car.seats} seats | {car.fuelType}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-2 border-t pt-6 text-sm">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-xs">Notes / Requests</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border italic">{booking.notes}</p>
            </div>
          )}

          {/* Trigger Cancellation */}
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <div className="border-t pt-6 flex justify-end">
              <Button variant="destructive" onClick={() => setShowCancelModal(true)}>
                Cancel Booking
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal Mock */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-xl border border-gray-100 max-w-sm w-full space-y-4">
            <h3 className="font-bold text-lg text-gray-900">Cancel Booking?</h3>
            <p className="text-sm text-gray-500">Are you sure you want to cancel this booking? This action is permanent.</p>

            <form onSubmit={handleCancelBooking} className="space-y-4">
              {cancelError && <p className="text-red-700 text-xs">{cancelError}</p>}
              <div>
                <Label htmlFor="cancel-reason">Reason for cancellation (optional)</Label>
                <Input
                  id="cancel-reason"
                  placeholder="e.g. Plans changed"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex space-x-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowCancelModal(false)} disabled={cancelLoading}>
                  Keep Booking
                </Button>
                <Button type="submit" variant="destructive" disabled={cancelLoading}>
                  {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
