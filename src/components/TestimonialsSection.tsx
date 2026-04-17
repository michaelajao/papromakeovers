import type { TestimonialRow } from "@/types/service";

export default function TestimonialsSection({ testimonials }: { testimonials: TestimonialRow[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-[#faf8f5]">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-[#b49b82] mb-4">Client Stories</div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#3a322b] mb-6 font-normal">Kind Words</h2>
          <div className="w-12 h-px bg-[#d4b896] mx-auto" aria-hidden="true" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="bg-white border border-[#f5f2ed] p-8 flex flex-col gap-5 hover:border-[#d4b896] transition-colors"
            >
              <div className="flex items-center gap-1 text-[#d4b896]" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.45a1 1 0 00-.363 1.118l1.287 3.964c.3.922-.755 1.688-1.54 1.118l-3.374-2.45a1 1 0 00-1.175 0l-3.374 2.45c-.784.57-1.838-.196-1.539-1.118l1.287-3.964a1 1 0 00-.363-1.118l-3.374-2.45c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.964z" />
                  </svg>
                ))}
              </div>
              <blockquote className="font-serif text-lg text-[#3a322b] leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="text-sm text-[#5c5048] border-t border-[#f5f2ed] pt-4">
                <span className="font-medium text-[#3a322b]">{t.client_name}</span>
                {t.service_slug && (
                  <span className="text-[#8b7355]"> · {t.service_slug.replace(/-/g, " ")}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
