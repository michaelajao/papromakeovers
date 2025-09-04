import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - Papromakeovers",
  description: "Terms and conditions for Papromakeovers professional makeup artist services in the UK.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#4a4037]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white py-12">
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-white/90">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-5 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">1. Agreement to Terms</h2>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your use of Papromakeovers&apos; makeup artistry services 
              and website. By booking our services or using our website, you agree to be bound by these Terms.
            </p>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              Papromakeovers is a makeup artistry business registered in England & Wales, providing professional 
              makeup services across the UK from our base in Coventry.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">2. Services Offered</h2>
            <p className="mb-3 text-[#6b5d4f] leading-relaxed">We provide the following makeup artistry services:</p>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>Studio makeup appointments</li>
              <li>Bridal makeup (civil, traditional, white wedding)</li>
              <li>Photoshoot glam and fashion makeup</li>
              <li>Graduation and prom makeup</li>
              <li>Party guest makeup (group bookings)</li>
              <li>Bridesmaids makeup services</li>
              <li>Mobile makeup services (travel to your location)</li>
              <li>Gele tying and Nigerian traditional styling</li>
              <li>DIY makeup masterclasses and tutorials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">3. Booking and Payment Terms</h2>
            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Booking Process</h3>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>All bookings must be made through our website booking system or by direct contact</li>
              <li>Bookings are confirmed upon receipt of deposit payment</li>
              <li>We reserve the right to decline bookings at our discretion</li>
            </ul>

            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Payment Terms</h3>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>A deposit of 50% is required to secure all bookings</li>
              <li>Remaining balance is due on the day of service</li>
              <li>Payment can be made via bank transfer, cash, or card (where available)</li>
              <li>All prices are in GBP and include VAT where applicable</li>
              <li>Pricing may vary based on service complexity and location</li>
            </ul>

            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Travel Services</h3>
            <p className="text-[#6b5d4f] leading-relaxed mb-4">
              For mobile makeup services, additional travel fees may apply based on distance from our Coventry base. 
              Travel charges will be clearly communicated during booking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">4. Cancellation and Refund Policy</h2>
            
            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Client Cancellations</h3>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li><strong>More than 48 hours notice:</strong> Full refund of deposit minus 10% administrative fee</li>
              <li><strong>24-48 hours notice:</strong> 50% refund of deposit</li>
              <li><strong>Less than 24 hours notice:</strong> No refund of deposit</li>
              <li><strong>No-show:</strong> Full service charge applies</li>
            </ul>

            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Papromakeovers Cancellations</h3>
            <p className="text-[#6b5d4f] leading-relaxed mb-4">
              In the unlikely event we need to cancel (due to illness or emergency), we will provide as much 
              notice as possible and offer a full refund or reschedule at no extra cost.
            </p>

            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Weather and External Factors</h3>
            <p className="text-[#6b5d4f] leading-relaxed mb-4">
              For outdoor events, services may need to be modified due to weather conditions. We are not liable 
              for cancellations due to extreme weather, but will work with you to find suitable alternatives.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">5. Service Standards and Expectations</h2>
            
            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Our Commitment</h3>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>Professional makeup application using high-quality products</li>
              <li>Punctual arrival and professional conduct</li>
              <li>Clean, sanitized equipment and hygiene practices</li>
              <li>Consultation to understand your preferences</li>
              <li>Photography-ready makeup that lasts throughout your event</li>
            </ul>

            <h3 className="text-xl font-medium text-[#4a4037] mb-3">Client Responsibilities</h3>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>Arrive with clean, moisturized skin</li>
              <li>Disclose any allergies or skin sensitivities</li>
              <li>Provide accurate booking information and requirements</li>
              <li>Ensure suitable lighting and space for mobile services</li>
              <li>Respect our professional time and expertise</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">6. Health and Safety</h2>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>All equipment is sanitized between clients</li>
              <li>We use disposable applicators where possible</li>
              <li>Clients must disclose any skin conditions or allergies</li>
              <li>We reserve the right to refuse service if health concerns arise</li>
              <li>Patch tests can be arranged in advance for sensitive skin</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">7. Photography and Social Media</h2>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              We may request to photograph our work for portfolio and social media purposes. Client consent 
              will always be obtained before using any photographs publicly. You may request that your images 
              not be used for marketing purposes.
            </p>
            <p className="text-[#6b5d4f] leading-relaxed">
              We encourage clients to tag us on social media (@papromakeovers) when sharing photos of our work!
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">8. Limitation of Liability</h2>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              Papromakeovers liability is limited to the amount paid for services. We are not responsible for:
            </p>
            <ul className="list-disc ml-6 mb-4 text-[#6b5d4f] leading-relaxed">
              <li>Allergic reactions to products (where allergies were not disclosed)</li>
              <li>Damage to clothing or personal items</li>
              <li>Event delays or scheduling conflicts beyond our control</li>
              <li>Photography or videography quality affected by external factors</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">9. Force Majeure</h2>
            <p className="text-[#6b5d4f] leading-relaxed">
              We are not liable for delays or cancellations due to circumstances beyond our reasonable control, 
              including but not limited to: natural disasters, government restrictions, public health emergencies, 
              transport strikes, or severe weather conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">10. Intellectual Property</h2>
            <p className="text-[#6b5d4f] leading-relaxed">
              All makeup designs, techniques, and creative work remain the intellectual property of Papromakeovers. 
              The Papromakeovers name, logo, and branding are protected trademarks.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">11. Dispute Resolution</h2>
            <p className="mb-4 text-[#6b5d4f] leading-relaxed">
              We aim to resolve any issues amicably and promptly. If you have concerns about our services, 
              please contact us immediately so we can address them.
            </p>
            <p className="text-[#6b5d4f] leading-relaxed">
              These Terms are governed by English law, and any disputes will be subject to the exclusive 
              jurisdiction of the English courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">12. Data Protection</h2>
            <p className="text-[#6b5d4f] leading-relaxed">
              Your personal information is handled in accordance with our 
              <Link href="/privacy" className="text-[#b49b82] underline">Privacy Policy</Link> 
              and UK data protection laws. We collect and process data solely for the purpose of providing 
              our services and maintaining our business relationship.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">13. Changes to Terms</h2>
            <p className="text-[#6b5d4f] leading-relaxed">
              We may update these Terms from time to time. Any changes will be posted on our website with 
              an updated effective date. Continued use of our services after changes constitutes acceptance 
              of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">14. Contact Information</h2>
            <div className="bg-[#f5f2ed] p-6 rounded-lg">
              <p className="mb-3 text-[#4a4037] font-medium">For questions about these Terms or our services:</p>
              <p className="text-[#6b5d4f]">
                <strong>Business Name:</strong> Papromakeovers<br/>
                <strong>Email:</strong> <a href="mailto:papromakeoversstudio@gmail.com" className="text-[#b49b82] underline">papromakeoversstudio@gmail.com</a><br/>
                <strong>Phone:</strong> +447368590564<br/>
                <strong>Address:</strong> Coventry, United Kingdom<br/>
                <strong>Registration:</strong> Registered in England & Wales
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-[#4a4037] mb-4">15. Acceptance of Terms</h2>
            <p className="text-[#6b5d4f] leading-relaxed">
              By booking our services or using our website, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
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