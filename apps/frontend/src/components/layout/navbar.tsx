'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers';
import { useRouter } from 'next/navigation';
import { Car, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/api';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="relative px-2 py-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors group">
      {children}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] w-full bg-indigo-600 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
    </Link>
  );
};

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 font-black text-xl tracking-tight text-slate-900 group">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:bg-slate-900 transition-colors shadow-sm">
            <Car className="h-5 w-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">BookMyCar</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="/cars">Browse Fleet</NavLink>
          {user && (
            <>
              <NavLink href="/bookings">My Bookings</NavLink>
              <NavLink href="/profile">Profile</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-1 text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-full hover:bg-indigo-600 transition-all shadow-sm"
                >
                  <Shield className="h-3 w-3" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <button className="text-sm font-semibold bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-indigo-500/25">
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
