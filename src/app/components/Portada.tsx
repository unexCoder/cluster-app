'use client'  
import React, { use } from 'react'
import styles from './Portada.module.css'
import ClusterScene from '../scenes/ClusterScene'

export default function Portada() {
  return (
    <div className={styles.cover}>
      <div className={styles.canvasContainer}>
        <ClusterScene/>
      </div>
      <div className={styles.textContainer}>
        <h1>CLUSTER</h1>
        <h2>Festival Tecnológico</h2>
        <div className={styles.subtitle}>
          <h2>Encuentro de creatividad y transformación digital</h2>
        </div>
      </div>

    </div>
  )
}
