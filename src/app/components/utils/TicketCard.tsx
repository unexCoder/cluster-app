import styles from './ticketCard.module.css'
import { type TicketData, resolveTicketNumber, extractBackgroundParams,   sizeBackgroundUrl } from '@/../types/ticket'

// ---------------------------------------------------------------------------
// TicketCard — canal web
// Recibe TicketData completo. El qr_src debe venir resuelto desde el servidor
// (ver resolveTicketAssets en @/lib/ticket). Si llega vacío se construye
// como URL pública de fallback (sólo válido en entorno browser).
// ---------------------------------------------------------------------------
export default function TicketCard(props: TicketData) {
  const variant = props.variant ?? 'boarding'
  if (variant === 'minimal') {
    return <MinimalTicket {...props} />
  }
  return <BoardingPassTicket {...props} />
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

/**
 * Fallback: construye la URL del QR desde el ticket_id cuando qr_src no viene
 * resuelto. Sólo válido en web — en email/PDF siempre debe venir como base64.
 */
function resolveQrSrc(data: TicketData): string {
  if (data.qr_src) return data.qr_src
  const { bckGndb } = extractBackgroundParams(data.background_url)
  const base = process.env.NEXT_PUBLIC_APP_URL ?? ''
  return `${base}/api/qr/${data.ticket_id}${bckGndb ? `?bg=${bckGndb}` : ''}`
}

// ---------------------------------------------------------------------------
// Boarding
// ---------------------------------------------------------------------------
function BoardingPassTicket(props: TicketData) {
  const bg  = sizeBackgroundUrl(props.background_url, 1200, 600)
  const qr  = resolveQrSrc(props)
  const num = resolveTicketNumber(props)

  return (
    <div
      className={styles.containerBoarding}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className={styles.overlayBoarding} />

      <div className={styles.header}>
        <strong className={`${styles.textBoarding} ${styles.headerTitle}`}>
          {props.event_name}
        </strong>
        <span className={`${styles.textBoarding} ${styles.smallText}`}>
          ID: {num}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.left}>
          <p className={styles.textBoarding}><strong>DATE:</strong> {props.date}</p>
          {props.time     && <p className={styles.textBoarding}><strong>TIME:</strong>  {props.time}</p>}
          {props.location && <p className={styles.textBoarding}><strong>LOC:</strong>   {props.location}</p>}
          {props.tier_name  && <p className={styles.textBoarding}><strong>ZONE:</strong>  {props.tier_name}</p>}

          <div className={styles.nameBlock}>
            <div className={`${styles.textBoarding} ${styles.smallText}`}>NAME</div>
            <div className={`${styles.textBoarding} ${styles.headerTitle}`}>{props.guest_name}</div>
          </div>

          {props.tier_price && (
            <div>
              <div className={`${styles.textBoarding} ${styles.smallText}`}>ENTRY</div>
              <div className={`${styles.textBoarding} ${styles.headerTitle}`}>{props.tier_price}</div>
            </div>
          )}
        </div>

        <div className={styles.separator} />

        <div className={styles.qrContainer}>
          <div className={styles.qrInner}>
            <img src={qr} className={styles.qrImgFull} alt="QR code" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Minimal
// ---------------------------------------------------------------------------
function MinimalTicket(props: TicketData) {
  const bg  = sizeBackgroundUrl(props.background_url, 800, 1200)
  const qr  = resolveQrSrc(props)
  const num = resolveTicketNumber(props)

  return (
    <div
      className={styles.containerMinimal}
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className={styles.overlayMinimal} />

      <div className={`${styles.paddingHeader} ${styles.headerMinimal}`}>
        <div className={`${styles.textMinimal} ${styles.titleMinimal}`}>
          {props.event_name}
        </div>
        <div className={`${styles.textMinimal} ${styles.subText}`}>
          {props.date}{props.time && ` | ${props.time}`}
        </div>
      </div>

      <div className={styles.qrContainer}>
        <div className={styles.qrInnerMinimal}>
          <img src={qr} className={styles.qrImgFixed} alt="QR code" />
        </div>
        <span className={`${styles.textBoarding} ${styles.smallText}`}>
          ID: {num}
        </span>
      </div>

      <div className={`${styles.center} ${styles.bottomSpacing}`}>
        <div className={`${styles.textMinimal} ${styles.smallText}`}>ACCESS</div>
        <div className={styles.textMinimal}>{props.tier_name ?? 'VIP'}</div>
        <div
          className={`${styles.textMinimal} ${styles.nameBlock}`}
          style={{ fontWeight: '900' }}
        >
          {props.guest_name}
        </div>
      </div>
    </div>
  )
}