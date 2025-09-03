import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import ServiceCard from "@/components/ServiceCard";

export default function Home() {
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

      <section id="services" className="py-24 bg-[#faf8f5]">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#4a4037] mb-12">Our Services</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ServiceCard icon="💄" title="Bridal Makeup" price="From £150" description="Perfect for your special day with a trial session included" features={["Pre-wedding consultation", "Trial makeup session", "Wedding day application", "Touch-up kit included", "Travel to venue"]} />
            <ServiceCard icon="✨" title="Special Events" price="From £80" description="Glamorous looks for parties, proms, and special occasions" features={["Professional makeup application", "Lashes included", "Photo-ready finish", "2-hour duration", "Product recommendations"]} />
            <ServiceCard icon="📸" title="Photoshoot Makeup" price="From £100" description="Camera-ready makeup for professional photoshoots" features={["HD makeup application", "Multiple look options", "Touch-ups during shoot", "Collaboration with photographer", "Portfolio-worthy results"]} />
            <ServiceCard icon="🎓" title="Makeup Lessons" price="From £120" description="Learn professional techniques in a personalized session" features={["2-hour personal session", "Technique demonstrations", "Product recommendations", "Practice time", "Take-home guide"]} />
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
            {["Bridal Look 1","Evening Glam","Natural Beauty","Special Event","Photoshoot","Bridal Look 2","Red Carpet","Editorial"].map((label) => (
              <div key={label} className="aspect-square rounded-2xl bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white font-semibold grid place-items-center hover:scale-105 transition shadow-lg">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
