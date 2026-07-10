'use client';

import { useEffect, useState, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCars } from '@/lib/api';
import type { Car, CarFilters as Filters } from '@/types';
import { CarCard } from '@/components/cars/car-card';
import { CarFilters } from '@/components/cars/car-filters';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorMessage } from '@/components/shared/error-message';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
function CarsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse filters from query string
  const filters: Filters = {
    category: (searchParams.get('category') as any) || undefined,
    transmission: (searchParams.get('transmission') as any) || undefined,
    fuelType: (searchParams.get('fuelType') as any) || undefined,
    location: searchParams.get('location') || undefined,
    make: searchParams.get('make') || undefined,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: 12,
  };

  const loadCars = () => {
    setLoading(true);
    setError(null);
    getCars(filters)
      .then((res) => {
        setCars(res.data);
        setTotal(res.pagination?.total ?? res.data.length);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while fetching vehicles');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCars();
  }, [searchParams]);

  const handleApplyFilters = (newFilters: Filters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    router.push(`/cars?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`/cars?${params.toString()}`);
  };

  const totalPages = Math.ceil(total / 12);
  const currentPage = filters.page || 1;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Explore Fleet</h1>
        <p className="text-slate-500 mt-2 text-lg">Browse, filter, and book from our high-quality rental selection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <CarFilters initialFilters={filters} onApply={handleApplyFilters} />
        </div>

        {/* Cars List Grid */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <LoadingSpinner message="Searching vehicles..." />
          ) : error ? (
            <ErrorMessage message={error} retry={loadCars} />
          ) : cars.length === 0 ? (
            <EmptyState
              title="No cars match your search"
              description="Try clearing your filters or picking a different search area."
            />
          ) : (
            <>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
              >
                {cars.map((car) => (
                  <motion.div key={car.id} variants={itemVariants}>
                    <CarCard car={car} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 pt-6 border-t">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="py-24"><LoadingSpinner message="Loading fleet..." /></div>}>
      <CarsPageContent />
    </Suspense>
  );
}
