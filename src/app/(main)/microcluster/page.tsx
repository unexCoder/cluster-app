import React from 'react'
import styles from './page.module.css'
import Portada from '../../components/PortadaMicro'
import Fundacion from "../../components/fundacion/FundacionMicroCluster"

export default function page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Portada />
        <Fundacion />
      </main>
    </div>
  )
}
