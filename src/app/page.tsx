import Fundacion from "./components/Fundacion";
import styles from "./page.module.css";

export default async function Home() {
  'use server'
  console.log('***********************\n***** CLUSTER APP *****\n*** @2025 unexcoder ***\n***********************');
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Fundacion/>
      </main>
    </div>
  );
}