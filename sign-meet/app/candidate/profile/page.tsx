'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import ProfileSettingsPage from '@/app/components/settings/ProfileSettingsPage';
import { getUserProfile, updateUserProfile } from '@/lib/api/auth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileData {
  fullName: string;
  email: string;
  rslProficiencyLevel?: string; // make optional to match ProfileSettingsPage type
  initials?: string;
}

export default function CandidateProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
    rslProficiencyLevel: '',
    initials: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { profile, error } = await getUserProfile(user.id);

        if (error) {
          toast.error('Failed to load profile');
          return;
        }

        if (profile) {
          setProfileData({
            fullName: profile.fullName || '',
            email: profile.email || '',
            rslProficiencyLevel: profile.rslProficiencyLevel || '',
            initials: profile.fullName?.substring(0, 2).toUpperCase() || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (data: ProfileData) => {
    if (!user) return;

    try {
      const { success, error } = await updateUserProfile(user.id, {
        fullName: data.fullName,
        rslProficiencyLevel: data.rslProficiencyLevel ?? '' // handle undefined safely
      });

      if (success) {
        toast.success('Profile updated successfully!');
        setProfileData(data);
      } else {
        toast.error(error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      // TODO: Implement account deletion API
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to deactivate your account?')) {
      return;
    }

    try {
      // TODO: Implement account deactivation API
      toast.success('Account deactivated successfully');
    } catch (error) {
      console.error('Error deactivating account:', error);
      toast.error('Failed to deactivate account');
    }
  };

  if (loading) {
    return (
      <div className="max-w-full mx-12 mt-5 p-6 md:p-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <ProfileSettingsPage
      initialData={profileData}
      userType="candidate"
      onSave={handleSave}
      onDelete={handleDelete}
      onDeactivate={handleDeactivate}
    />
  );
}
