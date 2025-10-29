'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;
      if (!authData.user) throw new Error('Failed to sign in');

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw new Error(profileError.message);
      if (!profileData) throw new Error('Profile not found');

      // Simple redirect
      const redirectPath = profileData.user_type === 'deaf' 
        ? '/candidate/dashboard' 
        : '/company/dashboard';

      window.location.href = redirectPath;
      
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-1">
            <Image 
              src="/logo.png" 
              alt="SignMeet Logo" 
              width={130} 
              height={130}
              className="rounded-lg"
            />
          </div>
          <p className="text-gray-600 text-[15px]">
            Connecting deaf job seekers with employers through<br />accessible video interviews
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex mb-6 bg-gray-200 rounded-lg">
            <div className="flex-1 py-2 text-sm mx-1 font-semibold bg-white rounded-lg my-1 text-black text-center">
              Login
            </div>
            <Link 
              href="/auth/register" 
              className="flex-1 py-2 text-sm font-semibold mx-1 my-1 text-black hover:text-primary text-center transition-colors"
            >
              Register
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm text-gray-800 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your email"
                required
                disabled={loading}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:text-sm text-black font-medium disabled:opacity-50"
              />
            </div>

            <div className="mb-2">
              <label className="block text-[15px] text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  disabled={loading}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:text-sm text-black font-medium disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right mb-6">
              <button
                type="button"
                disabled={loading}
                className="text-[14px] text-gray-800 hover:text-primary disabled:opacity-50"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="block w-full max-w-xs mx-auto bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:text-primary-hover font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}