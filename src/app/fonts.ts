import localFont from 'next/font/local'

export const montreal = localFont({
  src: [
    {
      path: '../../public/fonts/PPNeueMontreal-Book.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PPNeueMontreal-Bold.otf',
      weight: '700',
      style: 'bold',
    },
    // Add more variants as needed
  ],
  variable: '--font-montreal',
  display: 'swap', // Optional: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
})
