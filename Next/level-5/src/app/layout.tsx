import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AnimBench - Animation Performance Benchmark',
  description: 'Controlled experimental study comparing animation rendering performance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
