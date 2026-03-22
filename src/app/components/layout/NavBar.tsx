'use client'
import React from 'react'
import styles from './navbar.module.css'
import Link from 'next/link'

export default function NavBar() {
  return (
    <div className={styles.navbarContainer}>
      <nav>
        <ul>
          <li><Link href="#proximamente" onClick={() => document.querySelector('#proximamente')?.scrollIntoView({ behavior: 'smooth' })}>Edicion 2026</Link></li>
          <li><Link href="#proximamente" onClick={() => document.querySelector('#proximamente')?.scrollIntoView({ behavior: 'smooth' })}>Artistas</Link></li>
          <li><Link href="#proximamente" onClick={() => document.querySelector('#proximamente')?.scrollIntoView({ behavior: 'smooth' })}>Talleres</Link></li>
          <li><Link href="/tickets">Tickets</Link></li>
        </ul>
      </nav>
    </div>
  )
}
