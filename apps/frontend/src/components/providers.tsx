'use client';

import * as React from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';

export function useAuth() {
  const { user, isLoaded } = useUser();
  const { getToken, signOut } = useClerkAuth();

  // Create a mock session object for existing mock APIs to work seamlessly
  const session = React.useMemo(() => user ? { access_token: 'dummy_clerk_token' } : null, [user]);
  const mockUser = React.useMemo(() => user ? { 
    email: user.primaryEmailAddress?.emailAddress, 
    id: user.id 
  } : null, [user]);

  return {
    user: mockUser,
    session,
    loading: !isLoaded,
    signOut: async () => {
      await signOut();
    }
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  // With Clerk, the root ClerkProvider handles context, so this is just a pass-through wrapper
  return <>{children}</>;
}
