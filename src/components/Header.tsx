"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#faf8f5]/95 backdrop-blur border-b border-[#d4b896]/20">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:text-[#4a4037] focus:px-4 focus:py-2 focus:rounded focus:shadow"
      >
        Skip to content
      </a>
      <nav className="max-w-[1200px] mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-wide bg-gradient-to-br from-[#b49b82] to-[#8b7355] bg-clip-text text-transparent">
          Papromakeovers
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm text-[#4a4037]">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link className="hover:text-[#b49b82] transition-colors" href={l.href}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/#booking"
            className="hidden sm:inline-flex rounded-full bg-gradient-to-br from-[#b49b82] to-[#8b7355] text-white font-semibold px-5 py-3 shadow-[0_10px_25px_rgba(180,155,130,0.4)] hover:translate-y-[-2px] transition"
          >
            Book Now
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open ? "true" : "false"}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded text-[#4a4037] hover:text-[#b49b82] focus-visible:ring-2 focus-visible:ring-[#d4b896]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <>
          <div
            className="md:hidden fixed inset-0 top-[64px] bg-[#3a322b]/40 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav"
            className="md:hidden fixed left-0 right-0 top-[64px] bg-[#faf8f5] border-b border-[#d4b896]/30 shadow-xl z-50"
          >
            <ul className="flex flex-col py-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 text-[#4a4037] border-b border-[#f5f2ed] hover:bg-[#f5f2ed] hover:text-[#b49b82] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="p-4">
                <Link
                  href="/#booking"
                  onClick={() => setOpen(false)}
                  className="block text-center rounded-full bg-gradient-to-br from-[#b49b82] to-[#8b7355] text-white font-semibold px-5 py-3 shadow-[0_10px_25px_rgba(180,155,130,0.4)]"
                >
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
