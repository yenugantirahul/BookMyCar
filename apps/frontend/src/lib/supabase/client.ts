import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase browser client.
 * For authenticated operations (RLS), inject the Clerk JWT as accessToken.
 * Use `useSupabaseClient()` hook in components instead of calling this directly.
 */
export function createClient(accessToken?: string) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    accessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      : undefined,
  );
}

/** Public (anon) client — no auth, for reading public data like cars listing */
export const publicSupabase = createClient();
