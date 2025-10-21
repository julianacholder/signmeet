'use client';
import ProfileSettingsPage from '@/app/components/settings/ProfileSettingsPage';

export default function CandidateProfile() {
  const candidateData = {
    username: '@juliana_dev',
    email: 'juliana@example.com',
    phone: '+1 (555) 123-4567',
    initials: 'JD',
    fullName: 'Juliana Developer'
  };

  const handleSave = () => {
    console.log('Saving candidate data:');
    // API call to save candidate data
  };

  const handleDelete = () => {
    console.log('Deleting candidate account');
    // API call to delete account
  };

  const handleDeactivate = () => {
    console.log('Deactivating candidate account');
    // API call to deactivate account
  };

  return (
    <ProfileSettingsPage
      initialData={candidateData}
      userType="candidate"
      onSave={handleSave}
      onDelete={handleDelete}
      onDeactivate={handleDeactivate}
    />
  );
}