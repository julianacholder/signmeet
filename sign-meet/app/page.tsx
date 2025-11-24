'use client';

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Video, Users, CheckCircle, Clock, Globe, ChevronDown } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Image 
              src="/logo.png" 
              alt="SignMeet Logo" 
              width={100} 
              height={130}
              className="rounded-lg"
            />
            <div className="hidden md:flex space-x-6">
              <button className="flex items-center text-gray-700 hover:text-[#2E3890] font-medium">
                Product <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <Link href="/privacy-policy" className="flex items-center text-gray-700 hover:text-[#2E3890] font-medium">
                Privacy Policy
              </Link>
              <button className="flex items-center text-gray-700 hover:text-[#2E3890] font-medium">
                Resources <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <Link href="/pricing" className="text-gray-700 hover:text-[#2E3890] font-medium">
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="hidden sm:block px-4 py-2 text-gray-700 hover:text-[#2E3890] font-medium">
              English
            </button>
            <button className="hidden sm:block px-4 py-2 text-gray-700 hover:text-[#2E3890] font-medium">
              Talk to sales
            </button>
            <Link href="/auth/login" className="px-4 py-2 text-gray-700 hover:text-[#2E3890] font-medium">
              Log In
            </Link>
            <Link href="/auth/register" className="px-6 py-2.5 bg-primary text-white rounded-full hover:bg-[#0052CC] transition font-medium">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Blue blob - top right */}
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-[#2E3890] rounded-bl-[300px] transform translate-x-1/4 -translate-y-1/4 animate-blob-float"></div>
          
          {/* Purple/Pink blob - bottom right */}
          <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-gradient-to-br from-[#C651FF] to-[#FF3D8F] rounded-tl-[250px] transform translate-x-1/3 translate-y-1/4 animate-blob-float-delayed"></div>
          
          {/* Light purple accent - top */}
          <div className="absolute top-20 right-[20%] w-[400px] h-[400px] bg-[#A855F7]/30 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="text-left">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1a2332] leading-tight mb-6">
  Real-time<br />
  sign language<br />
  translation
</h1>
<p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
  Empowering deaf professionals with instant sign-to-speech tools built for virtual job interviews.
</p>

            
            <div className="space-y-3 mb-6">
              <button className="w-full sm:w-auto flex items-center justify-center space-x-3 px-6 py-3.5 bg-[#2E3890] text-white rounded-lg hover:bg-[#1F2660] transition font-medium shadow-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Connect your Google Calendar</span>
              </button>
              
              <button className="w-full sm:w-auto flex items-center justify-center space-x-3 px-6 py-3.5 bg-[#1E2757] text-white rounded-lg hover:bg-[#1a202c] transition font-medium">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M0 0h11.377v11.372H0z"/>
                  <path fill="#00a4ef" d="M12.623 0H24v11.372H12.623z"/>
                  <path fill="#7fba00" d="M0 12.628h11.377V24H0z"/>
                  <path fill="#ffb900" d="M12.623 12.628H24V24H12.623z"/>
                </svg>
                <span>Sign up with Microsoft</span>
              </button>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-gray-500 mb-2">OR</p>
              <Link href="/auth/register" className="text-[#2E3890] font-medium hover:underline">
                Sign up free with email.
              </Link>
              <span className="text-gray-500"> No credit card required</span>
            </div>
          </div>

          {/* Right Content - Animated Booking Interface with Video Image */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Main Video Card with animation */}
              <div className="bg-transparent p-3 relative z-20 animate-slide-in-right">
                <div className="relative w-[550px] h-[350px]">
  <Image
    src="/video.png"
    alt="SignMeet Video Interface"
    fill
    className="rounded-lg object-contain"
    priority
  />
</div>

              </div>

              {/* Floating Calendar Card */}
<div className="absolute top-8 -right-12 bg-white rounded-xl shadow-xl p-6 z-30 animate-float">
  
  <h4 className="font-bold text-sm mb-3 text-[#1a1a1a]">
    Select a Date & Time
  </h4>

  <p className="text-xs text-[#555] mb-3">
    Monday, July 22
  </p>

  {/* Time slots */}
  <div className="space-y-2">

    <div className="border border-gray-200 rounded px-3 py-2 text-sm text-center hover:border-[#0069FF] cursor-pointer transition text-[#1a1a1a]">
      10:00am
    </div>

    <div className="border border-[#0069FF] bg-primary text-white rounded px-3 py-2 text-sm text-center cursor-pointer flex items-center justify-between">
      <span className="text-white">11:00am</span>
      <span className="text-white text-xs">Confirm</span>
    </div>

    <div className="border border-gray-200 rounded px-3 py-2 text-sm text-center hover:border-[#0069FF] cursor-pointer transition text-[#1a1a1a]">
      1:00pm
    </div>

    <div className="border border-gray-200 rounded px-3 py-2 text-sm text-center hover:border-[#0069FF] cursor-pointer transition text-[#1a1a1a]">
      2:30pm
    </div>

    <div className="border border-gray-200 rounded px-3 py-2 text-sm text-center hover:border-[#0069FF] cursor-pointer transition text-[#1a1a1a]">
      4:00pm
    </div>
  </div>

  <div className="mt-4 pt-3 border-t text-xs text-[#555]">
    <span className="font-medium text-[#1a1a1a]">Time zone</span>
    <p className="text-[#555]">Central African Time - CAT</p>
  </div>

</div>


              {/* Mini Calendar Widget */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-lg shadow-lg p-4 z-10 animate-float-delayed">
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  {[30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((day, i) => (
                    <div 
                      key={i} 
                      className={`w-6 h-6 flex items-center justify-center text-xs rounded ${
                        [16, 17, 24, 25].includes(day) ? 'bg-[#0069FF] text-white font-bold' : 
                        [22, 23, 30, 31].includes(day) ? 'text-[#0069FF] font-bold' : 
                        'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the content sections */}
      <section className="py-15 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simplify your scheduling process
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to schedule inclusive interviews
            </p>
          </div>

         <div className="grid md:grid-cols-3 gap-8">

  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
    <div className="w-12 h-12 bg-[#2E3890] rounded-lg flex items-center justify-center mb-4">
      <Calendar className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-[#1a1a1a]">Smart scheduling</h3>
    <p className="text-[#555]">
      Share your availability and let candidates book interviews that work for everyone.
    </p>
  </div>

  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
    <div className="w-12 h-12 bg-[#4C58C0] rounded-lg flex items-center justify-center mb-4">
      <Video className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-[#1a1a1a]">RSL Translation</h3>
    <p className="text-[#555]">
      Real-time Rwanda Sign Language translation built directly into every video interview.
    </p>
  </div>

  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
    <div className="w-12 h-12 bg-[#2E3890] rounded-lg flex items-center justify-center mb-4">
      <Users className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-[#1a1a1a]">Team collaboration</h3>
    <p className="text-[#555]">
      Coordinate team interviews and track your diversity and inclusion impact.
    </p>
  </div>

</div>

        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-15">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for everyone
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-[#1a1a1a]">For Job Seekers</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2E3890] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Practice interviews with RSL translation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2E3890] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Share your availability link with employers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#2E3890] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Conduct confident accessible interviews</span>
                </li>
              </ul>
              <Link href="/candidate/dashboard" className="inline-block px-6 py-3 bg-[#2E3890] text-white rounded-full hover:bg-[#1F2660] transition">
                Get started as candidate
              </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4 text-[#1a1a1a]">For Companies</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#4C58C0] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Schedule inclusive interviews effortlessly</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#4C58C0] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Track your DEI impact and metrics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#4C58C0] mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Coordinate team interviews seamlessly</span>
                </li>
              </ul>
              <Link href="/company/dashboard" className="inline-block px-6 py-3 bg-[#4C58C0] text-white rounded-full hover:bg-[#2E3890] transition">
                Get started as company
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#2E3890] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to break communication barriers?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands making interviews more accessible
          </p>
          <Link href="/auth/register" className="inline-block px-8 py-4 bg-white text-[#2E3890] rounded-full hover:bg-gray-100 transition text-lg font-semibold">
            Get started for free
          </Link>
          <p className="text-sm text-blue-200 mt-4">
            No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
               <Image 
              src="/logo.png" 
              alt="SignMeet Logo" 
              width={100} 
              height={130}
              className="rounded-lg"
            />
              <p className="text-gray-600 text-sm">
                Breaking communication barriers in job interviews
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#1a1a1a]">Product</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/features" className="hover:text-[#2E3890]">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-[#2E3890]">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-[#2E3890]">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#1a1a1a]">Company</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/about" className="hover:text-[#2E3890]">About</Link></li>
                <li><Link href="/careers" className="hover:text-[#2E3890]">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-[#2E3890]">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#1a1a1a]">Resources</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="/blog" className="hover:text-[#2E3890]">Blog</Link></li>
                <li><Link href="/help" className="hover:text-[#2E3890]">Help Center</Link></li>
                <li><Link href="/api" className="hover:text-[#2E3890]">API Docs</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2025 SignMeet. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob-float {
          0%, 100% { transform: translate(25%, -25%) rotate(0deg); }
          50% { transform: translate(30%, -20%) rotate(5deg); }
        }

        @keyframes blob-float-delayed {
          0%, 100% { transform: translate(33%, 25%) rotate(0deg); }
          50% { transform: translate(28%, 30%) rotate(-5deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .animate-blob-float {
          animation: blob-float 20s ease-in-out infinite;
        }

        .animate-blob-float-delayed {
          animation: blob-float-delayed 25s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}