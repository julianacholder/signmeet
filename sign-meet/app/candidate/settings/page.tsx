'use client';

import { useState } from 'react';
import SettingsPage from '@components/settings/SettingsPage';

export default function CandidateSettings() {
  // Static default settings data
  const [settings] = useState({
    theme: 'light' as 'light' | 'dark',
    language: 'English',
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      interviewReminders: true,
      rescheduledAlerts: true,
      newJobAlerts: true,
    },
    privacy: {
      profileVisibility: 'public' as 'public' | 'private' | 'contacts',
      showEmail: false,
      showPhone: false,
    },
    video: {
      videoQuality: 'auto' as 'auto' | 'high' | 'medium' | 'low',
      cameraEnabled: true,
      microphoneEnabled: true,
    },
    communication: {
      preferredSignLanguage: 'RSL (Rwandan Sign Language)',
      interpreterPreference: 'AI-Powered Interpretation',
    },
  });

  const handleSave = (settingsData: any) => {
    console.log('Settings saved:', settingsData);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    console.log('Settings reset to default');
    alert('Settings reset to default');
  };

  return (
    <SettingsPage
      initialSettings={settings}
      userType="candidate"
      onSave={handleSave}
      onReset={handleReset}
    />
  );
}