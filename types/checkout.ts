export interface CartItem {
  tier_id: string
  tier_name: string
  event_id: string
  event_name: string
  price: number
  quantity: number
}

export interface GuestInfo {
  guest_name: string
  guest_email: string
  guest_phone: string
  doc_type: 'DNI' | 'CUIL' | 'CUIT' | 'Passport'
  doc_number: string
}

export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'rapipago'
  | 'pagofacil'
  | 'paypal'

export interface CardInfo {
  card_number: string
  expiration_month: number
  expiration_year: number
  security_code: string
  cardholder_name: string
  installments: number
}

export interface CheckoutState {
  step: 1 | 2 | 3 | 4
  cart: CartItem[]
  guest: GuestInfo | null
  order_id: string | null
  order_number: string | null
  payment_method: PaymentMethod | null
  card: CardInfo | null
}