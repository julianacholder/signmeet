import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  proficiencyLevel: string;
  companyName: string;
  industry: string;
  industryOther: string;
  role: string;
  roleOther: string;
}

interface RegisterFormFieldsProps {
  formData: FormData;
  userType: 'deaf' | 'company';
  currentStep: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function RegisterFormFields({ 
  formData, 
  userType, 
  currentStep, 
  onInputChange 
}: RegisterFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Basic Info
  if (userType === 'deaf' || currentStep === 1) {
    return (
      <>
        {/* Progress Bar for Company */}
        {userType === 'company' && (
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Step {currentStep} of 2
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-[15px] text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onInputChange}
            placeholder="John Doe"
            required
            className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:text-sm text-black font-medium"
          />
        </div>

        {/* RSL Proficiency Level - Only for Deaf Professionals */}
        {userType === 'deaf' && (
          <div className="mb-4">
            <label className="block text-[15px] text-gray-700 mb-2">
              RSL Proficiency Level
            </label>
            <select
              name="proficiencyLevel"
              value={formData.proficiencyLevel}
              onChange={onInputChange}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-500"
            >
              <option value="">Select Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="native">Native/Fluent</option>
            </select>
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[15px] text-gray-700 mb-2">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="Your email"
            required
            className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:text-sm text-black font-medium"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-[15px] text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onInputChange}
              placeholder="Password"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:text-sm text-black font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </>
    );
  }

  // Step 2: Company Info
  return (
    <>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Step {currentStep} of 2
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 2) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Company Name */}
      <div className="mb-4">
        <label className="block text-[15px] text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={onInputChange}
          placeholder="Your company name"
          required
          className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:text-sm text-black font-medium"
        />
      </div>

      {/* Industry */}
      <div className="mb-4">
        <label className="block text-[15px] text-gray-700 mb-2">
          Industry
        </label>
        <select
          name="industry"
          value={formData.industry}
          onChange={onInputChange}
          required
          className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-500"
        >
          <option value="">Select industry</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Industry Other Input */}
      {formData.industry === 'other' && (
        <div className="mb-4">
          <label className="block text-[15px] text-gray-700 mb-2">
            Please specify industry
          </label>
          <input
            type="text"
            name="industryOther"
            value={formData.industryOther}
            onChange={onInputChange}
            placeholder="Enter your industry"
            required
            className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:text-sm text-black font-medium"
          />
        </div>
      )}

      {/* Role */}
      <div className="mb-4">
        <label className="block text-[15px] text-gray-700 mb-2">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={onInputChange}
          required
          className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-500"
        >
          <option value="">Select your role</option>
          <option value="hr">HR Manager</option>
          <option value="recruiter">Recruiter</option>
          <option value="hiring_manager">Hiring Manager</option>
          <option value="executive">Executive</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Role Other Input */}
      {formData.role === 'other' && (
        <div className="mb-6">
          <label className="block text-[15px] text-gray-700 mb-2">
            Please specify role
          </label>
          <input
            type="text"
            name="roleOther"
            value={formData.roleOther}
            onChange={onInputChange}
            placeholder="Enter your role"
            required
            className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-gray-400 placeholder:text-sm text-black font-medium"
          />
        </div>
      )}
    </>
  );
}