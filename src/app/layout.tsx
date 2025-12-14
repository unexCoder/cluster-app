import type { Metadata } from "next";
import {  DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import { montreal } from "./fonts";

const inter = Inter({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const dm = DM_Sans({
  variable: "--font-dm",
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
      <body className={montreal.className}>
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
