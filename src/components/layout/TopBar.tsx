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
      className="fixed top-0 left-[136px] right-0 h-16 flex items-center gap-4 px-5 z-30"
      style={{ background: '#0A0B1E', borderBottom: '1px solid #2A2D4A' }}
    >
      {/* Welcome */}
      <div className="shrink-0">
        <p className="font-bold text-white text-base leading-tight">Welcome, Ninja</p>
        <p className="text-xs leading-tight" style={{ color: '#9AA0BC' }}>
          {date}
        </p>
      </div>

      {/* Time */}
      <div className="shrink-0 ml-2 text-right">
        <p className="font-bold text-white text-base leading-tight tabular-nums">{time}</p>
        <p className="text-xs leading-tight" style={{ color: '#9AA0BC' }}>London, GMT</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4">
        <div
          className="flex items-center gap-2 px-4 h-9 rounded-full"
          style={{ background: '#1C1E35', border: '1px solid #2A2D4A' }}
        >
          <Search size={14} style={{ color: '#9AA0BC' }} />
          <input
            type="text"
            placeholder="Search name, order ID or address..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-mn-text-muted"
            style={{ fontSize: '13px', color: '#fff' }}
          />
        </div>
      </div>

      {/* Quick action buttons */}
      <button
        className="flex items-center gap-2 px-4 h-9 rounded-full font-semibold text-sm shrink-0 transition-opacity hover:opacity-90"
        style={{ background: '#00C853', color: '#000', fontSize: '13px' }}
      >
        Get a Quote
      </button>
      <button
        className="flex items-center gap-2 px-4 h-9 rounded-full font-semibold text-sm shrink-0 transition-opacity hover:opacity-90"
        style={{ background: '#00C853', color: '#000', fontSize: '13px' }}
      >
        Moov Freight
      </button>

      {/* Utility icons */}
      <div className="flex items-center gap-2 ml-2 shrink-0">
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <Mail size={16} style={{ color: '#9AA0BC' }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <Calendar size={16} style={{ color: '#9AA0BC' }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <LayoutGrid size={16} style={{ color: '#9AA0BC' }} />
        </button>
      </div>

      {/* Divider */}
      <div className="w-px h-8 shrink-0" style={{ background: '#2A2D4A' }} />

      {/* Company + Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-semibold text-white">Stealth Fulfilment</span>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #7B2FBE, #00C853)', color: '#fff' }}
        >
          SF
        </div>
      </div>
    </header>
  )
}
