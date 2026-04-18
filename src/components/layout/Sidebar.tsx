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
      style={{ background: '#171B2D', borderRight: '1px solid #2A2D4A' }}>

      {/* Logo */}
      <div
        className="flex flex-col items-center justify-center h-20 shrink-0 gap-1"
        style={{ borderBottom: '1px solid #2A2D4A' }}
      >
        {/* Ninja mascot icon */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 32, height: 32, background: 'rgba(29,251,157,0.12)', border: '1.5px solid #1DFB9D' }}
        >
          <span style={{ fontSize: 16 }}>🥷</span>
        </div>
        {/* moov wordmark */}
        <span
          style={{
            color: '#1DFB9D',
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: '-0.5px',
            lineHeight: 1,
            fontFamily: 'Mulish, Arial, sans-serif',
          }}
        >
          moov
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col items-center py-2 gap-0 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 py-3 transition-all duration-150"
              style={{
                width: '100%',
                background: active ? 'rgba(29,251,157,0.08)' : 'transparent',
                borderLeft: active ? '3px solid #1DFB9D' : '3px solid transparent',
              }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                style={{ color: active ? '#1DFB9D' : '#A4A6B3' }}
              />
              <span
                className="text-center leading-tight"
                style={{
                  fontSize: '10px',
                  fontWeight: active ? 700 : 400,
                  color: active ? '#1DFB9D' : '#A4A6B3',
                  lineHeight: '1.2',
                  fontFamily: 'Mulish, sans-serif',
                  letterSpacing: '0.1px',
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
