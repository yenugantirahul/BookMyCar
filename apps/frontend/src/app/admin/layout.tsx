'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { Shield, Car, Calendar, Users, Home } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirectTo=/admin');
      return;
    }

    if (user) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((res) => {
          if (res.success && res.data?.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        })
        .catch(() => setIsAdmin(false));
    }
  }, [user, loading]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Checking permissions..." />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-center">
        <div className="space-y-4 max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 text-sm">
            You do not have administrative permissions required to access this dashboard.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { href: '/admin', label: 'Overview', icon: Home },
    { href: '/admin/cars', label: 'Manage Cars', icon: Car },
    { href: '/admin/bookings', label: 'Manage Bookings', icon: Calendar },
    { href: '/admin/users', label: 'Manage Users', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 space-x-2 text-red-600 font-bold">
          <Shield className="h-5 w-5" />
          <span className="tracking-wider uppercase text-sm font-extrabold">Admin Hub</span>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main dashboard content container */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
