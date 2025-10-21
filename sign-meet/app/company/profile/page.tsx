'use client';
import ProfileSettingsPage from '@/app/components/settings/ProfileSettingsPage';

export default function CompanyProfile() {
  const companyData = {
    username: '@tech_corp',
    email: 'hr@techcorp.com',
    phone: '+1 (555) 987-6543',
    initials: 'TC',
    fullName: 'Tech Corporation'
  };

  const handleSave = () => {
    console.log('Saving company data:');
    // API call to save company data
  };

  const handleDelete = () => {
    console.log('Deleting company account');
    // API call to delete account
  };

  const handleDeactivate = () => {
    console.log('Deactivating company account');
    // API call to deactivate account
  };

  return (
    <ProfileSettingsPage
      initialData={companyData}
      userType="company"
      onSave={handleSave}
      onDelete={handleDelete}
      onDeactivate={handleDeactivate}
    />
  );
}