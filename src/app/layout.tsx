import type { Metadata } from 'next'
import { Mulish } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

const mulish = Mulish({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'MoveNinja V2',
  description: 'AI-First Order Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mulish.variable} h-full`}>
      <body className="h-full" style={{ background: '#0A0B1E', fontFamily: 'var(--font-sans, Mulish), sans-serif' }}>

        {/* Tokyo cityscape background — fixed, full-screen, behind all UI */}
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            backgroundImage: 'url(/bg-tokyo.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundRepeat: 'no-repeat',
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        />

        <Sidebar />
        <TopBar />
        {/* Main content area — offset for sidebar (145px) and topbar (80px) */}
        <main
          style={{
            marginLeft: 145,
            paddingTop: 80,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(23,27,45,0.5)',
            boxShadow: 'inset 0 48px 36px -57px rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24 }}>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
