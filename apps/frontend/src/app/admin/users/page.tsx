'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { getTodayString } from '@/lib/utils';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const { session } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = () => {
    if (!session) return;
    setLoading(true);
    setError(null);

    // Call BFF proxy endpoint
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((res) => {
        if (res.success || Array.isArray(res.data)) {
          setUsers(res.data || res);
        } else {
          setError(res.error?.message ?? 'Failed to load users list');
        }
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong while retrieving profiles');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, [session]);

  if (loading) return <LoadingSpinner message="Retrieving registered profiles..." />;

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Users</h1>
        <p className="text-gray-500 mt-1">Review profiles and roles across the platform.</p>
      </div>

      {error ? (
        <ErrorMessage message={error} retry={loadUsers} />
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            No registered users found.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Users Directory ({users.length} profiles)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Profile</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center text-xs font-bold text-gray-500 capitalize">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              (u.fullName || u.email).charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{u.fullName || 'No Name'}</div>
                            <div className="text-xs text-gray-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-600">{u.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                          u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-gray-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
