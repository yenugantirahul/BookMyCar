// Types shared between frontend components and API calls

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}

export type CarCategory = 'economy' | 'standard' | 'premium' | 'suv' | 'luxury';
export type CarTransmission = 'manual' | 'automatic';
export type CarFuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';

export interface CarImage {
  id: string;
  carId: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  pricePerDay: string;
  category: CarCategory;
  transmission: CarTransmission;
  seats: number;
  fuelType: CarFuelType;
  location: string;
  description: string | null;
  isAvailable: boolean;
  createdAt: string;
  images?: CarImage[];
  primaryImageUrl?: string | null;
}

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: string;
  totalAmount: string;
  status: BookingStatus;
  notes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  car?: Car;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  requestId?: string;
}

export interface CarFilters {
  category?: CarCategory;
  transmission?: CarTransmission;
  fuelType?: CarFuelType;
  location?: string;
  make?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  isAvailable?: boolean;
  sortBy?: 'price_per_day' | 'year' | 'created_at' | 'seats';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
