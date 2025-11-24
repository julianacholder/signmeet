import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - SignMeet',
  description: 'SignMeet privacy policy describing data practices and user rights.',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-[#2E3890] to-[#4C58C0] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4 shadow-lg">
            <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-white/80 mt-1">How SignMeet collects and handles your data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main */}
          <article className="md:col-span-3 bg-white rounded-lg shadow p-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">Last updated: November 23, 2025</p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Overview</h2>
              <p className="text-gray-700">
                SignMeet (“we”, “us”, or “the Platform”) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and protect personal
                information when you use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Information We Collect</h2>
              <ul className="list-disc ml-6 text-gray-700 space-y-2">
                <li>Account information (name, email, profile data)</li>
                <li>Scheduling and calendar metadata (events, availability)</li>
                <li>Video and translation data processed in real-time; raw video is not stored</li>
                <li>Technical data (IP address, device information, usage logs)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">How We Use Information</h2>
              <p className="text-gray-700 mb-2">We use information to:</p>
              <ul className="list-disc ml-6 text-gray-700 space-y-2">
                <li>Provide and improve our services, including real-time translation</li>
                <li>Enable scheduling and calendar integrations</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Communicate with users about their account and service updates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Data Sharing & Disclosure</h2>
              <p className="text-gray-700">
                We may share information with service providers who perform services on our behalf,
                with your consent, or when required by law. We do not sell personal data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Retention & Deletion</h2>
              <p className="text-gray-700">
                We retain data only as long as necessary to provide the service and for legal
                or legitimate business purposes. Translation metadata is deleted after a limited
                retention period; raw video is not persisted.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Security</h2>
              <p className="text-gray-700">
                We use industry-standard technical and organizational safeguards to protect
                personal data in transit and at rest. However, no method of transmission over
                the Internet is perfectly secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Your Rights</h2>
              <p className="text-gray-700">
                Depending on your jurisdiction, you may have rights to access, correct, export,
                or delete your personal data. To exercise rights or ask questions, contact us at
                <a className="text-[#2E3890] hover:underline mx-1" href="mailto:privacy@signmeet.rw">privacy@signmeet.rw</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-3">Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this policy from time to time. We will post changes here with an
                updated effective date.
              </p>
            </section>

            <p className="text-sm text-gray-500">© 2025 SignMeet. All rights reserved.</p>
          </article>

          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-28">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Need help?</h3>
              <p className="text-sm text-gray-600 mb-4">Contact our privacy team for requests or questions.</p>
              <a href="mailto:privacy@signmeet.rw" className="inline-block w-full text-center px-4 py-2 bg-[#2E3890] text-white rounded-md hover:bg-[#1F2660]">Contact Privacy</a>

              <div className="border-t border-gray-100 mt-6 pt-4">
                <p className="text-xs text-gray-500">Data processed in real-time for translation is not stored.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
