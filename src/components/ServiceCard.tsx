import { formatPriceFrom } from "@/lib/price";

type Props = {
  title: string;
  description?: string;
  features?: string[];
  value: string;
  category?: string;
  priceFrom?: number | null;
};

export default function ServiceCard({ title, description, features, value, category, priceFrom }: Props) {
  const priceLabel = formatPriceFrom(priceFrom);
  return (
    <div className="group h-full flex flex-col bg-white p-8 border border-[#f5f2ed] hover:border-[#d4b896] transition-all duration-300 text-left focus-within:border-[#d4b896] active:border-[#d4b896]">
      <div className="flex-1">
        {category && (
          <div className="text-xs font-light text-[#b49b82] mb-3 tracking-[0.2em] uppercase">
            {category}
          </div>
        )}

        <h3 className="font-serif text-2xl font-normal text-[#3a322b] mb-3 leading-tight">
          {title}
        </h3>

        {priceLabel && (
          <div className="mb-5 inline-flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b7355]">{priceLabel.split(" ")[0]}</span>
            <span className="font-serif text-2xl font-medium text-[#7a2e3f]">{priceLabel.replace(/^From\s*/, "")}</span>
          </div>
        )}

        {description ? (
          <p className="text-[#5c5048] mb-6 leading-relaxed text-sm">
            {description}
          </p>
        ) : null}

        {features?.length ? (
          <ul className="text-left text-[#5c5048] mb-6 space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className="text-[#d4b896] font-bold mt-0.5" aria-hidden="true">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <a
        href={`/?service=${encodeURIComponent(value)}#booking`}
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white font-semibold px-7 py-3 shadow-[0_4px_16px_rgba(180,155,130,0.35)] hover:shadow-[0_6px_22px_rgba(180,155,130,0.5)] hover:from-[#c4a882] hover:to-[#a48a72] transform hover:translate-y-[-1px] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[#d4b896] focus-visible:ring-offset-2 transition-all duration-300 self-start"
      >
        <span>Book This Service</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}
