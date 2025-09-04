import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found - Papromakeovers",
  description: "The page you're looking for doesn't exist. Browse our makeup services or return to the home page.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#4a4037] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-5 text-center">
        {/* Error number */}
        <div className="mb-8">
          <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-br from-[#b49b82] to-[#8b7355] bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Error message */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#4a4037] mb-4">
            Oops! This page has vanished like yesterday&apos;s makeup
          </h2>
          <p className="text-lg text-[#6b5d4f] mb-6 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist. It might have been moved, renamed, or perhaps it never existed in the first place.
          </p>
          <p className="text-[#6b5d4f]">
            Don&apos;t worry though – we have plenty of beautiful makeup services waiting for you!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#b49b82] to-[#8b7355] text-white px-8 py-4 rounded-full font-semibold hover:from-[#a48a72] hover:to-[#7a6345] transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          
          <Link 
            href="/#booking"
            className="inline-flex items-center gap-2 border-2 border-[#b49b82] text-[#b49b82] px-8 py-4 rounded-full font-semibold hover:bg-[#b49b82] hover:text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Appointment
          </Link>
        </div>

        {/* Quick navigation */}
        <div className="border-t border-[#e5ddd1] pt-8">
          <h3 className="text-lg font-semibold text-[#4a4037] mb-4">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Link 
              href="/#services"
              className="text-[#6b5d4f] hover:text-[#b49b82] transition-colors p-2"
            >
              Our Services
            </Link>
            <Link 
              href="/#gallery"
              className="text-[#6b5d4f] hover:text-[#b49b82] transition-colors p-2"
            >
              Gallery
            </Link>
            <Link 
              href="/#about"
              className="text-[#6b5d4f] hover:text-[#b49b82] transition-colors p-2"
            >
              About Us
            </Link>
            <Link 
              href="/#contact"
              className="text-[#6b5d4f] hover:text-[#b49b82] transition-colors p-2"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Contact information */}
        <div className="mt-12 bg-[#f5f2ed] p-6 rounded-lg">
          <h4 className="font-semibold text-[#4a4037] mb-3">
            Need help? Get in touch!
          </h4>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-[#6b5d4f]">
            <a 
              href="tel:+447368590564"
              className="flex items-center gap-2 hover:text-[#b49b82] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +44 7368 590564
            </a>
            <span className="hidden sm:block">•</span>
            <a 
              href="mailto:papromakeoversstudio@gmail.com"
              className="flex items-center gap-2 hover:text-[#b49b82] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              papromakeoversstudio@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}