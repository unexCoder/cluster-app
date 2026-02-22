import React from 'react'
import styles from './header.module.css'
import Logo from './Logo'
import NavBar from './NavBar'

export default function Header() {
  return (
    <div className={styles.headerContainer}>
        <Logo />
        <NavBar />
    </div>
  )
}
