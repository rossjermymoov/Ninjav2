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

// wide: true  → full-width item (Packing, Settings) — label left:19 right:17 top:43
// mintIcon    → icon is always #1DFB9D even when inactive (Packing only)
// dividerBefore → render a subtle horizontal divider above this item (Settings)
const NAV_ITEMS = [
  { href: '/',              label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/orders',        label: 'Orders',       icon: ShoppingBag },
  { href: '/shipments',     label: 'Shipments',    icon: Send },
  { href: '/alerts',        label: 'Alerts',       icon: Bell },
  { href: '/returns',       label: 'Returns',      icon: RotateCcw },
  { href: '/address-book',  label: 'Address Book', icon: BookOpen },
  { href: '/batch-history', label: 'Batch History',icon: History },
  { href: '/collections',   label: 'Collections',  icon: Truck },
  { href: '/packing',       label: 'Packing',      icon: Package,  wide: true, mintIcon: true },
  { href: '/settings',      label: 'Settings',     icon: Settings, wide: true, dividerBefore: true },
] as const

export function Sidebar() {
  const pathname = usePathname()

  return (
    // Figma: width:145px, full height, bg #171B2D
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40"
      style={{ width: 145, background: '#171B2D', borderRight: '1px solid #2A2D4A' }}
    >
      {/* Logo — Figma: section 112px tall, logo 80×80 at left:32 top:24 */}
      <div
        className="flex flex-col items-center justify-center shrink-0"
        style={{ height: 112, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 40, height: 40, background: 'rgba(29,251,157,0.12)', border: '1.5px solid #1DFB9D', marginBottom: 6 }}
        >
          <span style={{ fontSize: 20 }}>🥷</span>
        </div>
        <span style={{
          color: '#1DFB9D', fontSize: 18, fontWeight: 900,
          letterSpacing: '-0.5px', lineHeight: 1, fontFamily: M,
        }}>
          moov
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const { href, label, icon: Icon } = item
          const wide       = 'wide'         in item && item.wide
          const mintIcon   = 'mintIcon'     in item && item.mintIcon
          const divBefore  = 'dividerBefore' in item && item.dividerBefore
          const active     = pathname === href || (href !== '/' && pathname.startsWith(href))

          // Icon colour:
          //   active       → #1DFB9D (mint)
          //   inactive + mintIcon → #1DFB9D (Packing — always mint per Figma)
          //   inactive        → #1A745A (Figma Inactive Green)
          const iconColor = active ? '#1DFB9D' : mintIcon ? '#1DFB9D' : '#1A745A'

          return (
            <div key={href}>
              {/* Divider before Settings — Figma: top:756, opacity:0.06, #DFE0EB */}
              {divBefore && (
                <div style={{
                  height: 1,
                  margin: '0 16px',
                  background: '#DFE0EB',
                  opacity: 0.06,
                  flexShrink: 0,
                }} />
              )}

              <Link
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
                {wide ? (
                  // ── Wide item (Packing / Settings) ───────────────────────────
                  // Figma: icon left:~61 top:24 (Packing) / top:7 (Settings)
                  //        label left:19 right:17 top:43
                  <>
                    <Icon
                      size={25}
                      strokeWidth={active ? 2.2 : 1.8}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: mintIcon ? 24 : 7,   // Packing:24 | Settings:7
                        color: iconColor,
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      left: 19, right: 17, top: 43,
                      fontFamily: M, fontSize: 16, fontWeight: 400,
                      lineHeight: '20px', letterSpacing: '0.2px',
                      color: active ? '#DDE2FF' : '#A4A6B3',
                      textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden',
                    }}>
                      {label}
                    </span>
                  </>
                ) : (
                  // ── Standard item ─────────────────────────────────────────────
                  // Figma: icon top:8(inactive)/10(active), label top:35/39
                  <>
                    <Icon
                      size={25}
                      strokeWidth={active ? 2.2 : 1.8}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        top: active ? 10 : 8,
                        color: iconColor,
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      left: 34, right: 28,
                      top: active ? 39 : 35,
                      fontFamily: M, fontSize: 16, fontWeight: 400,
                      lineHeight: '20px', letterSpacing: '0.2px',
                      color: active ? '#DDE2FF' : '#A4A6B3',
                      textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden',
                    }}>
                      {label}
                    </span>
                  </>
                )}
              </Link>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
