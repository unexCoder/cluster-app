import styles from "./page.module.css";
import ImageLoad from "./components/ImageLoad";

export default async function Home() {
  'use server'
  console.log('***********************\n***** CLUSTER APP *****\n*** @2025 unexcoder ***\n***********************');
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <h1>CLUSTER</h1>
          <p>Festival Tecnológico</p>
          <p>Encuentro de creatividad y transformacion digital</p>
          <ImageLoad></ImageLoad>
      </main>
    </div>
  );
}