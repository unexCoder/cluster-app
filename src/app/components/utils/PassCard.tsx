import React from 'react'
import styles from './passCard.module.css'
import { type TicketData, resolveTicketNumber } from '@/../types/ticket'

// ---------------------------------------------------------------------------
// PassCard — componente visual
// Usa CSS module normal. El inlining para email lo hace @react-email/render
// en la capa de envío (ver @/lib/email/renderTicket.ts).
// ---------------------------------------------------------------------------
export const PassCard: React.FC<TicketData> = (props) => {
  const num = resolveTicketNumber(props)
  const qr = props.qr_src ?? ''

  return (
    <div className={styles.container} style={{ maxWidth: '400px' }}>
      <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>

        <table
          width="600"
          cellPadding={0}
          cellSpacing={0}
          className={styles.table}
          style={{ width: '100%', backgroundColor: '#1a1a2e', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', border: '1px solid #2d2d44' }}
        >
          <tbody>
            {props.background_url && (
              <tr>
                <td>
                  <img
                    src={props.background_url}
                    alt={props.event_name}
                    width="600"
                    className={styles.headerImage}
                    style={{ display: 'block', width: '100%', maxWidth: '600px', borderRadius: '12px 12px 0 0' }}
                  />
                </td>
              </tr>
            )}

            <tr>
              <td className={styles.innerContainer} style={{ padding: '20px' }}>
                <table cellPadding={0} cellSpacing={0} className={styles.innerTable} style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td className={styles.leftCol} style={{ width: '60%', verticalAlign: 'top' }}>
                        {props.tier_name && (
                          <>
                            <p className={styles.label} style={{ margin: '0 0 2px', color: '#9ca3af', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Zona</p>
                            <p className={styles.valuePrimary} style={{ margin: '0 0 16px', color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>{props.tier_name}</p>
                          </>
                        )}
                        <p className={styles.label} style={{ margin: '0 0 2px', color: '#9ca3af', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Titular</p>
                        <p className={styles.valueSecondary} style={{ margin: '0 0 16px', color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>{props.guest_name}</p>
                        <p className={styles.label} style={{ margin: '0 0 2px', color: '#9ca3af', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>N° de entrada</p>
                        <p className={styles.ticketNumber} style={{ margin: 0, color: '#ffffff', fontSize: '13px', fontFamily: 'monospace' }}>{num}</p>
                      </td>

                      <td className={styles.rightCol} style={{ width: '40%', verticalAlign: 'top', textAlign: 'right', padding: '6px' }}>
                        {qr
                          ? <img
                            src={qr}
                            alt="QR"
                            width="120"
                            height="120"
                            className={styles.qr}
                            style={{
                              display: 'block',
                              border: 0,
                              borderRadius: '8px',
                              background: '#ffffff33',
                              marginLeft: 'auto',
                              imageRendering: 'pixelated',
                              padding: '6px',
                              maxWidth: '120px',
                              maxHeight: '120px',
                            }}
                          />
                          : <div className={styles.qr} style={{ width: '120px', height: '120px', borderRadius: '8px', background: '#ffffff33', padding: '6px', display: 'block', marginLeft: 'auto' }}>QR pendiente</div>
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </a>
    </div>
  )
}
