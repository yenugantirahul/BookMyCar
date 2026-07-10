'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers';
import { useSupabaseClient } from '@/hooks/use-supabase-client';
import { getProfile, updateProfile } from '@/lib/api';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';
import { Check } from 'lucide-react';

export default function ProfilePage() {
  const { user, session } = useAuth();
  const supabase = useSupabaseClient();

  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const loadProfile = () => {
    if (!session || !user) return;
    setLoading(true);
    setError(null);
    getProfile(user.id, supabase)
      .then((res) => {
        setProfile(res.data);
        setFullName(res.data.fullName ?? '');
        setPhone(res.data.phone ?? '');
      })
      .catch((err) => setError(err.message || 'Something went wrong while fetching profile'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, [session, user?.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !user) return;

    setUpdateLoading(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      const res = await updateProfile(user.id, { fullName, phone }, supabase);
      setProfile(res.data);
      setUpdateSuccess(true);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update profile details');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading)
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading your profile..." />
      </div>
    );
  if (error || !profile)
    return (
      <div className="py-24">
        <ErrorMessage message={error ?? 'Profile not found'} retry={loadProfile} />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-sans">
          Account Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your public credentials and personal information.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-8">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {updateError && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
              {updateError}
            </div>
          )}
          {updateSuccess && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200 flex items-center space-x-1.5">
              <Check className="h-4 w-4" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profile-email">Email Address</Label>
              <Input
                id="profile-email"
                type="email"
                value={profile.email}
                disabled
                className="mt-1.5 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <Label htmlFor="profile-role">Account Role</Label>
              <Input
                id="profile-role"
                type="text"
                value={profile.role}
                disabled
                className="mt-1.5 bg-gray-50 text-gray-500 cursor-not-allowed capitalize"
              />
            </div>
            <div>
              <Label htmlFor="profile-fullname">Full Name</Label>
              <Input
                id="profile-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="profile-phone">Phone Number</Label>
              <Input
                id="profile-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5"
                placeholder="e.g. +1 555-0199"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={updateLoading}>
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
