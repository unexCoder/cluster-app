import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik, Sanchez } from "next/font/google";
import "./globals.css";

const sanchez = Sanchez({
  variable: "--font-sanchez",
  subsets: ["latin"],
  weight: "400"
});

const rubik = Rubik({
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
      <body className={rubik.className}>
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
        <header>
          <p>@header</p>
        </header>
          <p>@main</p>
        {children}
        <footer>
          <p>@footer</p>
        </footer>
      </body>
    </html>
  );
}
