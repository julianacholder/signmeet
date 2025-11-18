'use client';

import { useState } from 'react';
import { Camera, User, Mail, Lock, Trash2, Building2, Briefcase, Award } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EditingField = 'fullName' | 'email' | 'rslProficiencyLevel' | null;

type ProfileData = {
  fullName: string;
  email: string;
  rslProficiencyLevel?: string;
  companyName?: string;
  industry?: string;
  role?: string;
  initials?: string;
};

type UserType = 'candidate' | 'company';

interface ProfileSettingsProps {
  initialData: ProfileData;
  userType: UserType;
  onSave?: (data: ProfileData) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  onDeactivate?: () => void | Promise<void>;
}

const RSL_PROFICIENCY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Native/Fluent'
] as const;

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
      setTempValue(profile[field] || '');
    }
  };

  const handleSave = (field: EditingField) => {
    if (field) {
      const updatedProfile = { ...profile, [field]: tempValue };
      setProfile(updatedProfile);
      setEditingField(null);
    }
  };

  const handleSaveChanges = async () => {
    if (onSave) {
      await onSave(profile);
    }
  };

  const handleDeleteAccount = async () => {
    if (onDelete) {
      await onDelete();
    }
  };

  const handleDeactivate = async () => {
    if (onDeactivate) {
      await onDeactivate();
    }
  };

  // Editable field component for text inputs
  const renderEditableField = (
    field: Exclude<EditingField, null>,
    label: string, 
    icon: React.ElementType, 
    placeholder: string = ''
  ) => {
    const isEditing = editingField === field;
    const Icon = icon;
    const value = profile[field];

    if (value === undefined && field === 'rslProficiencyLevel' && userType !== 'candidate') {
      return null;
    }

    return (
      <div className="flex items-center gap-4">
        <div className="w-32">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        </div>
        <div className="flex-1 flex items-center gap-3">
          {isEditing ? (
            <>
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder={placeholder}
                className="flex-1 max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
              <div className="flex-1 max-w-md flex items-center gap-2 px-4 py-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-gray-800 dark:text-gray-200">
                <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                {value || 'Not set'}
              </div>
              <button
                onClick={() => handleEdit(field)}
                className="text-primary hover:text-primary-hover font-medium text-sm"
              >
                {field === 'email' ? 'Change' : 'Edit'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Special component for RSL Proficiency with Select dropdown
  const renderRSLProficiencyField = () => {
    const isEditing = editingField === 'rslProficiencyLevel';
    const value = profile.rslProficiencyLevel;

    return (
      <div className="flex items-center gap-4">
        <div className="w-32">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">RSL Proficiency</label>
        </div>
        <div className="flex-1 flex items-center gap-3">
          {isEditing ? (
            <>
              <Select
                value={tempValue}
                onValueChange={setTempValue}
              >
                <SelectTrigger className="flex-1 max-w-md">
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  {RSL_PROFICIENCY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() => handleSave('rslProficiencyLevel')}
                className="text-primary hover:text-primary-hover font-medium text-sm"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 max-w-md flex items-center gap-2 px-4 py-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-gray-800 dark:text-gray-200">
                <Award className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                {value || 'Not set'}
              </div>
              <button
                onClick={() => handleEdit('rslProficiencyLevel')}
                className="text-primary hover:text-primary-hover font-medium text-sm"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Read-only field component (for company details)
  const renderReadOnlyField = (
    label: string, 
    value: string | undefined, 
    icon: React.ElementType
  ) => {
    if (!value) return null;

    const Icon = icon;

    return (
      <div className="flex items-center gap-4">
        <div className="w-32">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="flex-1 max-w-md flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-800 dark:text-gray-200">
            <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            {value}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 w-16">Read-only</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full mx-12 mt-5 p-6 md:p-8">
      <h1 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-100">Profile Settings</h1>

      <div className="space-y-6">
        {/* Profile Photo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Your Photo</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">This will be displayed on your profile</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                  <p className='text-3xl font-semibold text-white'>
                    {profile.initials || profile.fullName?.substring(0, 2).toUpperCase() || 'U'}
                  </p>
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center hover:bg-blue-700">
                  <Camera className="w-4 h-4 text-primary" />
                </button>
              </div>
              <div className="flex gap-3">
                <button className="text-primary hover:text-primary-hover font-medium text-sm">
                  Change
                </button>
                <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">
            {userType === 'candidate' ? 'Personal Information' : 'Profile Information'}
          </h2>
          <div className="space-y-6">
            {renderEditableField('fullName', 'Full Name', User, 'Enter full name')}
            {renderEditableField('email', 'Email', Mail, 'Enter email')}
            
            {userType === 'candidate' && renderRSLProficiencyField()}

            {userType === 'company' && (
              <>
                {renderReadOnlyField('Company Name', profile.companyName, Building2)}
                {renderReadOnlyField('Industry', profile.industry, Briefcase)}
                {renderReadOnlyField('Your Role', profile.role, User)}
              </>
            )}
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Account security</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Change password</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Change password requires confirmation</p>
              </div>
              <button className="text-primary hover:text-primary-hover font-medium text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Change password?
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Login Alerts</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLoginAlertsEnabled(!loginAlertsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    loginAlertsEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      loginAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {loginAlertsEnabled ? 'Enabled' : 'Disable Login Alerts'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Account Management</h2>
          <div className="flex gap-3">
            <button 
              onClick={handleDeactivate}
              className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Deactivate
            </button>
            <button 
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete account
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium">
            Cancel
          </button>
          <button 
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-primary hover:bg-primary-hover cursor-pointer text-white rounded-lg font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}