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
        <Sidebar />
        <TopBar />
        {/* Main content area — offset for sidebar (136px) and topbar (64px) */}
        <main
          style={{
            marginLeft: 136,
            paddingTop: 64,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
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
