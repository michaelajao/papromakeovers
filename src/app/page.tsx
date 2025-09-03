import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ServiceCard from "@/components/ServiceCard";

import InstagramEmbed from "@/components/InstagramEmbed";
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
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4a4037] mb-4">About PaproMakeovers</h2>
            <p className="text-[#6b5d4f] mb-4">With over 8 years of experience in the beauty industry, we specialize in creating stunning makeup looks for all occasions. Our passion is helping you look and feel your absolute best.</p>
            <p className="text-[#6b5d4f] mb-4">Whether it&apos;s your wedding day, a special event, or you simply want to treat yourself, we use only the finest products and techniques to ensure a flawless finish that lasts all day.</p>
            <p className="text-[#6b5d4f]">Based in the UK, we offer both studio appointments and mobile services to bring the luxury experience directly to you.</p>
          </div>
          <div className="text-center">
            <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#d4b896] to-[#b49b82] mx-auto flex items-center justify-center text-white font-bold shadow-lg">
              Professional Makeup Artist
              <br />
              8+ Years Experience
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-gradient-to-br from-[#faf8f5] via-[#f5f2ed] to-[#ede7dd] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#d4b896] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#b49b82] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#c4a882] rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-[1200px] mx-auto px-5 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#4a4037] mb-4 tracking-tight">Our Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#d4b896] to-[#b49b82] mx-auto mb-6"></div>
            <p className="text-lg text-[#6b5b4a] max-w-2xl mx-auto leading-relaxed">
              Professional makeup artistry tailored to your unique style and occasion. From everyday elegance to special celebrations.
            </p>
          </div>

          {/* Main Services */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-[#4a4037] mb-3 text-center">✨ Signature Services</h3>
            <p className="text-[#6b5b4a] text-center mb-10 max-w-3xl mx-auto">Our most popular makeup services designed to enhance your natural beauty</p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group">
                <ServiceCard
                  icon="🏢"
                  title="Studio Makeup"
                  value="studio-makeup"
                  description="1 hour · Enjoy a personalised makeover in our studio, created to suit your unique features and preferences. Ideal if you'd love to visit our space for a flawless look for any occasion."
                />
              </div>
              <div className="group">
                <ServiceCard
                  icon="📸"
                  title="Photoshoot Glam"
                  value="photoshoot-glam"
                  description="1 hour 30 minutes · A detailed, camera-ready look that enhances your natural beauty under studio lights. Great for pre-wedding shoots, birthdays, headshots or brand photography."
                />
              </div>
              <div className="group">
                <ServiceCard
                  icon="🎓"
                  title="Graduation & Prom Glam"
                  value="prom-glam"
                  description="1 hour · A youthful, radiant and stylish look for graduation ceremonies and prom night - soft glam or bold drama to match your vibe and outfit."
                />
              </div>
            </div>
          </div>

          {/* Party & Group Services */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-[#4a4037] mb-3 text-center">🎉 Party & Group Services</h3>
            <p className="text-[#6b5b4a] text-center mb-10 max-w-3xl mx-auto">Perfect for celebrations and group bookings with special rates</p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group">
                <ServiceCard
                  icon="🎉"
                  title="Party Guest Makeup"
                  value="party-guest-makeup"
                  description="Perfect for weddings, birthdays and celebrations. Ideal for mother of the bride/groom and siblings. This is a group booking (minimum of 3 people)."
                />
              </div>
              <div className="group">
                <ServiceCard
                  icon="👯"
                  title="Bridesmaids Bookings"
                  value="bridesmaids-bookings"
                  description="Cohesive, elegant looks for the bridal party. Long-lasting and picture-perfect for a full day of celebration. Group booking (minimum of 3 people)."
                />
              </div>
              <div className="group">
                <ServiceCard
                  icon="🚗"
                  title="Travel Makeup Service"
                  value="travel-makeup"
                  description="1 hour 30 minutes · Bringing the glam to your home, hotel or venue. Note: additional travel fees apply based on location."
                />
              </div>
            </div>
          </div>

          {/* Bridal Services - Enhanced */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-[#f5f2ed] to-[#ede7dd] rounded-3xl p-10 shadow-xl border border-[#e5ddd1]">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-[#4a4037] mb-4 tracking-tight">💒 Bridal Services</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-[#d4b896] to-[#b49b82] mx-auto mb-6"></div>
                <p className="text-lg text-[#6b5b4a] max-w-2xl mx-auto leading-relaxed">
                  Your wedding day deserves perfection. Our bridal makeup services ensure you look and feel absolutely radiant on your special day.
                </p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="group transform hover:scale-105 transition-all duration-300">
                  <ServiceCard 
                    icon="💍" 
                    title="Civil Wedding" 
                    value="bridal-civil"
                    description="Elegant and refined makeup for your intimate civil ceremony. Timeless beauty that photographs beautifully."
                  />
                </div>
                <div className="group transform hover:scale-105 transition-all duration-300">
                  <ServiceCard 
                    icon="🧕" 
                    title="Traditional Wedding" 
                    value="bridal-traditional"
                    description="Rich, cultural makeup that honours your heritage while enhancing your natural beauty for traditional ceremonies."
                  />
        </div>
                <div className="group transform hover:scale-105 transition-all duration-300">
                  <ServiceCard 
                    icon="👰" 
                    title="White Wedding" 
                    value="bridal-white"
                    description="Classic bridal glam with long-lasting coverage perfect for your white wedding celebration and photos."
                  />
                </div>
                <div className="group transform hover:scale-105 transition-all duration-300">
                  <ServiceCard 
                    icon="💫" 
                    title="Complete Bridal Package" 
                    value="bridal-combination"
                    description="The ultimate bridal experience combining multiple ceremonies with coordinated looks throughout your celebration."
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3 border border-[#d4b896]/30">
                  <span className="text-[#4a4037] font-medium">💝 Special bridal packages available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Learning & Specialty */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#4a4037] mb-3">🧑‍🎓 Learn & Master</h3>
            <p className="text-[#6b5b4a] mb-10 max-w-2xl mx-auto">Master the art of makeup with our personalised teaching sessions</p>
            <div className="max-w-md mx-auto">
              <div className="group">
                <ServiceCard
                  icon="🧑‍🎓"
                  title="DIY Makeup Masterclass"
                  value="diy-makeup-class"
                  description="3 hours · A personalised lesson covering everyday basics or glam techniques - tailored to your level so you feel confident doing your own makeup."
                />
              </div>
            </div>
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

      <section id="gallery" className="py-24 bg-[#f5f2ed]">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#4a4037] mb-12">Our Work</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(galleryFiles.length ? galleryFiles : ["couple-1.jpg","couple-2.jpg","headshot-1.jpg","fashion-1.jpg","beauty-1.jpg"]).map((file) => (
              <div key={file} className="aspect-square overflow-hidden rounded-2xl bg-[#e9e3db] hover:scale-[1.01] transition shadow-lg">
                <img src={`/gallery/${file}`} alt="Gallery item" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-center text-[#4a4037] mb-6">Latest on Instagram</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {[
                "https://www.instagram.com/reel/DGjIKr9NSJe/",
                "https://www.instagram.com/reel/DGbEDsntKfI/",
                "https://www.instagram.com/reel/DKKtN-AtzDf/",
                "https://www.instagram.com/reel/DHnIsGoNqAp/",
              ].map((u) => (
                <InstagramEmbed key={u} url={u} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
