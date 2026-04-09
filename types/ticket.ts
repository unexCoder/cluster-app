// @/types/ticket.ts

// ---------------------------------------------------------------------------
// Variantes de presentación
// ---------------------------------------------------------------------------
export type TicketVariant = 'boarding' | 'minimal'

// ---------------------------------------------------------------------------
// Tipo de dominio unificado
// Todas las props opcionales están explícitamente documentadas.
// Los assets (qr_src) deben llegar ya resueltos desde el servidor:
//   - web:        URL pública  → /api/qr/<ticket_id>?bg=…
//   - email/PDF:  data URI     → data:image/png;base64,…
// ---------------------------------------------------------------------------
export interface TicketData {
  // --- Identificación -------------------------------------------------------
  /** UUID raw, fuente de verdad del ticket. */
  ticket_id: string
  /**
   * Short display ID derivado (ej. "AB-012345").
   * Puede precalcularse con `formatTicketNumber(ticket_id)` o venir del servidor.
   * Si está ausente, los componentes lo calculan internamente como fallback.
   */
  ticket_number?: string

  // --- Evento ---------------------------------------------------------------
  event_name: string
  date: string
  /** Hora de apertura/inicio. Ej: "21:00" */
  time?: string
  /** Venue o dirección visible en la pieza. */
  location?: string

  // --- Tier / Zona ----------------------------------------------------------
  /**
   * Unifica `zone` (TicketCard) y `tier_name` (PassCard).
   * Ej: "VIP", "Campo", "Platea Alta".
   */
  tier_name?: string
  /** Precio de la entrada. Ej: "$15.000" */
  tier_price?: string

  // --- Titular --------------------------------------------------------------
  /** Nombre completo del asistente. */
  guest_name: string

  // --- Assets (resueltos externamente) ------------------------------------
  /**
   * URL de imagen de fondo.
   * Puede incluir params de tamaño: `&width=…&height=…`
   * Para email debe ser una URL pública absoluta (no relativa).
   */
  background_url: string
  /**
   * Source del QR code.
   * - Web:       URL pública (`/api/qr/<id>?bg=…`)
   * - Email/PDF: data URI base64 (`data:image/png;base64,…`)
   * Si está ausente, el componente web puede construirlo como fallback.
   */
  qr_src?: string

  // --- Presentación ---------------------------------------------------------
  /** Variante visual. Sólo relevante para el canal web (TicketCard). */
  variant?: TicketVariant
}

// ---------------------------------------------------------------------------
// Utilidades de dominio
// ---------------------------------------------------------------------------

/**
 * Convierte un UUID en el short display ID que se muestra en la pieza.
 * Ej: "a3f2c1d4-..." → "AB-012345"
 *
 * Extraída de TicketCard — punto de verdad único.
 */
export function formatTicketNumber(uuid: string): string {
  const clean = uuid.replace(/-/g, '')
  const char1 = String.fromCharCode(65 + parseInt(clean[0], 16) % 26)
  const char2 = String.fromCharCode(65 + parseInt(clean[1], 16) % 26)
  const num   = parseInt(clean.slice(2, 8), 16) % 1_000_000
  return `${char1}${char2}-${String(num).padStart(6, '0')}`
}

/**
 * Devuelve el ticket_number display listo para renderizar.
 * Prioriza el campo precalculado; si falta, lo deriva del UUID.
 */
export function resolveTicketNumber(data: Pick<TicketData, 'ticket_id' | 'ticket_number'>): string {
  return data.ticket_number ?? formatTicketNumber(data.ticket_id)
}

/**
 * Parsea los params `bckGnda` y `bckGndb` embebidos en la background_url.
 * Usados para parametrizar el color de fondo del QR.
 */
export function extractBackgroundParams(url: string): { bckGnda: string | null; bckGndb: string | null } {
  try {
    const params = new URL(url).searchParams
    return {
      bckGnda: params.get('bckGnda'),
      bckGndb: params.get('bckGndb'),
    }
  } catch {
    return { bckGnda: null, bckGndb: null }
  }
}

/**
 * Appends width/height params to a background_url for responsive sizing.
 * Mantiene la lógica de `buildBackground` de TicketCard, también en un solo lugar.
 */
export function sizeBackgroundUrl(url: string, width: number, height: number): string {
  return `${url}&width=${width * 2}&height=${height * 2}`
}