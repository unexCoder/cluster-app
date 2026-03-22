import { Suspense } from 'react'
import CheckoutFlow from './components/CheckoutFlow'

export default function CheckoutPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0f172a' }}>
      <div style={{
        borderBottom: '1px solid #1f2937',
        padding: '16px 24px',
        background: '#0f172a',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <a href="/" style={{
            fontSize: '18px', fontWeight: '700',
            color: '#f9fafb', textDecoration: 'none'
          }}>
            Festival Cluster
          </a>
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '6px', fontSize: '13px', color: '#6b7280'
          }}>
            <span>🔒</span>
            <span>Checkout seguro</span>
          </div>
        </div>
      </div>

      {/* Suspense requerido por useSearchParams */}
      <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Cargando...</div>}>
        <CheckoutFlow />
      </Suspense>
    </main>
  )
}