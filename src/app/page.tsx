import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import GalleryLightbox from "@/components/GalleryLightbox";
import Image from "next/image";
import path from "path";
import { promises as fs } from "fs";
import { getActiveServices, getFeaturedTestimonials } from "@/lib/services-data";

type GalleryFile = { file: string; alt: string };

// Files used elsewhere on the page (About portrait, social share image) —
// keep them in /public/gallery/ so their URLs still resolve for OG/Twitter/
// JSON-LD, but skip them in the public gallery grid so the same face doesn't
// appear twice on one page.
const GALLERY_EXCLUDE = new Set(["IMG_2177.PNG"]);

function toGalleryAlt(file: string): string {
  const base = file.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
  const cleaned = base.replace(/\b(img|image|dsc|pic)\b/gi, "").trim();
  const pretty = cleaned.length > 0 ? cleaned : "Makeup artistry portfolio";
  return `Papromakeovers ${pretty} look`.replace(/\s+/g, " ").trim();
}

export default async function Home() {
  const galleryDir = path.join(process.cwd(), "public", "gallery");
  let galleryFiles: GalleryFile[] = [];
  try {
    const entries = await fs.readdir(galleryDir);
    galleryFiles = entries
      .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f) && !GALLERY_EXCLUDE.has(f))
      .map((file) => ({ file, alt: toGalleryAlt(file) }));
  } catch {
    galleryFiles = [];
  }

  const [services, testimonials] = await Promise.all([
    getActiveServices(),
    getFeaturedTestimonials(),
  ]);

  return (
    <div className="min-h-screen text-[#4a4037] bg-[#faf8f5]">
      <Header />

      <main id="main">
        <section
          id="home"
          className="h-[100svh] relative flex items-center justify-center text-center px-6"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(205, 180, 155, 0.15), rgba(180, 155, 130, 0.1)), url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 1000 600\\'><rect fill=\\'%23faf8f5\\' width=\\'1000\\' height=\\'600\\'/><circle fill=\\'%23d4b896\\' opacity=\\'0.2\\' cx=\\'200\\' cy=\\'150\\' r=\\'100\\'/><circle fill=\\'%23b49b82\\' opacity=\\'0.15\\' cx=\\'800\\' cy=\\'400\\' r=\\'150\\'/><path fill=\\'%23d4b896\\' opacity=\\'0.1\\' d=\\'M0,300 Q250,100 500,300 T1000,300 L1000,600 L0,600 Z\\'/></svg>')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-[820px] animate-[fadeInUp_1s_ease]">
            <div className="text-xs uppercase tracking-[0.35em] text-[#b49b82] mb-5">Coventry · Mobile across the UK</div>
            <h1 className="font-serif text-5xl sm:text-7xl mb-5 bg-gradient-to-br from-[#b49b82] to-[#8b7355] bg-clip-text text-transparent leading-[1.05]">
              Transform Your Beauty
            </h1>
            <p className="text-lg text-[#5c5048] mb-8 max-w-xl mx-auto">
              Professional makeup artistry for every occasion. From bridal to special events,
              we create stunning looks that make you feel confident and beautiful.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#booking" className="rounded-full bg-[#7a2e3f] text-white font-semibold px-7 py-3.5 shadow-[0_10px_25px_rgba(122,46,63,0.35)] hover:bg-[#5c1f2c] hover:translate-y-[-2px] transition">Reserve Your Chair</a>
              <a href="#services" className="rounded-full border-2 border-[#b49b82] text-[#8b7355] font-semibold px-6 py-3 hover:bg-[#b49b82] hover:text-white transition">Explore Services</a>
            </div>
          </div>
        </section>

        <section id="about" className="py-24 bg-[#f5f2ed]">
          <div className="max-w-[1200px] mx-auto px-5 grid md:grid-cols-2 gap-16 items-center">
            <div data-reveal>
              <div className="text-xs uppercase tracking-[0.3em] text-[#b49b82] mb-4">Our Story</div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#3a322b] mb-6 font-normal">About Papromakeovers</h2>
              <div className="w-12 h-px bg-[#d4b896] mb-8" aria-hidden="true" />
              <p className="text-[#5c5048] mb-4 leading-relaxed">With over 8 years of experience in the beauty industry, we specialize in creating stunning makeup looks for all occasions. Our passion is helping you look and feel your absolute best.</p>
              <p className="text-[#5c5048] mb-4 leading-relaxed">Whether it&apos;s your wedding day, a special event, or you simply want to treat yourself, we use only the finest products and techniques to ensure a flawless finish that lasts all day.</p>
              <p className="text-[#5c5048] leading-relaxed">Based in the UK, we offer both studio appointments and mobile services to bring the luxury experience directly to you.</p>
            </div>
            <div className="text-center" data-reveal>
              <div className="relative w-[300px] h-[300px] mx-auto">
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_20px_40px_rgba(180,155,130,0.3)] border-4 border-[#d4b896]">
                  <Image
                    src="/gallery/IMG_2177.PNG"
                    alt="Professional makeup artist portrait – Papromakeovers founder"
                    fill
                    sizes="300px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-[#e5ddd1]">
                  <span className="text-[#4a4037] font-semibold text-sm">8+ Years Experience</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServicesSection services={services} />

        <section id="gallery" className="py-24 bg-[#f5f2ed]">
          <div className="max-w-[1200px] mx-auto px-5">
            <div className="text-center mb-16" data-reveal>
              <div className="text-xs uppercase tracking-[0.3em] text-[#b49b82] mb-4">Portfolio</div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#3a322b] mb-6 font-normal">Our Work</h2>
              <div className="w-12 h-px bg-[#d4b896] mx-auto" aria-hidden="true" />
              <p className="mt-6 text-sm text-[#6b5d4f]">Tap any look to see it full screen.</p>
            </div>

            <GalleryLightbox files={galleryFiles} />

            <div className="mt-12 text-center">
              <a
                href="https://www.instagram.com/papromakeovers/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:from-[#c4a882] hover:to-[#a48a72] transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Follow us on Instagram</span>
              </a>
            </div>
          </div>
        </section>

        <TestimonialsSection testimonials={testimonials} />

        <FAQSection />

        <section id="booking" className="py-24 bg-[#faf8f5] border-t border-[#e5ddd1]">
          <div className="max-w-[1200px] mx-auto px-5">
            <div className="text-center mb-14" data-reveal>
              <div className="text-xs uppercase tracking-[0.3em] text-[#b49b82] mb-4">Reserve Your Date</div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#3a322b] mb-4 font-normal">Book Your Appointment</h2>
              <div className="w-12 h-px bg-[#7a2e3f] mx-auto mb-6" aria-hidden="true" />
              <p className="text-[#5c5048] max-w-xl mx-auto">Submit a booking request and we&apos;ll confirm within 24 hours.</p>
            </div>

            <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#f5f2ed] shadow-[0_20px_60px_rgba(122,46,63,0.08)]" data-reveal>
                <BookingForm />
              </div>

              <aside className="space-y-5 lg:sticky lg:top-24" data-reveal>
                {testimonials.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-[#f5f2ed]">
                    <div className="flex items-center gap-1 text-[#7a2e3f] mb-2" aria-label="5 out of 5 stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.45a1 1 0 00-.363 1.118l1.287 3.964c.3.922-.755 1.688-1.54 1.118l-3.374-2.45a1 1 0 00-1.175 0l-3.374 2.45c-.784.57-1.838-.196-1.539-1.118l1.287-3.964a1 1 0 00-.363-1.118l-3.374-2.45c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.964z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="font-serif text-[#3a322b] text-sm leading-relaxed">
                      &ldquo;{testimonials[0].quote}&rdquo;
                    </blockquote>
                    <div className="mt-3 text-xs text-[#8b7355]">— {testimonials[0].client_name}</div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
