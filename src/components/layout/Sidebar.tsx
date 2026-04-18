'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Send,
  Bell,
  RotateCcw,
  BookOpen,
  History,
  Truck,
  Package,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',              label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/orders',        label: 'Orders',       icon: ShoppingBag },
  { href: '/shipments',     label: 'Shipments',    icon: Send },
  { href: '/alerts',        label: 'Alerts',       icon: Bell },
  { href: '/returns',       label: 'Returns',      icon: RotateCcw },
  { href: '/address-book',  label: 'Address Book', icon: BookOpen },
  { href: '/batch-history', label: 'Batch History',icon: History },
  { href: '/collections',   label: 'Collections',  icon: Truck },
  { href: '/packing',       label: 'Packing',      icon: Package },
  { href: '/settings',      label: 'Settings',     icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-screen w-[136px] flex flex-col z-40"
      style={{ background: '#0A0B1E', borderRight: '1px solid #2A2D4A' }}>

      {/* Logo */}
      <div className="flex items-center justify-center h-16 shrink-0"
        style={{ borderBottom: '1px solid #2A2D4A' }}>
        <span className="text-2xl font-black tracking-tight"
          style={{ color: '#00C853', fontFamily: 'Arial, sans-serif', letterSpacing: '-1px' }}>
          moov
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col items-center py-3 gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="w-full flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg mx-1 transition-all duration-150 group"
              style={{
                width: 'calc(100% - 12px)',
                background: active ? 'rgba(0,200,83,0.12)' : 'transparent',
                color: active ? '#00C853' : '#9AA0BC',
              }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                style={{ color: active ? '#00C853' : '#9AA0BC' }}
              />
              <span
                className="text-center leading-tight"
                style={{
                  fontSize: '10px',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#00C853' : '#9AA0BC',
                  lineHeight: '1.2',
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
