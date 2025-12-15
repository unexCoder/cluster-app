import type { Metadata } from "next";
import {  Inter } from "next/font/google";
import "./globals.css";
import { montreal } from "./fonts";
import { SessionProvider } from "next-auth/react"

const inter = Inter({
  variable: "--font-inter",
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
      <body className={montreal.className}> {/* className={`${inter.variable} ${montreal.className}`} */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
