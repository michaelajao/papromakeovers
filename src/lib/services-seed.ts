export type SeedService = {
  slug: string;
  title: string;
  category: string;
  description: string;
  features?: string[];
  price_from: number;
  sort_order: number;
};

export const SEED_SERVICES: SeedService[] = [
  {
    slug: "studio-makeup",
    title: "Studio Makeup",
    category: "Signature",
    description:
      "Enjoy a personalised makeover in our studio, created to suit your unique features and preferences. Ideal if you'd love to visit our space for a flawless look for any occasion.",
    price_from: 80,
    sort_order: 10,
  },
  {
    slug: "photoshoot-glam",
    title: "Photoshoot Glam",
    category: "Signature",
    description:
      "A detailed, camera-ready look that enhances your natural beauty under studio lights. Great for pre-wedding shoots, birthdays, headshots or brand photography.",
    price_from: 90,
    sort_order: 20,
  },
  {
    slug: "prom-glam",
    title: "Graduation & Prom Glam",
    category: "Signature",
    description:
      "A youthful, radiant and stylish look for graduation ceremonies and prom night — soft glam or bold drama to match your vibe and outfit.",
    price_from: 70,
    sort_order: 30,
  },
  {
    slug: "gele-tying",
    title: "Gele Tying",
    category: "Signature",
    description:
      "Professional gele tying and styling for Nigerian traditional ceremonies, weddings, and cultural events. Authentic techniques with modern flair.",
    price_from: 40,
    sort_order: 40,
  },
  {
    slug: "party-guest-makeup",
    title: "Party Guest Makeup",
    category: "Group",
    description:
      "Perfect for weddings, birthdays and celebrations. Ideal for mother of the bride/groom and siblings. This is a group booking (minimum of 3 people).",
    price_from: 65,
    sort_order: 50,
  },
  {
    slug: "bridesmaids-bookings",
    title: "Bridesmaids Bookings",
    category: "Group",
    description:
      "Cohesive, elegant looks for the bridal party. Long-lasting and picture-perfect for a full day of celebration. Group booking (minimum of 3 people).",
    price_from: 75,
    sort_order: 60,
  },
  {
    slug: "travel-makeup",
    title: "Travel Makeup Service",
    category: "Group",
    description:
      "Bringing the glam to your home, hotel or venue. Note: additional travel fees apply based on location.",
    price_from: 120,
    sort_order: 70,
  },
  {
    slug: "bridal-civil",
    title: "Civil Wedding",
    category: "Bridal",
    description:
      "Elegant and refined makeup for your intimate civil ceremony. Timeless beauty that photographs beautifully.",
    price_from: 150,
    sort_order: 80,
  },
  {
    slug: "bridal-traditional",
    title: "Traditional Wedding",
    category: "Bridal",
    description:
      "Rich, cultural makeup that honours your heritage while enhancing your natural beauty for traditional ceremonies.",
    price_from: 180,
    sort_order: 90,
  },
  {
    slug: "bridal-white",
    title: "White Wedding",
    category: "Bridal",
    description:
      "Classic bridal glam with long-lasting coverage perfect for your white wedding celebration and photos.",
    price_from: 200,
    sort_order: 100,
  },
  {
    slug: "bridal-combination",
    title: "Complete Bridal Package",
    category: "Bridal",
    description:
      "The ultimate bridal experience combining multiple ceremonies with coordinated looks throughout your celebration.",
    price_from: 450,
    sort_order: 110,
  },
  {
    slug: "diy-makeup-class",
    title: "DIY Makeup Masterclass",
    category: "Education",
    description:
      "A personalised lesson covering everyday basics or glam techniques — tailored to your level so you feel confident doing your own makeup.",
    price_from: 120,
    sort_order: 120,
  },
];

export const SERVICE_CATEGORIES = ["Signature", "Group", "Bridal", "Education"] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
