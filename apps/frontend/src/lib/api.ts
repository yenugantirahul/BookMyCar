/**
 * api.ts — Real Supabase data layer replacing previous dummy/localStorage implementation.
 *
 * All functions accept a `supabase` client (SupabaseClient) that must be pre-authenticated
 * with the Clerk JWT.  In components, obtain it via the `useSupabaseClient()` hook.
 *
 * Public read functions (getCars, getCar) also accept a `publicSupabase` (anon) client.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { publicSupabase } from '@/lib/supabase/client';
import type { CarFilters, Car, CarImage, Booking, User } from '@/types';

// ── helpers ────────────────────────────────────────────────────────────────────

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Convert snake_case Supabase row to camelCase Car */
function rowToCar(row: any): Car {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    color: row.color,
    licensePlate: row.license_plate,
    pricePerDay: String(row.price_per_day),
    category: row.category,
    transmission: row.transmission,
    seats: row.seats,
    fuelType: row.fuel_type,
    location: row.location,
    description: row.description ?? null,
    isAvailable: row.is_available,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images: row.car_images
      ? row.car_images.map((img: any) => rowToCarImage(img))
      : undefined,
    primaryImageUrl: row.car_images
      ? (row.car_images.find((img: any) => img.is_primary)?.url ??
        row.car_images[0]?.url ??
        null)
      : null,
  };
}

function rowToCarImage(row: any): CarImage {
  return {
    id: row.id,
    carId: row.car_id,
    url: row.url,
    isPrimary: row.is_primary,
    displayOrder: row.display_order,
  };
}

function rowToBooking(row: any): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    carId: row.car_id,
    startDate: row.start_date,
    endDate: row.end_date,
    totalDays: row.total_days,
    pricePerDay: String(row.price_per_day),
    totalAmount: String(row.total_amount),
    status: row.status,
    notes: row.notes ?? null,
    cancellationReason: row.cancellation_reason ?? null,
    createdAt: row.created_at,
    car: row.cars ? rowToCar(row.cars) : undefined,
  };
}

function rowToProfile(row: any): User {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url ?? null,
    phone: row.phone ?? null,
    role: row.role,
    createdAt: row.created_at,
  };
}

// ── Cars ───────────────────────────────────────────────────────────────────────

export async function getCars(
  filters: CarFilters = {},
  supabase?: SupabaseClient,
): Promise<{ success: true; data: Car[]; pagination: { total: number; page: number; limit: number } }> {
  const client = supabase ?? publicSupabase;
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const offset = (page - 1) * limit;

  let query = client
    .from('cars')
    .select('*, car_images(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.category) query = query.eq('category', filters.category);
  if (filters.transmission) query = query.eq('transmission', filters.transmission);
  if (filters.fuelType) query = query.eq('fuel_type', filters.fuelType);
  if (filters.seats !== undefined) query = query.eq('seats', filters.seats);
  if (filters.isAvailable !== undefined) query = query.eq('is_available', filters.isAvailable);
  if (filters.location) query = query.ilike('location', `%${filters.location}%`);
  if (filters.make) query = query.ilike('make', `%${filters.make}%`);
  if (filters.minPrice !== undefined) query = query.gte('price_per_day', filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte('price_per_day', filters.maxPrice);

  // Sorting
  const sortMap: Record<string, string> = {
    price_per_day: 'price_per_day',
    year: 'year',
    created_at: 'created_at',
    seats: 'seats',
  };
  const sortCol = sortMap[filters.sortBy ?? 'created_at'] ?? 'created_at';
  const ascending = filters.sortOrder === 'asc';
  query = query.order(sortCol, { ascending });

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message, error.code);

  return {
    success: true,
    data: (data ?? []).map(rowToCar),
    pagination: { total: count ?? 0, page, limit },
  };
}

export async function getCar(
  id: string,
  supabase?: SupabaseClient,
): Promise<{ success: true; data: Car }> {
  const client = supabase ?? publicSupabase;

  const { data, error } = await client
    .from('cars')
    .select('*, car_images(*)')
    .eq('id', id)
    .single();

  if (error) throw new ApiError(error.code === 'PGRST116' ? 404 : 500, error.message);
  return { success: true, data: rowToCar(data) };
}

export async function createCar(
  payload: unknown,
  supabase: SupabaseClient,
): Promise<{ success: true; data: Car }> {
  const p = payload as any;
  const { data, error } = await supabase
    .from('cars')
    .insert({
      make: p.make,
      model: p.model,
      year: p.year,
      color: p.color,
      license_plate: p.licensePlate,
      price_per_day: p.pricePerDay,
      category: p.category,
      transmission: p.transmission,
      seats: p.seats,
      fuel_type: p.fuelType,
      location: p.location,
      description: p.description ?? null,
      is_available: p.isAvailable ?? true,
    })
    .select('*, car_images(*)')
    .single();

  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true, data: rowToCar(data) };
}

