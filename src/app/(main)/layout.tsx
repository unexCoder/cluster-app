import { Metadata } from "next";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "Festival Cluster",
  description: "Encuentro de creatividad y transformación digital",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
