import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AegisX – Unified AI-Augmented SOC Command Center',
  description: 'Enterprise SOC command platform demo with SIEM + SOAR + AI augmentation.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-soc-gradient text-foreground">
          {children}
        </div>
      </body>
    </html>
  )
}
