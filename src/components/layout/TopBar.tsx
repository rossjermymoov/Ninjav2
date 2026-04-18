'use client'

import { useState, useEffect } from 'react'
import { Search, Mail, Calendar, LayoutGrid } from 'lucide-react'

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
      className="fixed top-0 left-[136px] right-0 h-16 flex items-center px-5 z-30"
      style={{ background: '#0A0B1E', borderBottom: '1px solid #2A2D4A', gap: 16 }}
    >
      {/* Welcome block */}
      <div className="shrink-0">
        <p className="font-bold text-white leading-tight" style={{ fontSize: 15 }}>Welcome, Ninja</p>
        <p className="leading-tight" style={{ color: '#9AA0BC', fontSize: 11 }}>{date}</p>
      </div>

      {/* Time block */}
      <div className="shrink-0 text-right" style={{ borderLeft: '1px solid #2A2D4A', paddingLeft: 16 }}>
        <p className="font-bold text-white leading-tight tabular-nums" style={{ fontSize: 15 }}>{time}</p>
        <p className="leading-tight" style={{ color: '#9AA0BC', fontSize: 11 }}>London, GMT</p>
      </div>

      {/* Search — flex-1 fills all remaining space, pushing everything right */}
      <div
        className="flex-1 flex items-center gap-2 px-4 h-9 rounded-full"
        style={{ background: '#1C1E35', border: '1px solid #2A2D4A' }}
      >
        <Search size={14} style={{ color: '#9AA0BC', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search name, order ID or address line here..."
          className="flex-1 bg-transparent outline-none text-white"
          style={{ fontSize: 12 }}
        />
      </div>

      {/* Action buttons */}
      <button
        className="shrink-0 px-4 h-9 rounded-full font-bold transition-opacity hover:opacity-90"
        style={{ background: '#00C853', color: '#000', fontSize: 12, whiteSpace: 'nowrap' }}
      >
        Get a Quote
      </button>
      <button
        className="shrink-0 px-4 h-9 rounded-full font-bold transition-opacity hover:opacity-90"
        style={{ background: '#00C853', color: '#000', fontSize: 12, whiteSpace: 'nowrap' }}
      >
        Moov Freight
      </button>

      {/* Utility icons */}
      <div className="flex items-center shrink-0" style={{ gap: 4 }}>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <Mail size={15} style={{ color: '#9AA0BC' }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <Calendar size={15} style={{ color: '#9AA0BC' }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <LayoutGrid size={15} style={{ color: '#9AA0BC' }} />
        </button>
      </div>

      {/* Divider */}
      <div className="shrink-0 w-px h-8" style={{ background: '#2A2D4A' }} />

      {/* Company + Avatar — hard right */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-semibold text-white" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
          Stealth Fulfilment
        </span>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
          style={{ background: 'linear-gradient(135deg, #7B2FBE, #00C853)', color: '#fff', fontSize: 13 }}
        >
          SF
        </div>
      </div>
    </header>
  )
}
