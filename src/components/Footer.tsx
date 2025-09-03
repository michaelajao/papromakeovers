export default function Footer() {
  return (
    <footer id="contact" className="bg-[#4a4037] text-[#f5f2ed] py-12">
      <div className="max-w-[1200px] mx-auto px-5 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-[#d4b896] font-semibold mb-2">Contact Us</h3>
          <p>📍 Coventry, United Kingdom</p>
          <p>📞 +447368590564</p>
          <p>✉️ papromakeoversstudios@gmail.com</p>
          <div className="flex gap-3 mt-4">
            <a className="w-10 h-10 rounded-full grid place-items-center bg-[#d4b896] hover:bg-[#b49b82] transition-colors" href="https://www.instagram.com/papromakeovers/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📷</a>
          </div>
        </div>
        <div>
          <h3 className="text-[#d4b896] font-semibold mb-2">Services</h3>
          {['Studio makeup','Party guest makeup','Photoshoot glam','Bridesmaids bookings','Graduation & Prom Glam','Travel to client location makeup service','DIY one on one makeup class'].map((s) => (
            <p key={s}><a href="#services" className="text-[#f5f2ed]/80 hover:text-[#d4b896] transition-colors">{s}</a></p>
          ))}
        </div>
        <div>
          <h3 className="text-[#d4b896] font-semibold mb-2">Business Hours</h3>
          <p className="text-[#f5f2ed]/90">Monday - Friday: 9:00 AM - 8:00 PM</p>
          <p className="text-[#f5f2ed]/90">Saturday: 8:00 AM - 9:00 PM</p>
          <p className="text-[#f5f2ed]/90">Sunday: 10:00 AM - 6:00 PM</p>
          <p className="text-[#f5f2ed]/90">Appointments available outside hours</p>
        </div>
        <div>
          <h3 className="text-[#d4b896] font-semibold mb-2">About</h3>
          <p className="text-[#f5f2ed]/80">Professional makeup artist serving the UK with 8+ years of experience. Specializing in bridal, special events, and photoshoot makeup.</p>
        </div>
      </div>
      <div className="text-center text-[#f5f2ed]/70 mt-8 pt-8 border-t border-[#f5f2ed]/10">
        &copy; 2025 PaproMakeovers. All rights reserved. | Registered in England & Wales
      </div>
    </footer>
  );
}


