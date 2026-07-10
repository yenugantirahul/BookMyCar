'use client';

import * as React from 'react';
import { useUser, useAuth as useClerkAuth, useSession } from '@clerk/nextjs';

/**
 * Unified auth hook — wraps Clerk and exposes user info + Supabase token helper.
 * All components that previously used `session.access_token` should now call
 * `getSupabaseToken()` to get the Clerk JWT for Supabase RLS.
 */
export function useAuth() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const { session } = useSession();

  const mockUser = React.useMemo(
    () =>
      user
        ? {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? '',
          }
        : null,
    [user],
  );

  // Kept for backward compatibility — components that check `session` truthy
  const mockSession = React.useMemo(
    () => (user ? { access_token: 'clerk_managed' } : null),
    [user],
  );

  const getSupabaseToken = React.useCallback(async (): Promise<string | null> => {
    if (!session) return null;
    return session.getToken({ template: 'supabase' });
  }, [session]);

  return {
    user: mockUser,
    session: mockSession,
    loading: !isLoaded,
    getSupabaseToken,
    signOut: async () => signOut(),
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
