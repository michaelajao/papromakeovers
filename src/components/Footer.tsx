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
            <a
              className="w-10 h-10 rounded-full grid place-items-center bg-[#d4b896] hover:bg-[#b49b82] text-white transition-colors"
              href="https://www.instagram.com/papromakeovers/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
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
        &copy; 2025 Papromakeovers. All rights reserved. | Registered in England & Wales
      </div>
    </footer>
  );
}


