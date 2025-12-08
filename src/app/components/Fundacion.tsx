import React from 'react'
import styles from './Fundacion.module.css'

export default function Fundacion() {
    return (
        <div>         
            <div className={`${styles.intro} ${styles.first}`}>
                <p>
                    <span className={styles.cluster}>CLUSTER</span> es un festival que reúne a las industrias creativas locales y regionales 
                    con el objetivo de compartir proyectos culturales de base tecnológica, conocimiento y
                    experiencias en innovación digital
                </p>
            </div>

            <div className={`${styles.intro} ${styles.second}`}>
                <p>
                    <span className={styles.cluster}>CLUSTER</span> se origina en los festivales alternativos de música electrónica y artes digitales como <a href="https://montreal.mutek.org/">Mutek</a> (Montreal) o <a href="https://www.ctm-festival.de/">CTM</a> (Berlin), pero involucra además a otras industrias relacionadas como la programación, el desarrollo de videojuegos, el diseño, medios digitales, etc.
                </p>
            </div>

            <div className={`${styles.intro} ${styles.third}`}>
                <p>
                    El propósito del festival <span className={styles.cluster}>CLUSTER</span> es crear un polo de convergencia orientado a visibilizar y estimular el 
                    desarrollo de estas actividades y recursos fundamentalmente en las ciudades de Funes y Roldán y
                    su área de influencia
                </p>
            </div>

            <div className={`${styles.intro} ${styles.four}`}>
                <p>
                    La agenda del festival <span className={styles.cluster}>CLUSTER</span> contempla la realización de conciertos y recitales audiovisuales, 
                    exposiciones de arte y tecnología, workshops y talleres, mesas de debate y rondas de negocio
                </p>
            </div>

            <div className={`${styles.intro} ${styles.five}`}>
                <p>
                    <span className={styles.cluster}>CLUSTER</span> propone un espacio de encuentro y estímulo que permite vincular a los artistas y creativos
                    digitales con las empresas y negocios de base tecnologica en la región, al tiempo que ofrece para la 
                    ciudad un evento cultural y didactico, innovador y de calidad
                </p>
            </div>

            <div className={`${styles.chapter}`}>
                <div className={styles.paragraph}>
                    <p>La palabra <span className={styles.cluster}>CLUSTER</span> proviene del inglés antiguo <span className={styles.negrita}>clyster</span>  o <span className={styles.negrita}>cluster</span>, y significa <span className={styles.negrita}>manojo</span> o <span className={styles.negrita}>racimo</span>. Durante los siglos XII-XV, la palabra se consolidó como <span className={styles.negrita}>cluster</span> con el sentido de <span className={styles.bold}>grupo compacto de cosas similares creciendo o manteniéndose unidas</span>.</p>
                    <p>En la historia moderna, el término se aplica de forma diversa, tanto en inglés como en castellano y en otros idiomas, y tiene múltiples aplicaciones.</p>
                </div>
                <div className={styles.paragraph}>
                    <p>En astronomía, por ejemplo, <span className={styles.negrita}>cluster</span> se refiere a un <span className={styles.bold}>cúmulo de estrellas</span> y es uno de los usos más antiguos y establecidos de la palabra en contexto científico.</p>
                    <p>En tecnología y ciencia de datos el término se utiliza recurrentemente, por ejemplo <span className={styles.negrita}>server cluster</span>, <span className={styles.negrita}>cluster computing</span>, etc.</p>
                    <p>En musica, el termino es utilizado para referirse a un <span className={styles.bold}>conjunto cerrado y denso de notas muy cercanas</span> con un sonido similar a un ruido.</p>
                </div>
            </div>
            
            <div className={`${styles.chapter} ${styles.chapterTwo}`}>
                <div className={styles.paragraph}>
                    <p>El festival gira en torno a un eje principal de conciertos y performances audiovisuales.</p> 
                    <p>También habrá un espacio de exposición permanente de instalaciones y otros formatos de arte digital y audiovisual.</p>
                    <p> Paralelamente a estos espacios, se desarrolla la agenda de actividades programadas como talleres, charlas y workshops. Además, habrá un espacio tambien permanente de exposición y difusión para empresas y negocios de base tecnologica.</p>
                    
                </div>
                <div className={styles.paragraph}>
                    <p>La grilla de participación estará conformada mayormente por representantes locales y regionales, más un número de artistas nacionales por definir, incluyendo alguna propuesta de trayectoria destacada.</p>
                    <p>La curaduría del festival estará a cargo de un equipo de producción integrado por el director del festival y representantes de otras áreas de producción asociadas (gobierno, empresas, dirección artística, dirección académica, producción ejecutiva, prensa y management), designados oportunamente.</p>
                </div>
            </div>
        </div>
    )
}
