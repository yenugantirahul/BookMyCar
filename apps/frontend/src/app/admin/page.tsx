'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers';
import { getCars, getAdminBookings } from '@/lib/api';
import type { Car, Booking } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDateRange, getStatusColor } from '@/lib/utils';
import { Car as CarIcon, Calendar, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    if (!session) return;
    setLoading(true);
    setError(null);

    try {
      const [carsRes, bookingsRes] = await Promise.all([
        getCars({ limit: 100 }), // Load up to 100 for aggregation
        getAdminBookings({ limit: 100 }, session.access_token),
      ]);

      if (carsRes.success && bookingsRes.success) {
        setCars(carsRes.data);
        setBookings(bookingsRes.data);
      } else {
        setError(carsRes.error?.message || bookingsRes.error?.message || 'Failed to load stats');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while retrieving dashboard details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  if (loading) return <LoadingSpinner message="Calculating dashboard statistics..." />;
  if (error) return <ErrorMessage message={error} retry={loadDashboardData} />;

  // Aggregate metrics
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.isAvailable).length;
  const totalBookingsCount = bookings.length;
  const activeBookingsCount = bookings.filter((b) => b.status === 'active' || b.status === 'confirmed').length;

  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);

  const recentBookings = bookings.slice(0, 5);

  const statCards = [
    { title: 'Total Fleet', value: totalCars, desc: `${availableCars} available`, icon: CarIcon, color: 'text-blue-600' },
    { title: 'Total Bookings', value: totalBookingsCount, desc: `${activeBookingsCount} active/paid`, icon: Calendar, color: 'text-green-600' },
    { title: 'Total Revenue', value: formatCurrency(totalRevenue), desc: 'Excluding cancellations', icon: DollarSign, color: 'text-yellow-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Real-time usage and financial health metrics.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No bookings created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-mono text-xs">{b.id.slice(0, 8)}...</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {b.car ? `${b.car.make} ${b.car.model}` : 'Vehicle'}
                      </td>
                      <td className="px-4 py-3 text-xs">{formatDateRange(b.startDate, b.endDate)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(b.totalAmount)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
