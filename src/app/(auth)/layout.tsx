import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Red Cluster | Login",
  description: "Login page",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}