'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Car as CarIcon, MapPin, Calendar, Star, ShieldCheck, Heart } from 'lucide-react';
import { getCars } from '@/lib/api';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import type { Car } from '@/types';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function HomePage() {
  const router = useRouter();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    // Fetch featured cars (e.g. limit 3)
    getCars({ limit: 3, isAvailable: true })
      .then((res) => {
        if (res.success) {
          setFeaturedCars(res.data);
        }
      })
      .catch((err) => console.error('Failed to load featured cars:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (location) query.set('location', location);
    if (category) query.set('category', category);
    router.push(`/cars?${query.toString()}`);
  };

  const categories = [
    { id: 'economy', label: 'Economy', count: 'Affordable & efficient', icon: CarIcon },
    { id: 'standard', label: 'Standard', count: 'Reliable everyday drives', icon: CarIcon },
    { id: 'premium', label: 'Premium', count: 'Extra comfort & features', icon: Star },
    { id: 'suv', label: 'SUV', count: 'Spacious & powerful', icon: MapPin },
    { id: 'luxury', label: 'Luxury', count: 'Ultimate style & status', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-5xl space-y-8 relative">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
              Find and Book Your Perfect Car in Minutes
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 font-light">
              Explore our wide fleet of top-tier cars for any event, travel, or trip. Low prices guaranteed.
            </p>
          </div>

          {/* Search Form Card */}
          <form
            onSubmit={handleSearch}
            className="bg-white text-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Pickup Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, airport, or address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                Car Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-[42px]"
              >
                <option value="">All Categories</option>
                <option value="economy">Economy</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center space-x-2 h-[42px]"
            >
              <Search className="h-5 w-5" />
              <span>Search Cars</span>
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 max-w-5xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Browse by Category</h2>
          <p className="text-gray-500">Pick the category that fits your travel style best.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/cars?category=${cat.id}`}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all text-center space-y-3 flex flex-col items-center"
              >
                <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{cat.label}</h3>
                  <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="container mx-auto px-4 max-w-5xl space-y-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Vehicles</h2>
            <p className="text-gray-500 mt-1">Our most popular and highly rated rentals.</p>
          </div>
          <Link
            href="/cars"
            className="text-sm font-semibold text-blue-600 hover:text-blue-500 flex items-center space-x-1"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : featuredCars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No vehicles available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative aspect-video w-full bg-gray-100 flex items-center justify-center overflow-hidden">
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
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Year: {car.year}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 border-y py-2.5">
                    <div>⚙ {car.transmission}</div>
                    <div>⛽ {car.fuelType}</div>
                    <div>👥 {car.seats} Seats</div>
                    <div>📍 {car.location}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
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
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
