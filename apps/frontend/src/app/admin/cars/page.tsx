'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers';
import { getCars, deleteCar } from '@/lib/api';
import type { Car } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminCarsPage() {
  const { session } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCars = () => {
    setLoading(true);
    setError(null);
    getCars({ limit: 100 })
      .then((res) => {
        if (res.success) {
          setCars(res.data);
        } else {
          setError(res.error?.message ?? 'Failed to fetch vehicles');
        }
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while fetching vehicles');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleDelete = async (carId: string) => {
    if (!session || !confirm('Are you sure you want to delete this vehicle? This action is permanent.')) return;

    try {
      const res = await deleteCar(carId, session.access_token);
      if (res.success) {
        setCars((prev) => prev.filter((c) => c.id !== carId));
      } else {
        alert(res.error?.message ?? 'Failed to delete vehicle');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete vehicle');
    }
  };

  if (loading) return <LoadingSpinner message="Retrieving fleet inventory..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Fleet</h1>
          <p className="text-gray-500 mt-1">Add, update, or remove vehicles from the rental fleet.</p>
        </div>
        <Link href="/admin/cars/new">
          <Button className="flex items-center space-x-1">
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
          </Button>
        </Link>
      </div>

      {error ? (
        <ErrorMessage message={error} retry={loadCars} />
      ) : cars.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-gray-500 space-y-4">
            <p>Your fleet inventory is empty.</p>
            <Link href="/admin/cars/new">
              <Button>Create Your First Vehicle</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Fleet Catalog ({cars.length} vehicles)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Daily Rate</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center space-x-3">
                          <span className="text-base">🚗</span>
                          <div>
                            <div>{car.make} {car.model}</div>
                            <div className="text-xs text-gray-400 font-mono">{car.licensePlate} ({car.year})</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize">{getCategoryLabel(car.category)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(car.pricePerDay)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${
                          car.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {car.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/cars/${car.id}/edit`}>
                            <Button variant="outline" size="icon" title="Edit Vehicle">
                              <Edit2 className="h-4 w-4 text-gray-600" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Delete Vehicle"
                            onClick={() => handleDelete(car.id)}
                            className="hover:bg-red-50 hover:border-red-200"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
