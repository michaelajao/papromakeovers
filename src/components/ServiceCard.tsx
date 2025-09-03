type Props = {
  title: string;
  description?: string;
  features?: string[];
  value: string; // slug used to preselect in booking form
  category?: string; // Optional category for styling
};

export default function ServiceCard({ title, description, features, value, category }: Props) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_32px_rgba(180,155,130,0.12)] hover:-translate-y-3 hover:shadow-[0_16px_48px_rgba(180,155,130,0.2)] transition-all duration-500 text-center border border-[#e8e0d5] relative overflow-hidden">
      {/* Background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-transparent to-[#f5f2ed] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        {/* Professional header with category indicator */}
        {category && (
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-[#b49b82] bg-[#b49b82]/10 rounded-full border border-[#b49b82]/20">
            {category}
          </div>
        )}
        
        <h3 className="text-2xl font-bold text-[#4a4037] mb-4 group-hover:text-[#3a2f26] transition-colors duration-300 leading-tight">
          {title}
        </h3>
        
        {description ? (
          <p className="text-[#6b5d4f] mb-6 leading-relaxed text-sm group-hover:text-[#5a4e42] transition-colors duration-300">
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
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white font-semibold px-8 py-3 shadow-[0_4px_16px_rgba(180,155,130,0.4)] hover:shadow-[0_6px_24px_rgba(180,155,130,0.6)] hover:from-[#c4a882] hover:to-[#a48a72] transform hover:scale-105 transition-all duration-300"
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


