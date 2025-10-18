import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  activeTab: 'login' | 'register';
}

export default function AuthLayout({ children, activeTab }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-1">
            <Image 
              src="/logo.png" 
              alt="SignMeet Logo" 
              width={120} 
              height={120}
              className="rounded-lg"
            />
          </div>
          <p className="text-gray-600 text-[15px]">
            Connecting deaf job seekers with employers through<br />accessible video interviews
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {/* Tabs */}
          <div className="flex mb-5 bg-gray-200 rounded-lg">
            <Link 
              href="/auth/login" 
              className={`flex-1 py-1.5 text-sm font-semibold mx-1 my-1 text-center transition-colors ${
                activeTab === 'login' 
                  ? 'bg-white rounded-lg text-black' 
                  : 'text-black hover:text-primary'
              }`}
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className={`flex-1 py-1.5 text-sm font-semibold mx-1 my-1 text-center transition-colors ${
                activeTab === 'register' 
                  ? 'bg-white rounded-lg text-black' 
                  : 'text-black hover:text-primary'
              }`}
            >
              Register
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
