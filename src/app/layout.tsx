import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Papromakeovers - Professional Makeup Artist | UK",
  description: "Professional makeup artistry for bridal, events, photoshoots and lessons across the UK. 8+ years experience. Based in Coventry, serving nationwide.",
  keywords: "makeup artist UK, bridal makeup, photoshoot makeup, graduation makeup, prom makeup, gele tying, mobile makeup artist, Coventry makeup artist, professional makeup, wedding makeup",
  authors: [{ name: "Papromakeovers" }],
  creator: "Papromakeovers",
  publisher: "Papromakeovers",
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://papromakeovers.com",
    title: "Papromakeovers - Professional Makeup Artist | UK",
    description: "Professional makeup artistry for bridal, events, photoshoots and lessons across the UK. 8+ years experience. Based in Coventry, serving nationwide.",
    siteName: "Papromakeovers",
    images: [
      {
        url: "https://papromakeovers.com/gallery/IMG_2177.PNG",
        width: 1200,
        height: 630,
        alt: "Professional makeup artist - Papromakeovers",
      },
    ],
  },
  
  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Papromakeovers - Professional Makeup Artist | UK",
    description: "Professional makeup artistry for bridal, events, photoshoots and lessons across the UK. 8+ years experience.",
    images: ["https://papromakeovers.com/gallery/IMG_2177.PNG"],
    creator: "@papromakeovers",
    site: "@papromakeovers",
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification tags (you can add these when you set up Google Search Console)
  // verification: {
  //   google: "google-site-verification-code",
  //   yandex: "yandex-verification-code",
  // },

  // Mobile app links (if you create a mobile app in future)
  // appleWebApp: {
  //   capable: true,
  //   statusBarStyle: "default",
  //   title: "Papromakeovers",
  // },

  // App manifest
  manifest: "/manifest.json",

  // Other metadata
  category: "Beauty & Personal Care",
  classification: "Professional Makeup Artist Services",
  
  // Structured data will be added separately as JSON-LD
  other: {
    "theme-color": "#b49b82",
    "msapplication-TileColor": "#b49b82",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              "name": "Papromakeovers",
              "description": "Professional makeup artistry for bridal, events, photoshoots and lessons across the UK. 8+ years experience.",
              "url": "https://papromakeovers.com",
              "logo": "https://papromakeovers.com/favicon.ico",
              "image": [
                "https://papromakeovers.com/gallery/IMG_2177.PNG",
                "https://papromakeovers.com/gallery/IMG_2164.PNG",
                "https://papromakeovers.com/gallery/IMG_2165.PNG"
              ],
              "telephone": "+447368590564",
              "email": "papromakeoversstudio@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Coventry",
                "addressCountry": "GB",
                "addressRegion": "England"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 52.4068,
                "longitude": -1.5197
              },
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "United Kingdom"
                },
                {
                  "@type": "City",
                  "name": "Coventry"
                }
              ],
              "serviceType": [
                "Bridal Makeup",
                "Photoshoot Makeup",
                "Event Makeup", 
                "Graduation Makeup",
                "Prom Makeup",
                "Gele Tying",
                "Mobile Makeup Services",
                "Makeup Lessons"
              ],
              "priceRange": "££",
              "foundingDate": "2017",
              "founder": {
                "@type": "Person",
                "name": "Papromakeovers Professional Artist"
              },
              "sameAs": [
                "https://www.instagram.com/papromakeovers/"
              ],
              "openingHours": [
                "Mo-Fr 09:00-20:00",
                "Sa 08:00-21:00", 
                "Su 10:00-18:00"
              ],
              "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],
              "currenciesAccepted": "GBP"
            })
          }}
        />
        
        {/* Additional Service Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "serviceType": "Professional Makeup Services",
              "provider": {
                "@type": "BeautySalon",
                "name": "Papromakeovers",
                "url": "https://papromakeovers.com"
              },
              "areaServed": {
                "@type": "Country",
                "name": "United Kingdom"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Makeup Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Bridal Makeup",
                      "description": "Professional bridal makeup for your special day"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Photoshoot Glam",
                      "description": "Camera-ready makeup for photoshoots"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Gele Tying",
                      "description": "Traditional Nigerian gele tying and styling"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Mobile Makeup Service", 
                      "description": "Professional makeup at your location"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
