import { Metadata } from "next";
import styles from './layout.module.css'

export const metadata: Metadata = {
  title: "Red Cluster | Dashboard",
  description: "Dashboard page",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      {children}
    </div>
  );
}