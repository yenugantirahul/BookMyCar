'use client';

import { useState } from 'react';
import type { CarFilters as Filters } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Constants defined locally below
import { Filter, X } from 'lucide-react';

const CATEGORIES = ['economy', 'standard', 'premium', 'suv', 'luxury'];
const TRANSMISSIONS = ['manual', 'automatic'];
const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid'];

export function CarFilters({
  initialFilters,
  onApply,
}: {
  initialFilters: Filters;
  onApply: (filters: Filters) => void;
}) {
  const [make, setMake] = useState(initialFilters.make ?? '');
  const [category, setCategory] = useState(initialFilters.category ?? '');
  const [transmission, setTransmission] = useState(initialFilters.transmission ?? '');
  const [fuelType, setFuelType] = useState(initialFilters.fuelType ?? '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice ? String(initialFilters.minPrice) : '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice ? String(initialFilters.maxPrice) : '');
  const [location, setLocation] = useState(initialFilters.location ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({
      make: make || undefined,
      category: (category as any) || undefined,
      transmission: (transmission as any) || undefined,
      fuelType: (fuelType as any) || undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      location: location || undefined,
    });
  };

  const handleClear = () => {
    setMake('');
    setCategory('');
    setTransmission('');
    setFuelType('');
    setMinPrice('');
    setMaxPrice('');
    setLocation('');
    onApply({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-100 space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="font-bold text-gray-900 flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span>Filters</span>
        </h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-blue-600 flex items-center space-x-1"
        >
          <X className="h-3 w-3" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Search by Make */}
        <div>
          <Label htmlFor="filter-make">Make / Brand</Label>
          <Input
            id="filter-make"
            placeholder="e.g. Toyota, Tesla"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="filter-location">Location</Label>
          <Input
            id="filter-location"
            placeholder="e.g. San Francisco"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-[40px] text-sm"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <Label>Transmission</Label>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-[40px] text-sm"
          >
            <option value="">All Transmissions</option>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <Label>Fuel Type</Label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full mt-1 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 h-[40px] text-sm"
          >
            <option value="">All Fuel Types</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-1">
          <Label>Price Per Day (USD)</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Input
              placeholder="Min"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Max"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Apply Filters
      </Button>
    </form>
  );
}
