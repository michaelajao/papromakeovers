type Props = {
  icon: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  href?: string;
};

export default function ServiceCard({ icon, title, price, description, features, href = "#booking" }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(180,155,130,0.15)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(180,155,130,0.25)] transition text-center border border-[#f5f2ed]">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white text-3xl grid place-items-center mx-auto mb-4 shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[#4a4037] mb-1">{title}</h3>
      <div className="text-[#b49b82] font-bold text-xl mb-2">{price}</div>
      <p className="text-[#6b5d4f] mb-4">{description}</p>
      <ul className="text-left text-[#6b5d4f] mb-4">
        {features.map((f) => (
          <li key={f} className="py-1 before:content-['✓'] before:text-[#d4b896] before:font-bold before:mr-2">{f}</li>
        ))}
      </ul>
      <a href={href} className="inline-block rounded-full bg-gradient-to-br from-[#d4b896] to-[#b49b82] text-white font-semibold px-5 py-2 shadow-lg hover:shadow-xl transition-shadow">Select Package</a>
    </div>
  );
}


