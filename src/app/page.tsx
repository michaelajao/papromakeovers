import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ServiceCard from "@/components/ServiceCard";
import Image from "next/image";


import path from "path";
import { promises as fs } from "fs";

export default async function Home() {
  // Load gallery images from /public/gallery automatically
  const galleryDir = path.join(process.cwd(), "public", "gallery");
  let galleryFiles: string[] = [];
  try {
    const entries = await fs.readdir(galleryDir);
    galleryFiles = entries.filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
  } catch {
    galleryFiles = [];
  }
  // Preselect service from query (?service=slug) for deep-link from cards
  // We use URL parsing on client, but also set a data attribute for hydration hints if needed
  return (
    <div className="min-h-screen text-[#4a4037] bg-[#faf8f5]">
      <Header />

      <section id="home" className="h-[100svh] relative flex items-center justify-center text-center px-6" style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(205, 180, 155, 0.15), rgba(180, 155, 130, 0.1)), url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 1000 600\\'><rect fill=\\'%23faf8f5\\' width=\\'1000\\' height=\\'600\\'/><circle fill=\\'%23d4b896\\' opacity=\\'0.2\\' cx=\\'200\\' cy=\\'150\\' r=\\'100\\'/><circle fill=\\'%23b49b82\\' opacity=\\'0.15\\' cx=\\'800\\' cy=\\'400\\' r=\\'150\\'/><path fill=\\'%23d4b896\\' opacity=\\'0.1\\' d=\\'M0,300 Q250,100 500,300 T1000,300 L1000,600 L0,600 Z\\'/></svg>')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="max-w-[800px] animate-[fadeInUp_1s_ease]">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 bg-gradient-to-br from-[#b49b82] to-[#8b7355] bg-clip-text text-transparent">
            Transform Your Beauty
          </h1>
          <p className="text-lg text-[#6b5d4f] mb-8">
            Professional makeup artistry for every occasion. From bridal to special events,
            we create stunning looks that make you feel confident and beautiful.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#booking" className="rounded-full bg-gradient-to-br from-[#b49b82] to-[#8b7355] text-white font-semibold px-6 py-3 shadow-[0_10px_25px_rgba(180,155,130,0.4)] hover:translate-y-[-2px] transition">Book Appointment</a>
            <a href="#services" className="rounded-full border-2 border-[#b49b82] text-[#b49b82] font-semibold px-6 py-3 hover:bg-[#b49b82] hover:text-white transition">View Services</a>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-[#f5f2ed]">
        <div className="max-w-[1200px] mx-auto px-5 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4a4037] mb-4">About Papromakeovers</h2>
            <p className="text-[#6b5d4f] mb-4">With over 8 years of experience in the beauty industry, we specialize in creating stunning makeup looks for all occasions. Our passion is helping you look and feel your absolute best.</p>
            <p className="text-[#6b5d4f] mb-4">Whether it&apos;s your wedding day, a special event, or you simply want to treat yourself, we use only the finest products and techniques to ensure a flawless finish that lasts all day.</p>
            <p className="text-[#6b5d4f]">Based in the UK, we offer both studio appointments and mobile services to bring the luxury experience directly to you.</p>
          </div>
          <div className="text-center">
            <div className="relative w-[300px] h-[300px] mx-auto">
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_20px_40px_rgba(180,155,130,0.3)] border-4 border-[#d4b896]">
                <Image 
                  src="/gallery/IMG_2177.PNG" 
                  alt="Professional Makeup Artist" 
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-[#e5ddd1]">
                <span className="text-[#4a4037] font-semibold text-sm">8+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-[#4a4037] mb-6 tracking-wide">Our Services</h2>
            <div className="w-12 h-px bg-[#d4b896] mx-auto mb-8"></div>
            <p className="text-lg text-[#6b5b4a] max-w-xl mx-auto font-light leading-relaxed">
              Professional makeup artistry tailored to your unique style and occasion.
            </p>
          </div>

          {/* Main Services */}
          <div className="mb-20">
            <h3 className="text-xl font-light text-[#4a4037] mb-12 text-center tracking-wide">Signature Services</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="transform hover:scale-105 active:scale-[1.02] focus-within:scale-[1.02] transition-all duration-300">
                <ServiceCard
                  title="Studio Makeup"
                  value="studio-makeup"
                  category="Signature Service"
                  description="1 hour · Enjoy a personalised makeover in our studio, created to suit your unique features and preferences. Ideal if you'd love to visit our space for a flawless look for any occasion."
                />
              </div>
              <div className="transform hover:scale-105 active:scale-[1.02] focus-within:scale-[1.02] transition-all duration-300">
                <ServiceCard
                  title="Photoshoot Glam"
                  value="photoshoot-glam"
                  category="Signature Service"
                  description="1 hour 30 minutes · A detailed, camera-ready look that enhances your natural beauty under studio lights. Great for pre-wedding shoots, birthdays, headshots or brand photography."
                />
              </div>
              <div className="transform hover:scale-105 active:scale-[1.02] focus-within:scale-[1.02] transition-all duration-300">
                <ServiceCard
                  title="Graduation & Prom Glam"
                  value="prom-glam"
                  category="Signature Service"
                  description="1 hour · A youthful, radiant and stylish look for graduation ceremonies and prom night - soft glam or bold drama to match your vibe and outfit."
                />
              </div>
            </div>
          </div>

          {/* Party & Group Services */}
          <div className="mb-20">
            <h3 className="text-xl font-light text-[#4a4037] mb-12 text-center tracking-wide">Group Services</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="transform hover:scale-105 active:scale-[1.02] focus-within:scale-[1.02] transition-all duration-300">
                <ServiceCard
                  title="Party Guest Makeup"
                  value="party-guest-makeup"
                  category="Group Service"
                  description="Perfect for weddings, birthdays and celebrations. Ideal for mother of the bride/groom and siblings. This is a group booking (minimum of 3 people)."
                />
              </div>
              <div className="transform hover:scale-105 active:scale-[1.02] focus-within:scale-[1.02] transition-all duration-300">
                <ServiceCard
                  title="Bridesmaids Bookings"
                  value="bridesmaids-bookings"
                  category="Group Service"
                  description="Cohesive, elegant looks for the bridal party. Long-lasting and picture-perfect for a full day of celebration. Group booking (minimum of 3 people)."
                />
              </div>
              <div className="transform hover:scale-105 active:scale-[1.02] focus-within:scale-[1.02] transition-all duration-300">
                <ServiceCard
                  title="Travel Makeup Service"
                  value="travel-makeup"
                  category="Mobile Service"
                  description="1 hour 30 minutes · Bringing the glam to your home, hotel or venue. Note: additional travel fees apply based on location."
                />
              </div>
            </div>
          </div>

          {/* Bridal Services */}
          <div className="mb-20">
            <div className="border-t border-[#f5f2ed] pt-16">
              <div className="text-center mb-16">
                <h3 className="text-xl font-light text-[#4a4037] mb-4 tracking-wide">Bridal Services</h3>
                <div className="w-12 h-px bg-[#d4b896] mx-auto mb-8"></div>
                <p className="text-base text-[#6b5b4a] max-w-lg mx-auto font-light leading-relaxed">
                  Your wedding day deserves perfection. Timeless beauty for your special day.
                </p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="group transform hover:scale-105 transition-all duration-300">
                  <ServiceCard 
                    title="Civil Wedding" 
                    value="bridal-civil"
                    category="Bridal Service"
                    description="Elegant and refined makeup for your intimate civil ceremony. Timeless beauty that photographs beautifully."
                  />
                </div>
                <div className="group transform hover:scale-105 transition-all duration-300">
                  <ServiceCard 
                    title="Traditional Wedding" 
                    value="bridal-traditional"
                    category="Bridal Service"
                    description="Rich, cultural makeup that honours your heritage while enhancing your natural beauty for traditional ceremonies."
                  />
        </div>
                <div className="group transform hover:scale-105 transition-all duration-300">
                  <ServiceCard 
                    title="White Wedding" 
                    value="bridal-white"
                    category="Bridal Service"
                    description="Classic bridal glam with long-lasting coverage perfect for your white wedding celebration and photos."
                  />
                </div>
                <div className="group transform hover:scale-105 transition-all duration-300">
                  <ServiceCard 
                    title="Complete Bridal Package" 
                    value="bridal-combination"
                    category="Premium Package"
                    description="The ultimate bridal experience combining multiple ceremonies with coordinated looks throughout your celebration."
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Learning & Specialty */}
          <div className="border-t border-[#f5f2ed] pt-16">
            <div className="text-center mb-12">
              <h3 className="text-xl font-light text-[#4a4037] mb-4 tracking-wide">Education</h3>
              <div className="w-12 h-px bg-[#d4b896] mx-auto"></div>
            </div>
            <div className="max-w-md mx-auto">
              <div className="transform hover:scale-105 active:scale-[1.02] focus-within:scale-[1.02] transition-all duration-300">
                <ServiceCard
                  title="DIY Makeup Masterclass"
                  value="diy-makeup-class"
                  category="Education"
                  description="3 hours · A personalised lesson covering everyday basics or glam techniques - tailored to your level so you feel confident doing your own makeup."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-24 bg-[#f5f2ed]">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#4a4037] mb-12">Our Work</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(galleryFiles.length ? galleryFiles : ["couple-1.jpg","couple-2.jpg","headshot-1.jpg","fashion-1.jpg","beauty-1.jpg"]).map((file) => (
              <div key={file} className="relative aspect-square overflow-hidden rounded-2xl bg-[#e9e3db] hover:scale-[1.01] transition shadow-lg">
                <Image 
                  src={`/gallery/${file}`} 
                  alt="Gallery item" 
                  fill 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover" 
                />
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a 
              href="https://www.instagram.com/papromakeovers/" 
          target="_blank"
          rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:from-[#c4a882] hover:to-[#a48a72] transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Follow us on Instagram</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section id="booking" className="py-24 bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Book Your Appointment</h2>
          <p className="text-white/90 mb-8">Ready to transform your look? Book your appointment today and let us create something beautiful together.</p>

          <div className="max-w-[720px] mx-auto text-left bg-white/15 p-6 rounded-2xl backdrop-blur border border-white/20">
            <BookingForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
