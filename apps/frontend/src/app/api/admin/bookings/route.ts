import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/bookings
 * Returns all bookings for admins — directly from Supabase using the service role.
 * Verifies the caller is an admin before returning data.
 */
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Verify caller is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ success: false, error: { message: 'Forbidden' } }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '50');
  const offset = (page - 1) * limit;

  let query = supabase
    .from('bookings')
    .select('*, cars(*, car_images(*))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }

  // Map snake_case → camelCase
  const bookings = (data ?? []).map((row: any) => ({
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
    car: row.cars
      ? {
          id: row.cars.id,
          make: row.cars.make,
          model: row.cars.model,
          year: row.cars.year,
          color: row.cars.color,
          licensePlate: row.cars.license_plate,
          pricePerDay: String(row.cars.price_per_day),
          category: row.cars.category,
          transmission: row.cars.transmission,
          seats: row.cars.seats,
          fuelType: row.cars.fuel_type,
          location: row.cars.location,
          description: row.cars.description ?? null,
          isAvailable: row.cars.is_available,
          createdAt: row.cars.created_at,
          updatedAt: row.cars.updated_at,
        }
      : undefined,
  }));

  return NextResponse.json({
    success: true,
    data: bookings,
    pagination: { total: count ?? 0, page, limit },
  });
}
