// components/TermsModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, FileText } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6 text-[#2E3890]" />
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-gray-500 mb-6">Last Updated: November 23, 2024</p>

          {/* Introduction */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-700 mb-2">
              By accessing or using SignMeet ("the Platform"), you agree to be bound by these Terms 
              and Conditions. If you do not agree to these terms, please do not use the Platform.
            </p>
            <p className="text-gray-700">
              SignMeet is a real-time Rwanda Sign Language (RSL) translation platform designed to 
              facilitate accessible job interviews between deaf candidates and employers.
            </p>
          </section>

          {/* Eligibility */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Eligibility</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>You must be at least 18 years old to use SignMeet</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree to notify us immediately of any unauthorized access to your account</li>
            </ul>
          </section>

          {/* Service Description */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Service Description</h3>
            <p className="text-gray-700 mb-3">SignMeet provides:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Real-time RSL to text/speech translation during video interviews</li>
              <li>Interview scheduling and calendar integration</li>
              <li>Video conferencing capabilities with translation overlay</li>
              <li>Practice interview features for candidates</li>
            </ul>
          </section>

          {/* System Limitations */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">4. System Limitations & Disclaimers</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-yellow-900 font-semibold mb-2">⚠️ Important Limitations</p>
              <p className="text-yellow-800 text-sm">
                SignMeet uses AI-powered translation technology which may not be 100% accurate. 
                The Platform is designed to assist communication but does not guarantee perfect translation.
              </p>
            </div>
            <p className="text-gray-700 mb-3">You acknowledge that:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Translation accuracy varies based on signing speed, lighting, camera quality, and internet connection</li>
              <li>The Platform may not recognize all RSL dialects or regional variations perfectly</li>
              <li>Technical issues may occur that temporarily interrupt service</li>
              <li>The Platform is a communication tool and does NOT guarantee employment outcomes</li>
              <li>Employers make independent hiring decisions based on qualifications, not Platform usage</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">5. User Responsibilities</h3>
            <p className="text-gray-700 mb-3">As a user, you agree to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li><strong>For Candidates:</strong> Provide truthful information during interviews; use the practice feature before real interviews; have backup communication methods ready</li>
              <li><strong>For Companies:</strong> Conduct fair and non-discriminatory hiring practices; not rely solely on AI translation; provide reasonable accommodations as required by law</li>
              <li><strong>All Users:</strong> Not misuse the Platform for harassment, discrimination, or illegal activities; respect intellectual property rights; maintain professional conduct during interviews</li>
            </ul>
          </section>

          {/* Data Privacy */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Data Privacy & Security</h3>
            <p className="text-gray-700 mb-3">
              Your privacy is important to us. Our data practices include:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Video is processed in real-time and immediately deleted</li>
              <li>Only hand coordinate data (mathematical points) is temporarily stored</li>
              <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li>Data automatically deleted after 90 days unless you choose otherwise</li>
              <li>Compliance with Rwanda's Law N° 058/2021 on Data Protection</li>
            </ul>
            <p className="text-gray-700 mt-3">
              For complete details, please review our{' '}
              <a href="/legal/privacy" className="text-[#2E3890] hover:underline" target="_blank">
                Privacy Policy
              </a>.
            </p>
          </section>

          {/* Interview Recording */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Interview Recording & Consent</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Both parties (candidate and company) must consent before any interview recording</li>
              <li>The Platform will clearly indicate when recording is active</li>
              <li>Recorded interviews are stored encrypted and accessible only to participants</li>
              <li>You may request deletion of interview recordings at any time</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Intellectual Property</h3>
            <p className="text-gray-700 mb-3">
              All content, features, and functionality on SignMeet (including but not limited to text, 
              graphics, logos, software, and design) are owned by SignMeet or its licensors and are 
              protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700">
              You retain ownership of content you submit (interview recordings, profile information), 
              but grant SignMeet a limited license to process this content to provide services.
            </p>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">9. Prohibited Uses</h3>
            <p className="text-gray-700 mb-3">You may NOT use SignMeet to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Discriminate against candidates based on disability, race, gender, or other protected characteristics</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to hack, reverse engineer, or compromise Platform security</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Impersonate others or create fake accounts</li>
              <li>Use the Platform for purposes other than job interviews</li>
              <li>Scrape data or use automated tools to access the Platform</li>
            </ul>
          </section>

          {/* Payment Terms */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">10. Payment Terms (If Applicable)</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Free tier available for individual candidates</li>
              <li>Company subscriptions require payment for premium features</li>
              <li>All fees are in USD or Rwandan Francs as specified</li>
              <li>Refund policy: 30-day money-back guarantee for annual subscriptions</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">11. Account Termination</h3>
            <p className="text-gray-700 mb-3">
              <strong>You may terminate:</strong> You can delete your account at any time through 
              your privacy dashboard. All your data will be permanently deleted within 30 days.
            </p>
            <p className="text-gray-700">
              <strong>We may terminate:</strong> We reserve the right to suspend or terminate accounts 
              that violate these Terms, with or without notice, including for: harassment or discrimination, 
              fraudulent activity, security violations, or repeated Terms violations.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">12. Limitation of Liability</h3>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-red-900 font-semibold mb-2">Important Legal Notice</p>
              <p className="text-red-800 text-sm">
                SignMeet is provided "AS IS" without warranties of any kind. We do not guarantee 
                uninterrupted or error-free service.
              </p>
            </div>
            <p className="text-gray-700 mb-3">
              To the maximum extent permitted by Rwandan law:
            </p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>We are not liable for translation errors or miscommunications during interviews</li>
              <li>We are not responsible for hiring decisions made by employers</li>
              <li>We are not liable for lost job opportunities or economic damages</li>
              <li>Our total liability shall not exceed the amount you paid for services (if any) in the past 12 months</li>
              <li>We are not liable for third-party actions (e.g., discriminatory employers)</li>
            </ul>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">13. Dispute Resolution</h3>
            <p className="text-gray-700 mb-3">
              In the event of a dispute:
            </p>
            <ol className="list-decimal ml-6 text-gray-700 space-y-2">
              <li>Contact us first at support@signmeet.rw to resolve informally</li>
              <li>If unresolved, mediation through RNUD or mutually agreed mediator</li>
              <li>Legal disputes governed by the laws of Rwanda</li>
              <li>Jurisdiction: Courts of Kigali, Rwanda</li>
            </ol>
          </section>

          {/* RNUD Partnership */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">14. Partnership with RNUD</h3>
            <p className="text-gray-700">
              SignMeet operates in partnership with the Rwanda National Union of the Deaf (RNUD) 
              to ensure the Platform serves the deaf community's interests. RNUD provides oversight 
              on ethical practices and community impact.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">15. Changes to Terms</h3>
            <p className="text-gray-700">
              We may update these Terms and Conditions from time to time. Significant changes will 
              be communicated via email and/or prominent notice on the Platform at least 30 days 
              before taking effect. Continued use of the Platform after changes constitutes acceptance.
            </p>
          </section>

          {/* Accessibility Commitment */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">16. Accessibility Commitment</h3>
            <p className="text-gray-700">
              SignMeet is committed to accessibility in compliance with the UN Convention on Rights 
              of Persons with Disabilities (CRPD). If you encounter accessibility barriers, please 
              contact us immediately.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">17. Contact Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 mb-1"><strong>SignMeet Support</strong></p>
              <p className="text-gray-700 text-sm">Email: support@signmeet.rw</p>
              <p className="text-gray-700 text-sm">Legal: legal@signmeet.rw</p>
              <p className="text-gray-700 text-sm">Address: African Leadership University, Kigali, Rwanda</p>
              <p className="text-gray-700 text-sm">RNUD Partnership: RNUD Kigali Office</p>
            </div>
          </section>

          {/* Severability */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">18. Severability</h3>
            <p className="text-gray-700">
              If any provision of these Terms is found to be unenforceable or invalid, that provision 
              will be limited or eliminated to the minimum extent necessary, and the remaining provisions 
              will remain in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">19. Entire Agreement</h3>
            <p className="text-gray-700">
              These Terms and Conditions, together with the Privacy Policy, constitute the entire 
              agreement between you and SignMeet regarding use of the Platform.
            </p>
          </section>
        </div>

        {/* Footer with Close Button */}
        <div className="border-t border-gray-200 p-6">
          <Button
            onClick={onClose}
            className="w-full bg-[#2E3890] hover:bg-[#1F2660]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}