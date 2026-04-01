import { Metadata } from "next";
import { NavigationProvider } from "../context/NavigationContext";
import FooterWrapper from "../components/layout/FooterWrapper";

export const viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "Festival Cluster",
    template: "%s | Festival Cluster"
  },
  description: "Festival Tecnológico | Encuentro de creatividad y transformación digital",
  keywords: ["festival", "creatividad tecnológica", "desarrollo web", "innovación digital", "tecnología", "microCluster"],
  authors: [{ name: "Luigi Tamagnini" }],
  creator: "Luigi Tamagnini",
  themeColor: "#000000",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://festivalcluster.org",
    siteName: "Festival Cluster",
    title: "Festival Cluster",
    description: "Festival Tecnológico. Encuentro de creatividad y transformación digital",
    images: [
      {
        url: "/og-image.jpeg", // Imagen principal
        width: 1200,
        height: 630,
        alt: "Festival Cluster - Festival Tecnológico",
        type: "image/jpeg"
      },
      {
        url: "/og-image-w.jpeg", // Imagen cuadrada para WhatsApp
        width: 630,
        height: 630,
        alt: "Festival Cluster"
      }
    ],
  },
  // Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "Festival Cluster - Festival Tecnológico",
    description: "Festival Tecnológico. Encuentro de creatividad y transformación digital",
    images: ["/og-image.jpeg"],
    creator: "@unexcoder",
    site: "@unexcoder"
  },
  // Otras propiedades importantes
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },

  alternates: {
    canonical: "https://festivalcluster.org"
  }
};



export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": "https://festivalcluster.org/#event",
    name: "Festival Cluster",
    description: "Festival Tecnológico | Encuentro de creatividad y transformación digital",
    url: "https://festivalcluster.org",
    image: [
      "https://festivalcluster.org/og-image.jpeg",
      "https://festivalcluster.org/og-image-w.jpeg"
    ],
    startDate: "2026-08-25T18:00:00-03:00", // 🔴 ajustar
    endDate: "2026-08-25T23:59:00-03:00",   // 🔴 ajustar
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Cultural Fontanarosa, Rosario",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rosario",
        addressRegion: "Santa Fe",
        addressCountry: "AR"
      }
    },
    organizer: {
      "@type": "Organization",
      name: "Festival Cluster",
      url: "https://festivalcluster.org"
    },
    offers: {
      "@type": "Offer",
      url: "https://festivalcluster.org",
      price: "0",
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01T00:00:00-03:00"
    }
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavigationProvider>
        {children}
        <FooterWrapper />
      </NavigationProvider>
    </>
  );
}
