'use client';

import { useState } from 'react';
import { Bell, Lock, Globe, Moon, Sun, Volume2, Camera, Shield } from 'lucide-react';

type NotificationSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  interviewReminders: boolean;
  rescheduledAlerts: boolean;
  newJobAlerts?: boolean; 
};

type PrivacySettings = {
  profileVisibility: 'public' | 'private' | 'contacts';
  showEmail: boolean;
  showPhone: boolean;
};

type VideoSettings = {
  videoQuality: 'auto' | 'high' | 'medium' | 'low';
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
};

type CommunicationSettings = {
  preferredSignLanguage: string;
  interpreterPreference: string;
};

type SettingsData = {
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  video: VideoSettings;
  communication: CommunicationSettings;
};

type UserType = 'candidate' | 'company';

interface SettingsPageProps {
  initialSettings: SettingsData;
  userType: UserType;
  onSave?: (settings: SettingsData) => void;
  onReset?: () => void;
}

export default function SettingsPage({
  initialSettings,
  userType,
  onSave,
  onReset
}: SettingsPageProps) {
  const [theme, setTheme] = useState(initialSettings.theme);
  const [language, setLanguage] = useState(initialSettings.language);
  const [notifications, setNotifications] = useState(initialSettings.notifications);
  const [privacy, setPrivacy] = useState(initialSettings.privacy);
  const [videoQuality, setVideoQuality] = useState(initialSettings.video.videoQuality);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(initialSettings.video.microphoneEnabled);
  const [cameraEnabled, setCameraEnabled] = useState(initialSettings.video.cameraEnabled);
  const [preferredSignLanguage, setPreferredSignLanguage] = useState(initialSettings.communication.preferredSignLanguage);
  const [interpreterPreference, setInterpreterPreference] = useState(initialSettings.communication.interpreterPreference);

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (key: keyof PrivacySettings) => {
    if (typeof privacy[key] === 'boolean') {
      setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSaveSettings = () => {
    const allSettings: SettingsData = {
      theme,
      language,
      notifications,
      privacy,
      video: {
        videoQuality,
        cameraEnabled,
        microphoneEnabled
      },
      communication: {
        preferredSignLanguage,
        interpreterPreference
      }
    };

    if (onSave) {
      onSave(allSettings);
    }
  };

  const handleResetSettings = () => {
    if (onReset) {
      onReset();
    }
    // Reset to initial settings
    setTheme(initialSettings.theme);
    setLanguage(initialSettings.language);
    setNotifications(initialSettings.notifications);
    setPrivacy(initialSettings.privacy);
    setVideoQuality(initialSettings.video.videoQuality);
    setCameraEnabled(initialSettings.video.cameraEnabled);
    setMicrophoneEnabled(initialSettings.video.microphoneEnabled);
    setPreferredSignLanguage(initialSettings.communication.preferredSignLanguage);
    setInterpreterPreference(initialSettings.communication.interpreterPreference);
  };

  const renderToggle = (enabled: boolean, onChange: () => void) => {
    return (
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    );
  };

  return (
    <div className="max-w-full mx-8 mt-3 p-6 md:p-8">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-100">Settings</h1>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Sun className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${
                    theme === 'light'
                      ? 'border-primary bg-indigo-50 dark:bg-indigo-900/30 text-primary'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Light
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'border-primary bg-indigo-50 dark:bg-indigo-900/30 text-primary'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Language</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option>English</option>
                <option>Kinyarwanda</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
              </div>
              {renderToggle(notifications.emailNotifications, () => handleNotificationToggle('emailNotifications'))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Push Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications on your device</p>
              </div>
              {renderToggle(notifications.pushNotifications, () => handleNotificationToggle('pushNotifications'))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Interview Reminders</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get reminders before scheduled interviews</p>
              </div>
              {renderToggle(notifications.interviewReminders, () => handleNotificationToggle('interviewReminders'))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Rescheduled Alerts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when interviews are rescheduled</p>
              </div>
              {renderToggle(notifications.rescheduledAlerts, () => handleNotificationToggle('rescheduledAlerts'))}
            </div>

            {/* Show New Job Alerts only for candidates */}
            {userType === 'candidate' && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">New Job Alerts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts for new job opportunities</p>
                </div>
                {renderToggle(notifications.newJobAlerts || false, () => handleNotificationToggle('newJobAlerts'))}
              </div>
            )}
          </div>
        </div>

        {/* Privacy Settings - Only for candidates */}
        {userType === 'candidate' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Privacy & Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Profile Visibility</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Control who can see your profile</p>
                </div>
                <select
                  value={privacy.profileVisibility}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value as 'public' | 'private' | 'contacts' }))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="public">Public</option>
                  <option value="contacts">Contacts Only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Show Email Address</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Display your email on your profile</p>
                </div>
                {renderToggle(privacy.showEmail, () => handlePrivacyToggle('showEmail'))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Show Phone Number</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Display your phone number on your profile</p>
                </div>
                {renderToggle(privacy.showPhone, () => handlePrivacyToggle('showPhone'))}
              </div>
            </div>
          </div>
        )}

        {/* Video & Audio Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Video & Audio</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Video Quality</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose video quality for interviews</p>
              </div>
              <select
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value as 'auto' | 'high' | 'medium' | 'low')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="auto">Auto</option>
                <option value="high">High (1080p)</option>
                <option value="medium">Medium (720p)</option>
                <option value="low">Low (480p)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Enable Camera</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Turn on camera for video interviews</p>
              </div>
              {renderToggle(cameraEnabled, () => setCameraEnabled(!cameraEnabled))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Enable Microphone</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Turn on microphone for interviews</p>
              </div>
              {renderToggle(microphoneEnabled, () => setMicrophoneEnabled(!microphoneEnabled))}
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Test Audio & Video
              </button>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Communication Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Preferred Sign Language
              </label>
              <select 
                value={preferredSignLanguage}
                onChange={(e) => setPreferredSignLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option>RSL (Rwandan Sign Language)</option>
                <option>ASL (American Sign Language)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Interpreter Preference
              </label>
              <select 
                value={interpreterPreference}
                onChange={(e) => setInterpreterPreference(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option>AI-Powered Interpretation</option>
                <option>Text-Based Communication</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleResetSettings}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            Reset to Default
          </button>
          <button 
            onClick={handleSaveSettings}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}