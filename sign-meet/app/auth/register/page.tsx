'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { createUserProfile } from '@/lib/api/auth';
import AuthLayout from '@/app/components/auth/AuthLayout';
import UserTypeSelector from '@/app/components/auth/UserTypeSelector';
import RegisterFormFields from '@/app/components/auth/RegisterFormFields';

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'deaf' | 'company'>('deaf');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    proficiencyLevel: '',
    companyName: '',
    industry: '',
    industryOther: '',
    role: '',
    roleOther: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserTypeChange = (type: 'deaf' | 'company') => {
    setUserType(type);
    setCurrentStep(1);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Sign up the user with Supabase Auth (handles authentication)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // 2. Create profile using server action
      const { success, error: profileError } = await createUserProfile({
        id: authData.user.id,
        email: formData.email,
        fullName: formData.fullName,
        userType: userType,
        
        // Deaf professional fields
        ...(userType === 'deaf' && {
          rslProficiencyLevel: formData.proficiencyLevel,
        }),
        
        // Company fields
        ...(userType === 'company' && {
          companyName: formData.companyName,
          industry: formData.industry === 'other' ? formData.industryOther : formData.industry,
          industryOther: formData.industry === 'other' ? formData.industryOther : undefined,
          role: formData.role === 'other' ? formData.roleOther : formData.role,
          roleOther: formData.role === 'other' ? formData.roleOther : undefined,
        }),
      });

      if (!success || profileError) {
        throw new Error(profileError || 'Failed to create profile');
      }

      // 3. Redirect based on user type
      if (userType === 'deaf') {
        router.push('/candidate/dashboard');
      } else {
        router.push('/company/dashboard');
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout activeTab="register">
      <form onSubmit={userType === 'company' && currentStep === 1 ? handleNext : handleSubmit}>
        {/* User Type Selection */}
        <UserTypeSelector 
          userType={userType} 
          onUserTypeChange={handleUserTypeChange} 
        />

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <RegisterFormFields
          formData={formData}
          userType={userType}
          currentStep={currentStep}
          onInputChange={handleInputChange}
        />

        {/* Buttons */}
        {userType === 'company' && currentStep === 2 ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-md font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : (userType === 'company' ? 'Next' : 'Create Account')}
          </button>
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary-hover font-medium">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}