// components/FooterWrapper.tsx
'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

const HIDDEN_ON = ['/checkout']

export default function FooterWrapper() {
  const pathname = usePathname()
  if (HIDDEN_ON.some(path => pathname.startsWith(path))) return null
  return <Footer />
}