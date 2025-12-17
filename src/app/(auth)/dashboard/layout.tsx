import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Cluster | Dashboard",
  description: "Dashboard page",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}