'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { createCar } from '@/lib/api';
import { CarForm } from '@/components/admin/car-form';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AdminNewCarPage() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload: any) => {
    if (!session) return;
    setLoading(true);

    try {
      const res = await createCar(payload, session.access_token);
      if (res.success) {
        // Redirect to edit page so user can upload images
        router.push(`/admin/cars/${res.data.id}/edit`);
      } else {
        throw new Error(res.error?.message ?? 'Failed to create vehicle');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/admin/cars"
        className="inline-flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Fleet</span>
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add New Vehicle</h1>
        <p className="text-gray-500 mt-1">Enter specifications to introduce a new car to the fleet.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <CarForm
            onSubmit={handleSubmit}
            loading={loading}
            submitButtonText="Create Vehicle & Next"
          />
        </CardContent>
      </Card>
    </div>
  );
}
