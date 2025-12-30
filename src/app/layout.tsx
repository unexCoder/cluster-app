import "./styles/globals.css";
import './styles/variables.css'

import { montreal } from "./fonts";
import { SessionProvider } from "next-auth/react"

import type { Metadata } from "next";
// import {  Inter } from "next/font/google";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  title: {
    default: "Festival Cluster",
    template: "%s | Festival Clusterr"
  },
  description: "Festival Tecnológico | Encuentro de creatividad y transformación digital",
  keywords: ["festival","creatividad tecnológica", "desarrollo web", "innovación digital", "tecnología", "microCluster"],
  authors: [{ name: "Luigi Tamagnini" }],
  creator: "Luigi Tamagnini",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://festivalcluster.org/microcluster",
    siteName: "Festival Cluster",
    title: "Festival Cluster",
    description: "Festival Tecnológico. Encuentro de creatividad y transformación digital",
    images: [
      {
        url: "/og-image.jpg", // Imagen principal
        width: 1200,
        height: 630,
        alt: "Festival Cluster - Festival Tecnológico",
        type: "image/jpeg"
      },
      {
        url: "/og-image-w.jpg", // Imagen cuadrada para WhatsApp
        width: 630,
        height: 630,
        alt: "Festival Cluster"
      }
    ]
  },
  // Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "Festival Cluster - Festival Tecnológico",
    description: "Festival Tecnológico. Encuentro de creatividad y transformación digital",
    images: ["/og-image.jpg"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montreal.className}> {/* className={`${inter.variable} ${montreal.className}`} */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
