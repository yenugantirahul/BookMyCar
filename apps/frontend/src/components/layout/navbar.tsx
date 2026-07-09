'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { Car, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/api';
import { SignInButton, UserButton } from '@clerk/nextjs';

export function Navbar() {
  const { user, session, signOut } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && session) {
      // Fetch profile to check role
      getProfile(session.access_token)
        .then((res) => {
          if (res.success && res.data?.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        })
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // No longer need manual sign out since UserButton handles it.

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-blue-600">
          <Car className="h-6 w-6" />
          <span>CarRental</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/cars" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Browse Cars
          </Link>
          {user && (
            <>
              <Link href="/bookings" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                My Bookings
              </Link>
              <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Profile
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 text-xs font-semibold bg-red-50 text-red-700 px-2.5 py-1 rounded-full hover:bg-red-100 transition-colors"
                >
                  <Shield className="h-3 w-3" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <button className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
