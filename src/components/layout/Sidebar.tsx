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

const M = 'Mulish, sans-serif'

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
    // Figma: width:145px, full height, bg #171B2D
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{ width: 145, background: '#171B2D', borderRight: '1px solid #2A2D4A' }}
    >
      {/* Logo — Figma: logo group 80×80px at left:32 top:24, section ~112px tall */}
      <div
        className="flex flex-col items-center justify-center shrink-0"
        style={{ height: 112, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Ninja mascot icon — 80×80 in Figma, simplified as emoji in circle */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 40, height: 40, background: 'rgba(29,251,157,0.12)', border: '1.5px solid #1DFB9D', marginBottom: 6 }}
        >
          <span style={{ fontSize: 20 }}>🥷</span>
        </div>
        {/* moov wordmark */}
        <span style={{
          color: '#1DFB9D', fontSize: 18, fontWeight: 900,
          letterSpacing: '-0.5px', lineHeight: 1, fontFamily: M,
        }}>
          moov
        </span>
      </div>

      {/* Nav items — Figma: each item 70px tall, icon 25px, label 16px Regular */}
      <nav className="flex-1 flex flex-col overflow-y-auto" style={{ paddingTop: 0 }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center transition-all duration-150 shrink-0"
              style={{
                width: '100%',
                height: 70,
                paddingTop: 10,
                paddingBottom: 0,
                background: active ? 'rgba(159,162,180,0.08)' : 'transparent',
                borderLeft: active ? '3px solid #1DFB9D' : '3px solid transparent',
                textDecoration: 'none',
                justifyContent: 'flex-start',
              }}
            >
              {/* Icon — 25px, at top:10px of item */}
              <Icon
                size={25}
                strokeWidth={active ? 2.2 : 1.8}
                style={{ color: active ? '#1DFB9D' : '#A4A6B3', flexShrink: 0 }}
              />
              {/* Label — 16px Regular, at ~35px from item top */}
              <span
                className="text-center"
                style={{
                  fontFamily: M,
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: '20px',
                  letterSpacing: '0.2px',
                  color: active ? '#DDE2FF' : '#A4A6B3',
                  marginTop: 0,
                  paddingTop: 0,
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
