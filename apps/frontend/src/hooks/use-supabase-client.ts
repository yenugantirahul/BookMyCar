'use client';

import { useSession } from '@clerk/nextjs';
import { createBrowserClient } from '@supabase/ssr';
import { useMemo } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns a memoized Supabase browser client pre-authenticated with the current Clerk JWT.
 * On every Supabase request, it fetches a fresh Clerk token (cached internally by Clerk).
 * RLS policies use `auth.jwt() ->> 'sub'` which matches the Clerk user ID.
 *
 * Usage in client components:
 *   const supabase = useSupabaseClient();
 *   const { data } = await supabase.from('bookings').select('*');
 */
export function useSupabaseClient(): SupabaseClient {
  const { session } = useSession();

  return useMemo(() => {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url: RequestInfo | URL, options: RequestInit = {}) => {
            // Clerk caches this token and refreshes it automatically
            const token = session
              ? await session.getToken({ template: 'supabase' })
              : null;

            const headers = new Headers(options.headers);
            if (token) headers.set('Authorization', `Bearer ${token}`);

            return fetch(url, { ...options, headers });
          },
        },
      },
    );
    // Re-create when session changes (login/logout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);
}
