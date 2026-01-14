'use client'
import React, { useEffect, useState } from 'react'
import styles from './fastForward.module.css'

export default function FastForward() {

    const [flyerUrl, setFlyerUrl] = useState<string | null>(null)

    useEffect(() => {
        // runs ONLY on client, AFTER hydration
        setFlyerUrl(
            `/api/postcard?bckGnda=1241ac00&bckGndb=ac41ac00&color=ff00ff&width=2200&v=${crypto.randomUUID()}`
        )
    }, [])

    const bgStyle = flyerUrl ? getFlyerBackground(flyerUrl) : undefined
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


            <div
                key={flyerUrl}

                style={{
                    ...bgStyle,
                    minWidth: '100svw',
                    minHeight: '620svh',
                    overflow: 'hidden',
                    zIndex: '-50',
                    position: 'absolute',
                    top: '0',
                    transform: 'translate(0,0)'
                }}>
            </div>


        </div>
    )
}


function getFlyerBackground(url?: string) {
    if (!url) return undefined

    return {
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    } as React.CSSProperties
}