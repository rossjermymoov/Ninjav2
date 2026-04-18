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
      style={{ background: '#171B2D', borderBottom: '1px solid #2A2D4A', gap: 16 }}
    >
      {/* Welcome / date block */}
      <div className="shrink-0">
        <p style={{ fontWeight: 700, color: '#E5E5E5', fontSize: 15, lineHeight: 1.2, fontFamily: 'Mulish, sans-serif' }}>Welcome, Ninja</p>
        <p style={{ color: '#9FA2B4', fontSize: 11, fontFamily: 'Mulish, sans-serif', letterSpacing: '0.1px' }}>{date}</p>
      </div>

      {/* Time block */}
      <div className="shrink-0 text-right" style={{ borderLeft: '1px solid #2A2D4A', paddingLeft: 16 }}>
        <p className="tabular-nums" style={{ fontWeight: 600, color: '#FFFFFF', fontSize: 15, lineHeight: 1.2, fontFamily: 'Mulish, sans-serif' }}>{time}</p>
        <p style={{ color: '#9FA2B4', fontSize: 11, fontFamily: 'Mulish, sans-serif', letterSpacing: '0.1px' }}>London, GMT</p>
      </div>

      {/* Search — flex-1 pushes everything right */}
      <div
        className="flex-1 flex items-center gap-2 px-4 h-9 rounded-full"
        style={{ background: 'rgba(253,255,255,0.08)', border: '1px solid #2A2D4A' }}
      >
        <Search size={14} style={{ color: '#9FA2B4', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search name, order ID or address line here..."
          className="flex-1 bg-transparent outline-none"
          style={{ fontSize: 12, color: '#fff', fontFamily: 'Mulish, sans-serif' }}
        />
      </div>

      {/* Action buttons */}
      <button
        className="shrink-0 px-5 h-9 rounded-full transition-opacity hover:opacity-90"
        style={{ background: '#1DFB9D', color: '#16122A', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'Mulish, sans-serif', letterSpacing: '0.1px' }}
      >
        Get a Quote
      </button>
      <button
        className="shrink-0 px-5 h-9 rounded-full transition-opacity hover:opacity-90"
        style={{ background: '#1DFB9D', color: '#16122A', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'Mulish, sans-serif', letterSpacing: '0.1px' }}
      >
        Moov Freight
      </button>

      {/* Utility icons */}
      <div className="flex items-center shrink-0" style={{ gap: 4 }}>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <Mail size={15} style={{ color: '#1DFB9D' }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <Calendar size={15} style={{ color: '#1DFB9D' }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <LayoutGrid size={15} style={{ color: '#1DFB9D' }} />
        </button>
      </div>

      {/* Divider */}
      <div className="shrink-0 w-px h-8" style={{ background: '#DFE0EB', opacity: 0.3 }} />

      {/* Company + Avatar — hard right */}
      <div className="flex items-center gap-3 shrink-0">
        <span style={{ fontWeight: 600, color: '#E5E5E5', fontSize: 14, whiteSpace: 'nowrap', fontFamily: 'Mulish, sans-serif', letterSpacing: '0.2px' }}>
          Stealth Fulfilment
        </span>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
          style={{ background: '#6F4B9F', border: '1.5px solid #DFE0EB', color: '#fff', fontSize: 13, fontFamily: 'Mulish, sans-serif' }}
        >
          SF
        </div>
      </div>
    </header>
  )
}
