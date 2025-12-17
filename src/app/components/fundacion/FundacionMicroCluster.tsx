import React from 'react'
import styles from './FundacionMicroCluster.module.css'

export default function Fundacion() {
    return (
        <div> 
            {/* Improve SEO Structure
            Add schema.org structured data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Event",
                    "name": "microCluster",
                    "description": "Creatividad Tecnológica",
                    "startDate": "2026",
                })}
            </script>
            
            <div className={`${styles.intro} ${styles.first}`}>
                <p>
                    <span className={styles.cluster}> microCluster</span> es una organización 
                    creada para promover y difundir valores y recursos vinculados a la cultura 
                    tecnológica actual y futura
                </p>
            </div>

            <div className={`${styles.intro} ${styles.second}`}>
                <p>
                    <span className={styles.cluster}>microCluster</span> se basa 
                    en una necesidad de aumentar la circulación de recursos de 
                    creatividad tecnológica y se fundamenta en la democratización de los 
                    medios de producción y del acceso a la información, así como en los 
                    valores y prácticas de las comunidades de software y hardware libre
                </p>
            </div>

            <div className={`${styles.intro} ${styles.third}`}>
                <p>
                    El área temática de <span className={styles.cluster}> microCluster</span> se 
                    centra fundamentalmente en el uso de herramientas tecnológicas digitales 
                    en las prácticas artísticas y culturales contemporáneas, y resulta de 
                    interés para artistas y productores en diferentes campos del arte 
                    digital, música electrónica y electroacústica, producción audiovisual, 
                    y otras artes mediales
                </p>
                <p>
                    Profesionales del diseño y desarrollo de contenidos digitales, 
                    videojuegos, computación musical y computación gráfica, animación, etc
                </p>
                <p>
                    Profesionales, instituciones y educadores en el campo de la ciencia de 
                    datos, artes y ciencias, programación para niños y adolescentes, etc., 
                    tanto en la educación formal como en la no formal
                </p>                
            </div>

            <div className={`${styles.intro} ${styles.four}`}>
                <p>
                    La agenda de <span className={styles.cluster}>microCluster</span> incluye 
                    la organización de eventos culturales y pedagógicos, como talleres, 
                    seminarios, conferencias, conciertos y exposiciones. También contempla la 
                    producción de publicaciones especializadas y documentación general del 
                    proyecto en medios digitales
                </p>
                <p>
                    <span className={styles.cluster}>microCluster</span> está asociada al 
                    Festival Cluster y constituye su plataforma de gestión y difusión
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
        </div>
    )
}
