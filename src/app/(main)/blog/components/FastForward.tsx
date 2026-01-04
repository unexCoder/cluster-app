import React from 'react'
import styles from './fastForward.module.css'

export default function FastForward() {
    return (
        <div>             
            <div className={`${styles.intro} ${styles.first}`}>
                <p>
                    <span className={styles.cluster}>&gt;&gt; FastForward</span> es un blog y 
                    periódico digital creado con el fin de difundir contenidos 
                    relacionados a los procesos culturales del tecnoceno
                </p>
            </div>

            <div className={`${styles.intro} ${styles.third}`}>
                <p>
                    <span className={styles.cluster}>&gt;&gt; FastForward</span> documenta y analiza fenómenos 
                    como la inteligencia artificial, la cultura digital, las redes sociales, el arte 
                    generativo y las nuevas formas de producción cultural que emergen del encuentro 
                    entre humanidad y máquina, buscando entender no solo qué está cambiando, sino 
                    también qué significa ese cambio para nuestro futuro colectivo
                </p>
            </div>

            <div className={`${styles.intro} ${styles.five}`}>
                <p>
                    A través de artículos, ensayos y reportajes  <span className={styles.cluster}>&gt;&gt; FastForward</span> se
                    propone comprender y documentar el impacto de la revolución digital en la cultura, el arte, la educación 
                    y las dinámicas sociales emergentes
                </p>
            </div>
            
        </div>
    )
}
