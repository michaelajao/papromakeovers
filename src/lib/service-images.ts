// Cover photo for each service card, keyed by service slug. Services without
// an entry render as text-only cards, so new services added in admin still work.
// /images/work/ holds recent Instagram work kept out of the gallery grid.
export const SERVICE_IMAGES: Record<string, { src: string; alt: string; position?: string }> = {
  "studio-makeup": { src: "/images/work/studio-soft-glam.jpg", alt: "Soft glam studio makeup with gold eyeshadow", position: "50% 25%" },
  "photoshoot-glam": { src: "/images/work/photoshoot-glam.jpg", alt: "Bold photoshoot glam with shimmer eyes", position: "50% 30%" },
  "prom-glam": { src: "/images/work/graduation-glam.jpg", alt: "Fresh graduation and prom makeup", position: "50% 25%" },
  "gele-tying": { src: "/images/work/gele-green.jpg", alt: "Green gele tied for a traditional event", position: "50% 20%" },
  "party-guest-makeup": { src: "/images/work/party-guest-gele.jpg", alt: "Party guest makeup with teal gele and aso-ebi", position: "50% 25%" },
  "bridesmaids-bookings": { src: "/images/work/bridesmaid-morning.jpg", alt: "Bridesmaid glam on the wedding morning", position: "50% 25%" },
  "travel-makeup": { src: "/images/work/travel-hotel-glam.jpg", alt: "Glam done on location in a hotel room", position: "50% 25%" },
  "bridal-civil": { src: "/gallery/IMG_2165.PNG", alt: "Elegant civil wedding bridal makeup" },
  "bridal-traditional": { src: "/gallery/IMG_2179.PNG", alt: "Traditional wedding bride in blue gele" },
  "bridal-white": { src: "/gallery/IMG_2164.PNG", alt: "White wedding bride with veil" },
  "bridal-combination": { src: "/gallery/couple-1.jpg", alt: "Bride and groom in traditional attire", position: "50% 30%" },
  "diy-makeup-class": { src: "/gallery/beauty-1.PNG", alt: "Makeup look taught in our masterclass" },
};
