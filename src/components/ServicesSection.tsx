import ServiceCard from "@/components/ServiceCard";
import { groupByCategory } from "@/lib/services-data";
import type { ServiceRow } from "@/types/service";

const CATEGORY_ORDER = ["Signature", "Group", "Bridal", "Education"];
const CATEGORY_LABELS: Record<string, string> = {
  Signature: "Signature Services",
  Group: "Group Services",
  Bridal: "Bridal Services",
  Education: "Education",
};

export default function ServicesSection({
  services,
  showHeading = true,
  heading = "Our Services",
  subheading = "Professional makeup artistry tailored to your unique style and occasion.",
}: {
  services: ServiceRow[];
  showHeading?: boolean;
  heading?: string;
  subheading?: string;
}) {
  const grouped = groupByCategory(services);
  const sortedCategories = CATEGORY_ORDER.filter((c) => grouped.has(c)).concat(
    [...grouped.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
  );

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        {showHeading && (
          <div className="text-center mb-20">
            <div className="text-xs uppercase tracking-[0.3em] text-[#b49b82] mb-4">Services & Pricing</div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#3a322b] mb-6 font-normal">{heading}</h2>
            <div className="w-12 h-px bg-[#d4b896] mx-auto mb-8" aria-hidden="true" />
            <p className="text-lg text-[#5c5048] max-w-xl mx-auto font-light leading-relaxed">
              {subheading}
            </p>
          </div>
        )}

        {sortedCategories.map((cat, idx) => {
          const items = grouped.get(cat) ?? [];
          if (items.length === 0) return null;
          const label = CATEGORY_LABELS[cat] ?? cat;
          const gridCols = items.length >= 4 ? "lg:grid-cols-4" : items.length === 3 ? "lg:grid-cols-3" : items.length === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1 max-w-md mx-auto";
          return (
            <div key={cat} className={idx === 0 ? "mb-20" : "mb-20 border-t border-[#f5f2ed] pt-16"}>
              <div className="text-center mb-12">
                <h3 className="font-serif text-2xl sm:text-3xl text-[#3a322b] mb-4 font-normal">{label}</h3>
                <div className="w-12 h-px bg-[#d4b896] mx-auto" aria-hidden="true" />
              </div>
              <div className={`grid gap-6 sm:grid-cols-2 ${gridCols}`}>
                {items.map((s) => (
                  <ServiceCard
                    key={s.id}
                    title={s.title}
                    value={s.slug}
                    category={cat}
                    description={s.description ?? undefined}
                    features={s.features}
                    priceFrom={s.price_from}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
