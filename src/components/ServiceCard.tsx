type Props = {
  title: string;
  description?: string;
  features?: string[];
  value: string; // slug used to preselect in booking form
  category?: string; // Optional category for styling
};

export default function ServiceCard({ title, description, features, value, category }: Props) {
  return (
    <div className="group bg-white p-8 border border-[#f5f2ed] hover:border-[#d4b896] transition-all duration-300 text-left focus-within:border-[#d4b896] active:border-[#d4b896]">
      
      <div>
        {/* Professional header with category indicator */}
        {category && (
          <div className="text-xs font-light text-[#b49b82] mb-3 tracking-wide uppercase">
            {category}
          </div>
        )}
        
        <h3 className="text-xl font-light text-[#4a4037] mb-4 leading-tight tracking-wide">
          {title}
        </h3>
        
        {description ? (
          <p className="text-[#6b5d4f] mb-8 leading-relaxed text-sm font-light">
            {description}
          </p>
        ) : null}
        
        {features?.length ? (
          <ul className="text-left text-[#6b5d4f] mb-6 space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className="text-[#d4b896] font-bold mt-0.5">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        ) : null}
        
        <a 
          href={`/?service=${encodeURIComponent(value)}#booking`} 
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white font-semibold px-8 py-3 shadow-[0_4px_16px_rgba(180,155,130,0.35)] hover:shadow-[0_6px_22px_rgba(180,155,130,0.5)] hover:from-[#c4a882] hover:to-[#a48a72] transform hover:translate-y-[-1px] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[#d4b896] focus-visible:ring-offset-2 transition-all duration-300"
        >
          <span>Book This Service</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}


