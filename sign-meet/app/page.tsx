// app/page.js
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <nav className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-600">🤝 RSL Connect</h1>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 text-purple-600 hover:text-purple-800">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Sign Up
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Break Communication Barriers
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Real-time Rwanda Sign Language translation for virtual job interviews
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4">For Job Seekers</h3>
            <p className="text-gray-600 mb-6">
              Practice and conduct interviews with confidence using real-time RSL translation
            </p>
            <Link href="/candidate/dashboard" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg">
              Get Started
            </Link>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-4">For Companies</h3>
            <p className="text-gray-600 mb-6">
              Conduct accessible interviews and track your DEI impact
            </p>
            <Link href="/company/dashboard" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}