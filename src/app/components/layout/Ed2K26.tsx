import React from 'react'
import styles from './Ed2k26.module.css'
import Header from './Header'
import ClusterScene from '../scenes/ClusterScene'
import ErrorBoundary from '../../error/ErrorBoundary'

export default function Ed2K26() {
  return (
    <>
    <Header />
    <div className={styles.cover}>
      <div className={styles.canvasContainer}>
        <ErrorBoundary fallback={<div>3D failed to load</div>}>
          <ClusterScene />
        </ErrorBoundary>
      </div>
    </div>
    </>
  )
}
