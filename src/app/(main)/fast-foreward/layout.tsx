import React from 'react'
import Header from './components/Header';
import styles from './page.module.css'

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className={styles.page}>
        <Header/>
        {children}
      </div>
    </>
  )
}
