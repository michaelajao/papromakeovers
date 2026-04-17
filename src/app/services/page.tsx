import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import { getActiveServices } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Services & Pricing — Papromakeovers",
  description:
    "Explore our full range of professional makeup services including bridal, photoshoot glam, prom, gele tying, and mobile services with transparent starting prices.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getActiveServices();

  const priceList = services
    .filter((s) => s.price_from != null)
    .map((s) => Number(s.price_from));
  const minPrice = priceList.length ? Math.min(...priceList) : null;
  const maxPrice = priceList.length ? Math.max(...priceList) : null;

  return (
    <div className="min-h-screen text-[#4a4037] bg-[#faf8f5]">
      <Header />

      <main id="main" className="pt-24">
        <section className="py-20 bg-[#faf8f5]">
          <div className="max-w-[860px] mx-auto px-5 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-[#b49b82] mb-5">Services</div>
            <h1 className="font-serif text-5xl sm:text-6xl text-[#3a322b] mb-6 font-normal">
              Services &amp; Pricing
            </h1>
            <div className="w-12 h-px bg-[#d4b896] mx-auto mb-8" aria-hidden="true" />
            <p className="text-lg text-[#5c5048] leading-relaxed">
              Every look is tailored. Starting prices reflect a solo appointment at our studio — travel,
              group bookings and additional services are quoted after your request.
              {minPrice != null && maxPrice != null && (
                <> Services range from <span className="text-[#3a322b] font-medium">£{minPrice}</span> to <span className="text-[#3a322b] font-medium">£{maxPrice}+</span>.</>
              )}
            </p>
          </div>
        </section>

        <ServicesSection services={services} showHeading={false} />

        <section className="py-20 bg-[#f5f2ed]">
          <div className="max-w-[720px] mx-auto px-5 text-center">
            <h2 className="font-serif text-3xl text-[#3a322b] mb-4">Ready to book?</h2>
            <p className="text-[#5c5048] mb-8">
              Submit a booking request and we&apos;ll confirm your date within 24 hours with a tailored quote.
            </p>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#b49b82] to-[#8b7355] text-white font-semibold px-8 py-3 shadow-lg hover:translate-y-[-2px] transition"
            >
              Book Appointment
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
