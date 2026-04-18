"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Mount-once client component that wires up IntersectionObserver to flip any
 * element with `data-reveal` from hidden (via the `.reveal` CSS class) to
 * visible (via `data-revealed="true"`). The CSS lives in globals.css.
 *
 * Place it once in the root layout. No props, no re-renders.
 */
export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (prefersReducedMotion) {
      // Mark everything revealed immediately; the CSS @media already forces it
      // but we still set the attribute for any child-selector usage.
      elements.forEach((el) => el.setAttribute("data-revealed", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    elements.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
