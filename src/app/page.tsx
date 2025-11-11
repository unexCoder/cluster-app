import styles from "./page.module.css";

export default function Home() {
  console.log('***********************\n***** CLUSTER APP *****\n*** @2025 unexcoder ***\n***********************');
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>CLUSTER</h1>
          <p>Festival Tecnológico</p>
          <p>Encuentro de creatividad y transformacion digital</p>
        </div>
      </main>
    </div>
  );
}