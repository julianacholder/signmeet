'use client';

import { useState } from 'react';
import { Camera, User, Mail, Phone, Lock, Trash2 } from 'lucide-react';

// Update EditingField to include all keys from ProfileData that can be edited
type EditingField = 'username' | 'email' | 'phone' | null;

type ProfileData = {
  username: string;
  email: string;
  phone: string;
  initials?: string;
  fullName?: string;
};

type UserType = 'candidate' | 'company';

interface ProfileSettingsProps {
  initialData: ProfileData;
  userType: UserType;
  onSave?: (data: ProfileData) => void;
  onDelete?: () => void;
  onDeactivate?: () => void;
}

export default function ProfileSettingsPage({
  initialData,
  userType,
  onSave,
  onDelete,
  onDeactivate
}: ProfileSettingsProps) {
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState<boolean>(false);
  
  const [profile, setProfile] = useState<ProfileData>(initialData);
  const [tempValue, setTempValue] = useState<string>('');

  const handleEdit = (field: EditingField) => {
    if (field) {
      setEditingField(field);
      setTempValue(profile[field]);
    }
  };

  // Fix: Use EditingField instead of keyof ProfileData
  const handleSave = (field: EditingField) => {
    if (field) {
      const updatedProfile = { ...profile, [field]: tempValue };
      setProfile(updatedProfile);
      setEditingField(null);
    }
  };

  const handleSaveChanges = () => {
    if (onSave) {
      onSave(profile);
    }
  };

  const handleDeleteAccount = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleDeactivate = () => {
    if (onDeactivate) {
      onDeactivate();
    }
  };

  // Fix: Change parameter type to EditingField (excluding null)
  const renderEditableField = (
    field: Exclude<EditingField, null>,
    label: string, 
    icon: React.ElementType, 
    placeholder: string = ''
  ) => {
    const isEditing = editingField === field;
    const Icon = icon;

    return (
      <div className="flex items-center gap-4">
        <div className="w-32">
          <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        <div className="flex-1 flex items-center gap-3">
          {isEditing ? (
            <>
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder={placeholder}
                className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={() => handleSave(field)}
                className="text-primary hover:text-primary-hover font-medium text-sm"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 max-w-md flex items-center gap-2 px-4 py-2.5 bg-indigo-100 rounded-xl text-gray-800">
                <Icon className="w-4 h-4 text-gray-400" />
                {profile[field]}
              </div>
              <button
                onClick={() => handleEdit(field)}
                className="text-primary hover:text-primary-hover font-medium text-sm"
              >
                {field === 'email' || field === 'phone' ? 'Change' : 'Edit'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full mx-12 mt-5 p-6 md:p-8">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800">Profile Settings</h1>

      <div className="space-y-6">
        {/* Profile Photo Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">Your Photo</h3>
              <p className="text-sm text-gray-500">This will be displayed on your profile</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                  <p className='text-3xl font-semibold text-white'>
                    {profile.initials || profile.username.substring(0, 2).toUpperCase()}
                  </p>
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center hover:bg-blue-700">
                  <Camera className="w-4 h-4 text-primary" />
                </button>
              </div>
              <div className="flex gap-3">
                <button className="text-primary hover:text-primary-hover font-medium text-sm">
                  Change
                </button>
                <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            {renderEditableField('username', 'Username', User, 'Enter username')}
            {renderEditableField('email', 'Email', Mail, 'Enter email')}
            {renderEditableField('phone', 'Phone', Phone, 'Enter phone number')}
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Account security</h2>
          
          <div className="space-y-6">
            {/* Change Password */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Change password</h3>
                <p className="text-sm text-gray-500">Change password requires confirmation</p>
              </div>
              <button className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Change password?
              </button>
            </div>

            {/* Login Alerts */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">Login Alerts</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLoginAlertsEnabled(!loginAlertsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    loginAlertsEnabled ? 'bg-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      loginAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-500">
                  {loginAlertsEnabled ? 'Enabled' : 'Disable Login Alerts'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Account Management</h2>
          <div className="flex gap-3">
            <button 
              onClick={handleDeactivate}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Deactivate
            </button>
            <button 
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete account
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button 
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-primary hover:bg-primary-hover cursor-pointer text-white rounded-lg font-medium"
          >
            Save Change
          </button>
        </div>
      </div>
    </div>
  );
}