import React from 'react'
import styles from './page.module.css'
import Portada from '../../components/layout/PortadaMicro'
import Fundacion from "../../components/fundacion/FundacionMicroCluster"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "microCluster - Plataforma de Creatividad Tecnológica",
    template: "%s | microCluster"
  },
  description: "Plataforma de creatividad tecnológica",
  keywords: ["creatividad tecnológica", "desarrollo web", "innovación digital", "tecnología", "microCluster"],
  authors: [{ name: "LuigiTamagnini" }],
  creator: "Luigi Tamagnini",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://festivalcluster.org/microcluster",
    siteName: "microCluster",
    title: "microCluster - Plataforma de Creatividad Tecnológica",
    description: "Plataforma innovadora de creatividad tecnológica e innovación en cultura digital",
    images: [
      {
        url: "/og-image-mc.jpeg", // Imagen principal
        width: 1200,
        height: 630,
        alt: "microCluster - Plataforma de Creatividad Tecnológica",
        type: "image/jpeg"
      },
      {
        url: "/og-image-mc-w.jpeg", // Imagen cuadrada para WhatsApp
        width: 630,
        height: 630,
        alt: "microCluster"
      }
    ]
  },
  // Twitter/X
  twitter: {
    card: "summary_large_image",
    title: "microCluster - Plataforma de Creatividad Tecnológica",
    description: "Plataforma innovadora de creatividad tecnológica",
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

export default function page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Portada />
        <Fundacion />
      </main>
    </div>
  )
}
