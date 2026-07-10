'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Invisible component that syncs Clerk user data to Supabase profiles table.
 * Called once when a user is signed in. Uses the /api/sync-profile server route.
 * Place this inside ClerkProvider in the root layout.
 */
export function SyncProfile() {
  const { user, isLoaded } = useUser();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || hasSynced.current) return;

    hasSynced.current = true;

    fetch('/api/sync-profile', { method: 'POST' }).catch((err) => {
      console.warn('[SyncProfile] Failed to sync profile:', err);
    });
  }, [isLoaded, user?.id]);

  return null;
}
