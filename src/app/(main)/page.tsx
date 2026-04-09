import styles from "./page.module.css";
import Ed26 from "../components/layout/Ed2K26";

export default async function Home() {
  console.log('***********************\n***** CLUSTER APP *****\n*** @2025 unexcoder ***\n***********************');
  return (
    <div className={styles.page}>
      <h1 className={styles.visuallyHidden}>Festival Cluster | Tecnología y cultura</h1>
      <main className={styles.main}>
        <Ed26 />
      </main>
    </div>
  );
}