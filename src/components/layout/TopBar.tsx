'use client'

import { useState, useEffect } from 'react'
import { Search, Mail, Calendar, LayoutGrid } from 'lucide-react'

const M = 'Mulish, sans-serif'

export function TopBar() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
      setDate(now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }))
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header
      className="fixed top-0 left-[145px] right-0 flex items-center px-5 z-30"
      style={{
        height: 80,
        background: '#171B2D',
        borderBottom: '1px solid rgba(229,229,229,0.25)',
        gap: 16,
      }}
    >
      {/* Welcome / date block — Figma: title 24px bold left:29, date 16px semibold top:45 */}
      <div className="shrink-0" style={{ minWidth: 0 }}>
        <p style={{
          fontFamily: M, fontWeight: 700, fontSize: 24, lineHeight: '30px',
          letterSpacing: '0.3px', color: '#E5E5E5', margin: 0,
        }}>
          Welcome, Ninja
        </p>
        <p style={{
          fontFamily: M, fontWeight: 600, fontSize: 16, lineHeight: '22px',
          letterSpacing: '0.3px', color: '#FFFFFF', margin: 0,
        }}>
          {date}
        </p>
      </div>

      {/* Time block — Figma: time 16px semibold left:346 top:27, "London GMT" 12px top:47 */}
      <div className="shrink-0" style={{ borderLeft: '1px solid rgba(229,229,229,0.15)', paddingLeft: 16 }}>
        <p className="tabular-nums" style={{
          fontFamily: M, fontWeight: 600, fontSize: 16, lineHeight: '22px',
          letterSpacing: '0.3px', color: '#FFFFFF', margin: 0,
        }}>
          {time}
        </p>
        <p style={{
          fontFamily: M, fontWeight: 600, fontSize: 12, lineHeight: '15px',
          letterSpacing: '0.1px', color: '#FFFFFF', margin: 0,
        }}>
          London, GMT
        </p>
      </div>

      {/* Search — flex-1, Figma: bg #FDFFFF opacity 0.2, no border, radius 15.5px, placeholder 10px */}
      <div
        className="flex-1 flex items-center gap-2 px-4 shrink-0"
        style={{
          background: 'rgba(253,255,255,0.2)',
          borderRadius: 15.5,
          height: 36,
          minWidth: 200,
        }}
      >
        <Search size={14} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search name, order ID or address line here..."
          className="flex-1 bg-transparent outline-none"
          style={{
            fontFamily: M, fontSize: 10, letterSpacing: '0.1px',
            color: '#fff', opacity: 0.5,
          }}
        />
      </div>

      {/* Action buttons — Figma: height 35px, border-radius 20px, padding 10px 19px */}
      <button
        className="shrink-0 transition-opacity hover:opacity-90"
        style={{
          background: '#1DFB9D', color: '#16122A',
          height: 35, borderRadius: 20, padding: '0 19px',
          fontFamily: M, fontSize: 12, fontWeight: 600,
          letterSpacing: '0.1px', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
        }}
      >
        Get a Quote
      </button>
      <button
        className="shrink-0 transition-opacity hover:opacity-90"
        style={{
          background: '#1DFB9D', color: '#16122A',
          height: 35, borderRadius: 20, padding: '0 19px',
          fontFamily: M, fontSize: 12, fontWeight: 600,
          letterSpacing: '0.1px', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
        }}
      >
        Moov Freight
      </button>

      {/* Utility icons — Figma: gap 10px, icons in #1DFB9D */}
      <div className="flex items-center shrink-0" style={{ gap: 10 }}>
        <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 30, height: 30 }}>
          <Mail size={16} style={{ color: '#1DFB9D' }} />
        </button>
        <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 30, height: 30 }}>
          <Calendar size={16} style={{ color: '#1DFB9D' }} />
        </button>
        <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 30, height: 30 }}>
          <LayoutGrid size={16} style={{ color: '#1DFB9D' }} />
        </button>
      </div>

      {/* Divider — Figma: height 50px, border 1px solid #DFE0EB */}
      <div className="shrink-0" style={{ width: 1, height: 50, background: '#DFE0EB', opacity: 0.3 }} />

      {/* Company name + Avatar — Figma: name 14px semibold #E5E5E5, avatar 44px purple */}
      <div className="flex items-center gap-3 shrink-0">
        <span style={{
          fontFamily: M, fontWeight: 600, fontSize: 14, lineHeight: '20px',
          letterSpacing: '0.2px', color: '#E5E5E5', whiteSpace: 'nowrap',
        }}>
          Stealth Fulfilment
        </span>
        <div
          className="flex items-center justify-center font-bold"
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#6F4B9F', border: '1.5px solid #DFE0EB',
            color: '#fff', fontSize: 13, fontFamily: M,
            flexShrink: 0,
          }}
        >
          SF
        </div>
      </div>
    </header>
  )
}
