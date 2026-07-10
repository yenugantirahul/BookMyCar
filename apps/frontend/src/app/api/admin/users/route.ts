import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/admin/users
 * Returns all user profiles for admins — directly from Supabase using the service role.
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

  // Verify caller is admin
  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ success: false, error: { message: 'Forbidden' } }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: { message: error.message } }, { status: 500 });
  }

  const users = (data ?? []).map((row: any) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone ?? null,
    avatarUrl: row.avatar_url ?? null,
    role: row.role,
    createdAt: row.created_at,
  }));

  return NextResponse.json({ success: true, data: users });
}
