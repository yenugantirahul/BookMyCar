import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/profile
 * Returns the current user's profile from Supabase.
 * Uses the service role key so RLS doesn't block the read.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    // Profile might not exist yet (race with sync-profile) — return a safe fallback
    return NextResponse.json(
      { success: false, error: { message: error?.message ?? 'Profile not found' } },
      { status: error?.code === 'PGRST116' ? 404 : 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone ?? null,
      avatarUrl: data.avatar_url ?? null,
      role: data.role,
      createdAt: data.created_at,
    },
  });
}

/**
 * PUT /api/profile
 * Updates the current user's profile.
 */
export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 });
  }

  const body = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: body.fullName,
      phone: body.phone ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone ?? null,
      avatarUrl: data.avatar_url ?? null,
      role: data.role,
      createdAt: data.created_at,
    },
  });
}
