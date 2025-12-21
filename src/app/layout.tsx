import "./styles/globals.css";
import './styles/variables.css'

import { montreal } from "./fonts";
import { SessionProvider } from "next-auth/react"

// import type { Metadata } from "next";
// import {  Inter } from "next/font/google";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Festival Cluster",
//   description: "Encuentro de creatividad y transformación digital",
// };

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
