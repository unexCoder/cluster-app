import React from 'react'
import FlyerDisplay from '../components/FlyerDisplay'
import styles from './page.module.css'

export default function page() {
  
  const flyerUrl2 = '/api/postcard?bckGnda=1241ac00&bckGndb=ac41ac&color=ff00ff&width=2200'
  const flyerUrl3 = '/api/postcard?bckGnda=1241ac00&bckGndb=ac41ac&color=ff00ff&width=220&height=220'
  const flyerUrl4 = '/api/postcard?bckGnda=1241ac00&bckGndb=ac41ac&color=ff00ff&width=2200&height=2200'



  
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <FlyerDisplay url={flyerUrl4}/>
      </div>
    </div>
  )
}