export async function updateCar(
  id: string,
  payload: unknown,
  supabase: SupabaseClient,
): Promise<{ success: true; data: Car }> {
  const p = payload as any;
  const { data, error } = await supabase
    .from('cars')
    .update({
      make: p.make,
      model: p.model,
      year: p.year,
      color: p.color,
      license_plate: p.licensePlate,
      price_per_day: p.pricePerDay,
      category: p.category,
      transmission: p.transmission,
      seats: p.seats,
      fuel_type: p.fuelType,
      location: p.location,
      description: p.description ?? null,
      is_available: p.isAvailable,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, car_images(*)')
    .single();

  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true, data: rowToCar(data) };
}

export async function deleteCar(
  id: string,
  supabase: SupabaseClient,
): Promise<{ success: true }> {
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true };
}

// ── Car Images ─────────────────────────────────────────────────────────────────

export async function uploadCarImage(
  carId: string,
  file: File,
  isPrimary: boolean,
  supabase: SupabaseClient,
): Promise<{ success: true; data: CarImage }> {
  // 1. Upload file to Supabase Storage
  const ext = file.name.split('.').pop() ?? 'jpg';
  const storagePath = `${carId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('car-images')
    .upload(storagePath, file, { upsert: false, contentType: file.type });

  if (uploadError) throw new ApiError(500, `Upload failed: ${uploadError.message}`);

  // 2. Get the public URL
  const { data: urlData } = supabase.storage.from('car-images').getPublicUrl(storagePath);
  const publicUrl = urlData.publicUrl;

  // 3. If primary, clear other primary flags first
  if (isPrimary) {
    await supabase
      .from('car_images')
      .update({ is_primary: false })
      .eq('car_id', carId);
  }

  // 4. Insert image record
  const { data, error } = await supabase
    .from('car_images')
    .insert({
      car_id: carId,
      url: publicUrl,
      storage_path: storagePath,
      is_primary: isPrimary,
      display_order: 0,
    })
    .select()
    .single();

  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true, data: rowToCarImage(data) };
}

export async function deleteCarImage(
  carId: string,
  imageId: string,
  supabase: SupabaseClient,
): Promise<{ success: true }> {
  // Get storage_path first so we can delete from storage
  const { data: imgRow } = await supabase
    .from('car_images')
    .select('storage_path')
    .eq('id', imageId)
    .single();

  const { error } = await supabase.from('car_images').delete().eq('id', imageId);
  if (error) throw new ApiError(500, error.message, error.code);

  // Delete from storage (best-effort)
  if (imgRow?.storage_path) {
    await supabase.storage.from('car-images').remove([imgRow.storage_path]);
  }

  return { success: true };
}

export async function setPrimaryImage(
  carId: string,
  imageId: string,
  supabase: SupabaseClient,
): Promise<{ success: true }> {
  // Clear all primary flags
  await supabase.from('car_images').update({ is_primary: false }).eq('car_id', carId);
  // Set new primary
  const { error } = await supabase
    .from('car_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .eq('car_id', carId);
  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true };
}

// ── Bookings ───────────────────────────────────────────────────────────────────

export async function getBookings(
  filters: { status?: string; page?: number; limit?: number } = {},
  supabase: SupabaseClient,
): Promise<{ success: true; data: Booking[]; pagination: { total: number; page: number; limit: number } }> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('bookings')
    .select('*, cars(*, car_images(*))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.status) query = query.eq('status', filters.status);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message, error.code);

  return {
    success: true,
    data: (data ?? []).map(rowToBooking),
    pagination: { total: count ?? 0, page, limit },
  };
}

export async function getBooking(
  id: string,
  supabase: SupabaseClient,
): Promise<{ success: true; data: Booking }> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cars(*, car_images(*))')
    .eq('id', id)
    .single();

  if (error) throw new ApiError(error.code === 'PGRST116' ? 404 : 500, error.message);
  return { success: true, data: rowToBooking(data) };
}

export async function createBooking(
  payload: { carId: string; startDate: string; endDate: string; notes?: string },
  userId: string,
  supabase: SupabaseClient,
): Promise<{ success: true; data: Booking }> {
  // Fetch car to get price
  const { data: carRow, error: carError } = await supabase
    .from('cars')
    .select('price_per_day')
    .eq('id', payload.carId)
    .single();

  if (carError) throw new ApiError(404, 'Car not found');

  const start = new Date(payload.startDate);
  const end = new Date(payload.endDate);
  const totalDays = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const pricePerDay = parseFloat(carRow.price_per_day);
  const totalAmount = (totalDays * pricePerDay).toFixed(2);

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      car_id: payload.carId,
      start_date: payload.startDate,
      end_date: payload.endDate,
      total_days: totalDays,
      price_per_day: pricePerDay,
      total_amount: totalAmount,
      status: 'pending',
      notes: payload.notes ?? null,
    })
    .select('*, cars(*, car_images(*))')
    .single();

  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true, data: rowToBooking(data) };
}

export async function cancelBooking(
  id: string,
  reason: string | undefined,
  supabase: SupabaseClient,
): Promise<{ success: true; data: Booking }> {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancellation_reason: reason ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, cars(*, car_images(*))')
    .single();

  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true, data: rowToBooking(data) };
}

export async function confirmBookingPayment(
  id: string,
  supabase: SupabaseClient,
): Promise<{ success: true; data: Booking }> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, cars(*, car_images(*))')
    .single();

  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true, data: rowToBooking(data) };
}

export async function updateBookingStatus(
  id: string,
  status: string,
  supabase: SupabaseClient,
): Promise<{ success: true; data: Booking }> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, cars(*, car_images(*))')
    .single();

  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true, data: rowToBooking(data) };
}

// ── Admin Bookings ─────────────────────────────────────────────────────────────

export async function getAdminBookings(
  filters: { status?: string; page?: number; limit?: number } = {},
  supabase: SupabaseClient,
): Promise<{ success: true; data: Booking[]; pagination: { total: number; page: number; limit: number } }> {
  // Same as getBookings — RLS admin policy allows admins to see all
  return getBookings(filters, supabase);
}

// ── Profile ────────────────────────────────────────────────────────────────────

export async function getProfile(
  userId: string,
  supabase: SupabaseClient,
): Promise<{ success: true; data: User }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new ApiError(error.code === 'PGRST116' ? 404 : 500, error.message);
  return { success: true, data: rowToProfile(data) };
}

export async function updateProfile(
  userId: string,
  payload: { fullName?: string; phone?: string },
  supabase: SupabaseClient,
): Promise<{ success: true; data: User }> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: payload.fullName,
      phone: payload.phone ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw new ApiError(500, error.message, error.code);
  return { success: true, data: rowToProfile(data) };
}

export { ApiError };
