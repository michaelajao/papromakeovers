import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Papromakeovers",
  description: "Privacy policy and data protection information for Papromakeovers makeup artist services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#4a4037]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white py-12">
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/90">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">1. Introduction</h2>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              Papromakeovers ("we," "us," or "our") is committed to protecting your privacy and personal data. 
              This Privacy Policy explains how we collect, use, process, and protect your information when you 
              use our makeup artistry services and website.
            </p>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              We are registered in England & Wales and operate in compliance with the UK Data Protection Act 2018 
              and the General Data Protection Regulation (GDPR).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Personal Information</h3>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>Full name and contact details (email, phone number)</li>
              <li>Booking preferences and service requirements</li>
              <li>Special requests or notes for appointments</li>
              <li>Communication history with our team</li>
            </ul>
            
            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Website Usage Data</h3>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>IP address and browser information</li>
              <li>Pages visited and time spent on our website</li>
              <li>Device and screen resolution for responsive design</li>
              <li>Analytics data to improve our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">3. How We Use Your Information</h2>
            <p className="mb-3 text-[#6b5d4f] leading-relaxed">We use your personal information for the following purposes:</p>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li><strong>Service Delivery:</strong> To provide makeup artistry services and manage bookings</li>
              <li><strong>Communication:</strong> To send booking confirmations, reminders, and service updates</li>
              <li><strong>Customer Support:</strong> To respond to inquiries and provide assistance</li>
              <li><strong>Business Operations:</strong> To manage our schedule and improve our services</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and maintain business records</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">4. Legal Basis for Processing</h2>
            <p className="mb-3 text-[#6b5d4f] leading-relaxed">Under GDPR, we process your data based on:</p>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li><strong>Contract Performance:</strong> To fulfill our makeup artistry services agreement</li>
              <li><strong>Legitimate Interest:</strong> For business communications and service improvement</li>
              <li><strong>Consent:</strong> For marketing communications (where applicable)</li>
              <li><strong>Legal Obligation:</strong> For business record keeping and tax purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">5. Data Sharing and Third Parties</h2>
            <p className="mb-3 text-[#6b5d4f] leading-relaxed">We may share your information with:</p>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li><strong>Email Service Providers:</strong> Resend (for booking confirmations and communications)</li>
              <li><strong>Database Services:</strong> Supabase (for secure data storage)</li>
              <li><strong>Analytics Services:</strong> Vercel Analytics (for website performance)</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="text-[#6b5d4f] leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">6. Data Retention</h2>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li><strong>Booking Information:</strong> Up to 7 years for business and tax records</li>
              <li><strong>Communication Records:</strong> Up to 3 years for customer service purposes</li>
              <li><strong>Website Analytics:</strong> Anonymized data retained indefinitely</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">7. Your Rights Under GDPR</h2>
            <p className="mb-3 text-[#6b5d4f] leading-relaxed">You have the right to:</p>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li><strong>Access:</strong> Request copies of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Restrict Processing:</strong> Limit how we use your information</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Object:</strong> Opt-out of certain processing activities</li>
              <li><strong>Withdraw Consent:</strong> For processing based on consent</li>
            </ul>
            <p className="text-[#6b5d4f] leading-relaxed">
              To exercise these rights, contact us at <a href="mailto:papromakeoversstudio@gmail.com" className="text-[#b49b82] underline">papromakeoversstudio@gmail.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">8. Cookies and Tracking</h2>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              Our website uses essential cookies for functionality and analytics cookies to understand how 
              visitors use our site. We use Vercel Analytics for privacy-focused website analytics that 
              doesn't track individual users.
            </p>
            <p className="text-[#6b5d4f] leading-relaxed">
              You can control cookies through your browser settings, but disabling essential cookies may 
              affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">9. Data Security</h2>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against 
              unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure database hosting with Supabase</li>
              <li>Access controls and authentication systems</li>
              <li>Regular security updates and monitoring</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">10. International Data Transfers</h2>
            <p className="text-[#6b5d4f] leading-relaxed">
              Some of our service providers may process data outside the UK/EU. Where this occurs, we ensure 
              appropriate safeguards are in place, including Standard Contractual Clauses or adequacy decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">11. Updates to This Policy</h2>
            <p className="text-[#6b5d4f] leading-relaxed">
              We may update this Privacy Policy from time to time. When we do, we will post the updated policy 
              on this page and update the "last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">12. Contact Information</h2>
            <div className="bg-[#f5f2ed] p-6 rounded-lg">
              <p className="mb-3 text-[#4a4037] font-medium">For privacy-related questions or to exercise your rights:</p>
              <p className="text-[#6b5d4f]">
                <strong>Email:</strong> <a href="mailto:papromakeoversstudio@gmail.com" className="text-[#b49b82] underline">papromakeoversstudio@gmail.com</a><br/>
                <strong>Phone:</strong> +447368590564<br/>
                <strong>Address:</strong> Coventry, United Kingdom
              </p>
              <p className="mt-4 text-[#6b5d4f]">
                If you're not satisfied with our response, you have the right to lodge a complaint with the 
                Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" className="text-[#b49b82] underline">ico.org.uk</a>
              </p>
            </div>
          </section>

          <div className="text-center mt-12 pt-8 border-t border-[#e5ddd1]">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b49b82] to-[#8b7355] text-white px-6 py-3 rounded-full font-semibold hover:from-[#a48a72] hover:to-[#7a6345] transition-all duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}