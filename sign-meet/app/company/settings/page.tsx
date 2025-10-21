'use client';

import { useState } from 'react';
import SettingsPage from '@components/settings/SettingsPage';

export default function CompanySettings() {
  // Static default settings data for company
  const [settings] = useState({
    theme: 'light' as 'light' | 'dark',
    language: 'English',
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      interviewReminders: true,
      rescheduledAlerts: true,
      // Note: newJobAlerts not included for company
    },
    privacy: {
      profileVisibility: 'public' as 'public' | 'private' | 'contacts',
      showEmail: true,
      showPhone: true,
    },
    video: {
      videoQuality: 'high' as 'auto' | 'high' | 'medium' | 'low',
      cameraEnabled: true,
      microphoneEnabled: true,
    },
    communication: {
      preferredSignLanguage: 'RSL (Rwandan Sign Language)',
      interpreterPreference: 'AI-Powered Interpretation',
    },
  });

  const handleSave = (settingsData: any) => {
    console.log('Company settings saved:', settingsData);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    console.log('Company settings reset to default');
    alert('Settings reset to default');
  };

  return (
    <SettingsPage
      initialSettings={settings}
      userType="company"
      onSave={handleSave}
      onReset={handleReset}
    />
  );
}