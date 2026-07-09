'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { createBooking } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency, computeTotalDays, getTodayString, addDays } from '@/lib/utils';
import type { Car } from '@/types';
import { Calendar } from 'lucide-react';

export function BookingForm({ car }: { car: Car }) {
  const router = useRouter();
  const { user, session } = useAuth();

  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(addDays(getTodayString(), 1));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const totalDays = computeTotalDays(startDate, endDate);
  const pricePerDay = parseFloat(car.pricePerDay);
  const totalAmount = totalDays > 0 ? pricePerDay * totalDays : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || !session) {
      router.push(`/login?redirectTo=/cars/${car.id}`);
      return;
    }

    if (totalDays <= 0) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      const res = await createBooking(
        {
          carId: car.id,
          startDate,
          endDate,
          notes: notes || undefined,
        },
        session.access_token,
      );

      if (res.success) {
        router.push(`/bookings/${res.data.id}`);
      } else {
        setError(res.error?.message ?? 'Failed to create booking');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your dates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Book This Vehicle</h3>
        <p className="text-xs text-gray-400 mt-0.5">Fill in your preferred dates to request booking.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Date pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-date" className="flex items-center space-x-1.5 mb-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Start Date</span>
            </Label>
            <Input
              id="start-date"
              type="date"
              min={getTodayString()}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (e.target.value >= endDate) {
                  setEndDate(addDays(e.target.value, 1));
                }
              }}
              required
            />
          </div>
          <div>
            <Label htmlFor="end-date" className="flex items-center space-x-1.5 mb-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>End Date</span>
            </Label>
            <Input
              id="end-date"
              type="date"
              min={addDays(startDate, 1)}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Notes / Special Requests (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Let us know if you need child seats, GPS, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1.5"
            rows={3}
          />
        </div>
      </div>

      {/* Pricing Summary */}
      {totalDays > 0 && (
        <div className="bg-blue-50/50 p-4 rounded-lg space-y-2 border border-blue-50">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Daily Rate</span>
            <span>{formatCurrency(car.pricePerDay)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Rental Duration</span>
            <span>{totalDays} day{totalDays > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t pt-2 mt-1">
            <span>Total Cost</span>
            <span className="text-lg text-blue-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={loading || !car.isAvailable}>
        {!car.isAvailable
          ? 'Not Available'
          : !user
          ? 'Sign In to Book'
          : loading
          ? 'Creating booking...'
          : 'Request Booking'}
      </Button>
    </form>
  );
}
