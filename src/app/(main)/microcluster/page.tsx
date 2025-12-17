import React from 'react'
import styles from './page.module.css'
import Portada from '../../components/layout/PortadaMicro'
import Fundacion from "../../components/fundacion/FundacionMicroCluster"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "microCluster",
  description: "Plataforma de creatividad tecnológica",
};

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
