'use client'  
import React, { use } from 'react'
import styles from './PortadaMicro.module.css'
import ClusterScene from '../scenes/ClusterScene'
import ErrorBoundary from '../error/ErrorBoundary'

export default function Portada() {
  return (
    <div className={styles.cover}>
      <div className={styles.canvasContainer}>
        <ErrorBoundary fallback={<div>3D failed to load</div>}>
          <ClusterScene clusterPosition={[30, -30, 0]}/>
        </ErrorBoundary>
      </div>
      <div className={styles.textContainer}>
        <h1>microCluster</h1>
        <h2>Plataforma de creatividad tecnológica</h2>
        {/* <div className={styles.subtitle}>
          <h2>Encuentro de creatividad y transformación digital</h2>
        </div> */}
      </div>

    </div>
  )
}
