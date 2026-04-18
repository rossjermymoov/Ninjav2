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
              className="transition-all duration-150 shrink-0"
              style={{
                position: 'relative',
                width: '100%',
                height: 70,
                display: 'block',
                background: active ? 'rgba(159,162,180,0.08)' : 'transparent',
                borderLeft: active ? '3px solid #1DFB9D' : '3px solid transparent',
                textDecoration: 'none',
              }}
            >
              {/* Icon — active: top:10px #1DFB9D | inactive: top:8px #1A745A (Figma Inactive Green) */}
              <Icon
                size={25}
                strokeWidth={active ? 2.2 : 1.8}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  top: active ? 10 : 8,
                  color: active ? '#1DFB9D' : '#1A745A',
                }}
              />
              {/* Label — active: top:39px | inactive: top:35px (from Figma CSS) */}
              <span
                style={{
                  position: 'absolute',
                  left: 34,
                  right: 28,
                  top: active ? 39 : 35,
                  fontFamily: M,
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: '20px',
                  letterSpacing: '0.2px',
                  color: active ? '#DDE2FF' : '#A4A6B3',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
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
