import React from 'react'
import styles from './Footer.module.css';
import Link from 'next/link';
import NewsletterSubscription from '../utils/NewsletterSuscription';

export default function Footer() {
  return (
    <footer className={styles.foot}>
        <div className={styles.suscriptContainer}>
          <NewsletterSubscription />
        </div>
        <div className={styles.footerContainer}>
          <div>
            <h3>Edición 2026</h3>
            <ul>
              <li>Festival</li>
              <li>Tickets</li>
              <li>Prensa</li>
              <li>Sponsors</li>
              <li>FAQ</li>
            </ul>
          </div>
          
          <div>
            <h3>Unite a Cluster</h3>
            <ul>
              <li>Empleos</li>
              <li>Voluntariado</li>
              <li>Asociate</li>
              <li>Colabora</li>
              <li>Network</li>
            </ul>
          </div>

          <div>
            <h3>Acerca de</h3>
            <ul>
              <li>Accesibilidad</li>
              <li>Compromiso Ambiental</li>
              <li><Link href={'/contacto'}>Contacto y equipo</Link></li>
              <li>Ediciones previas</li>
              <li>Misión</li>
            </ul>
          </div>

          <div>
            <h3>Redes Sociales</h3>
            <ul>
              <li>Instagram</li>
              <li>X</li>
              <li>Facebook</li>
              <li><Link href={'https://www.youtube.com/@FestivalCluster'} target='_blank'>YouTube</Link></li>
            </ul>
          </div>
        </div>
          <div className={styles.bottomFooter}>
            <p>© 2025 CLUSTER All rights reserved</p>
            <p className={styles.decorated}>Política de privacidad</p>
            <p className={styles.decorated}>Términos y condiciones</p>
            <div className={styles.hooverTxt}>
              <span className={styles.originalTxt}>Creditos</span>
              <span className={styles.newTxt}> <Link href={'https://www.unexcoder.com.ar/'} target={'blank'}>\unexCoder</Link></span>
            </div>
          </div>
    </footer>
  )
}
