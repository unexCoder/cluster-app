import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Rubik, Rubik_80s_Fade, Rubik_Dirt, Sanchez } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const sanchez = Sanchez({
  variable: "--font-sanchez",
  subsets: ["latin"],
  weight: "400"
});

const inter = Inter({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cluster Festival",
  description: "Digtal creativity and technology culture festival",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
        {/* <header>
          <p>@header</p>
        </header> */}
        {children}
        <Footer/>
      </body>
    </html>
  );
}
