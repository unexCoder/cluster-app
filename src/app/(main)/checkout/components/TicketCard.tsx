'use client'
import React from 'react'
import styles from './ticketCard.module.css'

interface TicketProps {
  variant: 'boarding' | 'minimal'
  eventName: string
  date: string
  time?: string
  location?: string
  zone?: string
  name: string
  ticketId: string
  price?: string
}

const uuidToShortId = (uuid: string): string => {
  const clean = uuid.replace(/-/g, '');

  // Primeras 2 letras del uuid convertidas a A-Z
  const prefixChar1 = String.fromCharCode(65 + parseInt(clean[0], 16) % 26);
  const prefixChar2 = String.fromCharCode(65 + parseInt(clean[1], 16) % 26);
  const prefix = `${prefixChar1}${prefixChar2}`;

  // Número de 6 dígitos a partir de los siguientes bytes
  const num = parseInt(clean.slice(2, 8), 16) % 1_000_000;
  const number = String(num).padStart(6, '0');

  return `${prefix}-${number}`;
};


const buildBackground = (w: number, h: number) =>
  `http://localhost:3000/api/postcard?bckGnda=2ec4b6&bckGndb=ccff66&color=2eb4c6&width=${w * 2}&height=${h * 2}`

export default function TicketCard(props: TicketProps) {
  if (props.variant === 'boarding') {
    return <BoardingPassTicket {...props} />
  }
  return <MinimalTicket {...props} />
}

// =========================
// BOARDING
// =========================
function BoardingPassTicket(props: TicketProps) {

  const bg = buildBackground(1200, 600)

  return (
    <div
      className={styles.containerBoarding}
      style={{ backgroundImage: `url(${bg})` }}
    >

      <div className={styles.overlayBoarding} />

      <div className={styles.header}>
        <strong className={`${styles.textBoarding} ${styles.headerTitle}`}>
          {props.eventName}
        </strong>
        <span className={`${styles.textBoarding} ${styles.smallText}`}>
          ID: { uuidToShortId( props.ticketId)}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.left}>
          <p className={styles.textBoarding}><strong>DATE:</strong> {props.date}</p>
          {props.time && <p className={styles.textBoarding}><strong>TIME:</strong> {props.time}</p>}
          {props.location && <p className={styles.textBoarding}><strong>LOC:</strong> {props.location}</p>}
          {props.zone && <p className={styles.textBoarding}><strong>ZONE:</strong> {props.zone}</p>}

          <div className={styles.nameBlock}>
            <div className={`${styles.textBoarding} ${styles.smallText}`}>NAME</div>
            <div className={`${styles.textBoarding} ${styles.headerTitle}`}>{props.name}</div>
          </div>

          {props.price && (
            <div>
              <div className={`${styles.textBoarding} ${styles.smallText}`}>ENTRY</div>
              <div className={`${styles.textBoarding} ${styles.headerTitle}`}>{props.price}</div>
            </div>
          )}
        </div>

        <div className={styles.separator} />

        <div className={styles.qrContainer}>
          <div className={styles.qrInner}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${props.ticketId}`}
              className={styles.qrImgFull}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// =========================
// MINIMAL
// =========================
function MinimalTicket(props: TicketProps) {

  const bg = buildBackground(800, 1200)

  return (
    <div
      className={styles.containerMinimal} 
      style={{ backgroundImage: `url(${bg})` }}
      >

      <div className={styles.overlayMinimal} />

      <div className={`${styles.paddingHeader} ${styles.headerMinimal}`}>
        <div className={`${styles.textMinimal} ${styles.titleMinimal}`}>
          {props.eventName}
        </div>
        <div className={`${styles.textMinimal} ${styles.subText}`}>
          {props.date} {props.time && `| ${props.time}`}
        </div>
      </div>


      <div className={styles.qrContainer}>
        <div className={styles.qrInnerMinimal}>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${props.ticketId}`}
            className={styles.qrImgFixed}
          />
        </div>
        <span className={`${styles.textBoarding} ${styles.smallText}`}>
          ID: { uuidToShortId( props.ticketId)}
        </span>
      </div>


      <div className={`${styles.center} ${styles.bottomSpacing}`}>
        <div className={`${styles.textMinimal} ${styles.smallText}`}>ACCESS</div>
        <div className={styles.textMinimal}>VIP</div>

        <div className={`${styles.textMinimal} ${styles.nameBlock}`} 
          style={{fontWeight:'900'}}
        >
          {props.name}
        </div>
      </div>
    </div>
  )
}