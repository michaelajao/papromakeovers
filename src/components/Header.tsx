export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#faf8f5]/95 backdrop-blur border-b border-[#d4b896]/20">
      <nav className="max-w-[1200px] mx-auto px-5 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-br from-[#b49b82] to-[#8b7355] bg-clip-text text-transparent">
          Papromakeovers
        </div>
        <ul className="hidden md:flex items-center gap-8 text-sm text-[#4a4037]">
          <li><a className="hover:text-[#b49b82] transition-colors" href="#home">Home</a></li>
          <li><a className="hover:text-[#b49b82] transition-colors" href="#about">About</a></li>
          <li><a className="hover:text-[#b49b82] transition-colors" href="#services">Services</a></li>
          <li><a className="hover:text-[#b49b82] transition-colors" href="#gallery">Gallery</a></li>
          <li><a className="hover:text-[#b49b82] transition-colors" href="#contact">Contact</a></li>
        </ul>
        <a href="#booking" className="rounded-full bg-gradient-to-br from-[#b49b82] to-[#8b7355] text-white font-semibold px-5 py-3 shadow-[0_10px_25px_rgba(180,155,130,0.4)] hover:translate-y-[-2px] transition">
          Book Now
        </a>
      </nav>
    </header>
  );
}


