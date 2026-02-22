import styles from "./page.module.css";
import Ed26 from "../components/layout/Ed2K26";



export default async function Home() {
  // 'use server'
  console.log('***********************\n***** CLUSTER APP *****\n*** @2025 unexcoder ***\n***********************');
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Ed26 />
      </main>
    </div>
  );
}