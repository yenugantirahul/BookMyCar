import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/bookings/[id]/status
 * Allows admins to update the booking status directly via Supabase.
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return NextResponse.json(
      { success: false, error: { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` } },
      { status: 400 },
    );
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

  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: { id: data.id, status: data.status } });
}
