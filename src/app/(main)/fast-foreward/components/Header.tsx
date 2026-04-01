import React from 'react'
import styles from './header.module.css'

export default function Header() {
  return (
    <div className={styles.container}>
      <div>
        <>
          <span className={styles.ffLogo}>&gt;&gt;</span>
          <span className={styles.txtLogo}>FastForward</span>
        </>
        <h3 className={styles.subtitle}>CULTURA Y TECNOLOGIA</h3>
      </div>
    </div>
  )
}
