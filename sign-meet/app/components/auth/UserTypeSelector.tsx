interface UserTypeSelectorProps {
  userType: 'deaf' | 'company';
  onUserTypeChange: (type: 'deaf' | 'company') => void;
}

export default function UserTypeSelector({ userType, onUserTypeChange }: UserTypeSelectorProps) {
  return (
    <div className="space-y-3 mb-6">
      <button
        type="button"
        onClick={() => onUserTypeChange('deaf')}
        className={`w-full p-2.5 rounded-xl border-2 text-left transition-all ${
          userType === 'deaf'
            ? 'border-primary bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-[15px] text-gray-900">Deaf Professional</div>
            <div className="text-sm text-gray-600">I am looking for job opportunities</div>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            userType === 'deaf' ? 'border-primary' : 'border-gray-300'
          }`}>
            {userType === 'deaf' && (
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onUserTypeChange('company')}
        className={`w-full p-2.5 rounded-xl border-2 text-left transition-all ${
          userType === 'company'
            ? 'border-primary bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-[15px] text-gray-900">Company Account</div>
            <div className="text-sm text-gray-600">I represent an employer</div>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            userType === 'company' ? 'border-primary' : 'border-gray-300'
          }`}>
            {userType === 'company' && (
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
