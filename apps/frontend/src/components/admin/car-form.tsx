'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Car } from '@/types';

interface CarFormProps {
  initialData?: Car;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  submitButtonText: string;
}

export function CarForm({ initialData, onSubmit, loading, submitButtonText }: CarFormProps) {
  const [make, setMake] = useState(initialData?.make ?? '');
  const [model, setModel] = useState(initialData?.model ?? '');
  const [year, setYear] = useState(initialData?.year ? String(initialData.year) : new Date().getFullYear().toString());
  const [color, setColor] = useState(initialData?.color ?? '');
  const [licensePlate, setLicensePlate] = useState(initialData?.licensePlate ?? '');
  const [pricePerDay, setPricePerDay] = useState(initialData?.pricePerDay ? String(initialData.pricePerDay) : '');
  const [category, setCategory] = useState(initialData?.category ?? 'standard');
  const [transmission, setTransmission] = useState(initialData?.transmission ?? 'automatic');
  const [seats, setSeats] = useState(initialData?.seats ? String(initialData.seats) : '5');
  const [fuelType, setFuelType] = useState(initialData?.fuelType ?? 'petrol');
  const [location, setLocation] = useState(initialData?.location ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [isAvailable, setIsAvailable] = useState(initialData?.isAvailable ?? true);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      make: make.trim(),
      model: model.trim(),
      year: parseInt(year),
      color: color.trim(),
      licensePlate: licensePlate.trim().toUpperCase(),
      pricePerDay: parseFloat(pricePerDay),
      category,
      transmission,
      seats: parseInt(seats),
      fuelType,
      location: location.trim(),
      description: description.trim() || undefined,
      isAvailable,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || 'Validation failed. Please verify inputs.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="car-make">Brand / Make</Label>
          <Input id="car-make" value={make} onChange={(e) => setMake(e.target.value)} required placeholder="e.g. Toyota" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="car-model">Model</Label>
          <Input id="car-model" value={model} onChange={(e) => setModel(e.target.value)} required placeholder="e.g. Camry" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="car-year">Year</Label>
          <Input id="car-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="car-color">Color</Label>
          <Input id="car-color" value={color} onChange={(e) => setColor(e.target.value)} required placeholder="e.g. Black" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="car-license">License Plate</Label>
          <Input id="car-license" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} required placeholder="e.g. 7XYZ99" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="car-price">Price Per Day (USD)</Label>
          <Input id="car-price" type="number" step="0.01" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} required placeholder="50.00" className="mt-1" />
        </div>

        <div>
          <Label>Category</Label>
          <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className="w-full mt-1 border px-3 py-2 rounded-md bg-gray-50 h-[40px] text-sm focus:outline-none">
            <option value="economy">Economy</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="suv">SUV</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div>
          <Label>Transmission</Label>
          <select value={transmission} onChange={(e) => setTransmission(e.target.value as typeof transmission)} className="w-full mt-1 border px-3 py-2 rounded-md bg-gray-50 h-[40px] text-sm focus:outline-none">
            <option value="manual">Manual</option>
            <option value="automatic">Automatic</option>
          </select>
        </div>

        <div>
          <Label htmlFor="car-seats">Seats</Label>
          <Input id="car-seats" type="number" value={seats} onChange={(e) => setSeats(e.target.value)} required className="mt-1" />
        </div>

        <div>
          <Label>Fuel Type</Label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value as typeof fuelType)} className="w-full mt-1 border px-3 py-2 rounded-md bg-gray-50 h-[40px] text-sm focus:outline-none">
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="car-location">Pickup Location</Label>
          <Input id="car-location" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g. San Francisco Airport" className="mt-1" />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="car-description">Description</Label>
          <Textarea id="car-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide information about features, conditions, etc." className="mt-1" rows={4} />
        </div>

        <div className="sm:col-span-2 flex items-center space-x-2.5">
          <input
            id="car-available"
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="h-4.5 w-4.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <Label htmlFor="car-available" className="cursor-pointer font-medium text-gray-700">
            Available for Rent
          </Label>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
