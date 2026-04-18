import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'MoveNinja V2',
  description: 'AI-First Order Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full" style={{ background: '#0A0B1E' }}>
        <Sidebar />
        <TopBar />
        {/* Main content area — offset for sidebar (136px) and topbar (64px) */}
        <main
          className="min-h-screen"
          style={{ marginLeft: 136, paddingTop: 64 }}
        >
          <div className="p-6">{children}</div>
        </main>
      </body>
    </html>
  )
}
