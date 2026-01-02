'use client'
import React from 'react'
import styles from './page.module.css'
import { useNavigation } from '../../context/NavigationContext'

export default function Contact() {
  const { previousPath } = useNavigation()
  // console.log(previousPath);

  return (

    <div className={`${styles.main} ${previousPath === '/festival' || previousPath === '/' ? styles.colorSchemaA : styles.colorSchemaB}`}>
      <div className={styles.mainContainer}>
        <div className={styles.txtContainer}>
          <h1>Contacto</h1>
          <h3>Dirección</h3>

          <p>Meridiano 2141</p>
          <p>2134, Roldán (Santa Fe)</p>
          <p>Argentina</p>
          <p>Phone +54 (341) 670-9854</p>
          <p>Si tenes alguna consulta, escribinos a <span className={styles.spam}> <a href="mailto:">info@festivalcluster.org</a></span></p>

        </div>
      </div>
    </div>



  )
}
