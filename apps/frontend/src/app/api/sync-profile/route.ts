import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/sync-profile
 * Called after Clerk sign-in/sign-up to upsert the user's profile row in Supabase.
 * Uses the SERVICE ROLE key to bypass RLS for the upsert operation.
 */
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Use service role key to bypass RLS for profile creation
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const email = user.emailAddresses[0]?.emailAddress ?? '';
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || email.split('@')[0];
  const avatarUrl = user.imageUrl ?? null;

  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'id',
      ignoreDuplicates: false, // always update email/name/avatar
    },
  );

  if (error) {
    console.error('[sync-profile] Supabase upsert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
