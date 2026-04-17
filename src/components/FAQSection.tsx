import { FAQ_ITEMS } from "@/data/faq";

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-[860px] mx-auto px-5">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-[#b49b82] mb-4">Questions</div>
          <h2 className="font-serif text-4xl sm:text-5xl text-[#3a322b] mb-6 font-normal">Frequently Asked</h2>
          <div className="w-12 h-px bg-[#d4b896] mx-auto" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <details
              key={idx}
              className="group border border-[#f5f2ed] bg-[#faf8f5] open:bg-white open:border-[#d4b896] transition-colors"
            >
              <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between gap-4 text-[#3a322b] font-medium focus-visible:outline-2 focus-visible:outline-[#b49b82]">
                <span className="font-serif text-lg">{item.q}</span>
                <svg
                  className="w-4 h-4 text-[#b49b82] flex-shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-[#5c5048] leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
    </section>
  );
}
