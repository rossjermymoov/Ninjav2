'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

const M = 'Mulish, sans-serif'

// ─── Custom icon SVGs from Figma (accept sz for fluid scaling) ───────────────
function IconMail({ sz = 22 }: { sz?: number }) {
  // original viewBox: 0 0 26 18  → scale to sz wide, proportional height
  const h = Math.round(sz * 18 / 26)
  return (
    <svg width={sz} height={h} viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.70127 10.5615L12.3876 13.2703C12.5892 13.4724 12.9098 13.4724 13.1114 13.2703L15.7177 10.6581L22.507 17.4629H2.81537L9.70127 10.5615ZM0 0.854956L8.60698 9.48123L0.739895 17.3661C0.201411 17.1839 0.0138073 16.7491 0 16.1567L0 0.854956ZM25.5632 0.790303V15.8021C25.5632 16.6963 25.2417 17.2017 24.598 17.3823L16.8114 9.56188L25.5632 0.790303ZM24.1634 0L13.1108 11.0774C12.9092 11.2797 12.5885 11.2797 12.3869 11.0774L1.31849 0L24.1634 0Z" fill="#1DFB9D"/>
    </svg>
  )
}

function IconCalendar({ sz = 26 }: { sz?: number }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3.91504" y="7.92391" width="25" height="20" rx="2" fill="#171B2D" stroke="#1DFB9D" strokeWidth="2"/>
      <path d="M3.91504 11.9239C3.91504 10.0383 3.91504 9.09548 4.50083 8.5097C5.08661 7.92391 6.02942 7.92391 7.91504 7.92391H24.915C26.8007 7.92391 27.7435 7.92391 28.3293 8.5097C28.915 9.09548 28.915 10.0383 28.915 11.9239V15.9239H3.91504V11.9239Z" fill="#1DFB9D"/>
      <path d="M10.135 3.96196L10.135 7.92392" stroke="#1DFB9D" strokeWidth="2" strokeLinecap="round"/>
      <path d="M23.1851 3.96196L23.1851 7.92392" stroke="#1DFB9D" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function IconDO({ sz = 22 }: { sz?: number }) {
  // original viewBox: 0 0 25 27 → scale to sz wide, proportional height
  const h = Math.round(sz * 27 / 25)
  return (
    <svg width={sz} height={h} viewBox="0 0 25 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M22.227 9.72499V24.7224C22.227 25.9795 21.2065 27 19.9495 27H4.54613C3.28913 27 2.26858 25.9795 2.26858 24.7224V9.72499C2.26858 8.46788 3.28913 7.44737 4.54613 7.44737H19.9495C21.2065 7.44737 22.227 8.46788 22.227 9.72499ZM12.577 13.1621C12.577 13.662 12.6625 14.1228 12.8332 14.5435C13.004 14.9642 13.2465 15.3288 13.5606 15.6367C13.8747 15.9447 14.2452 16.1827 14.6722 16.3502C15.0991 16.5182 15.5688 16.602 16.0811 16.602C16.5934 16.602 17.0646 16.5182 17.4946 16.3502C17.9246 16.1827 18.2952 15.9447 18.6062 15.6367C18.9173 15.3288 19.1582 14.9642 19.329 14.5435C19.4998 14.1228 19.5852 13.662 19.5852 13.1621C19.5852 12.6558 19.4983 12.1969 19.3244 11.7849C19.1506 11.3734 18.9051 11.0198 18.5879 10.7239C18.2708 10.4279 17.9002 10.1991 17.4763 10.0375C17.0524 9.87597 16.5874 9.79541 16.0811 9.79541C15.5871 9.79541 15.1281 9.87597 14.7042 10.0375C14.2803 10.1991 13.9098 10.4279 13.5926 10.7239C13.2754 11.0198 13.0269 11.3734 12.8469 11.7849C12.667 12.1969 12.577 12.6558 12.577 13.1621ZM14.4526 13.1621C14.4526 12.8141 14.5197 12.5094 14.6539 12.247C14.7881 11.9847 14.9771 11.7789 15.2211 11.6298C15.4651 11.4801 15.7518 11.4056 16.0811 11.4056C16.4288 11.4056 16.7231 11.4801 16.964 11.6298C17.2049 11.7789 17.3894 11.9847 17.5175 12.247C17.6456 12.5094 17.7096 12.8141 17.7096 13.1621C17.7096 13.5037 17.6425 13.807 17.5084 14.0722C17.3742 14.3378 17.1866 14.5449 16.9457 14.6945C16.7047 14.8441 16.4166 14.9187 16.0811 14.9187C15.7518 14.9187 15.4651 14.8441 15.2211 14.6945C14.9771 14.5449 14.7881 14.3378 14.6539 14.0722C14.5197 13.807 14.4526 13.5037 14.4526 13.1621ZM7.60474 9.82395H5.07605V16.5799H7.60474C8.37039 16.5799 9.0283 16.4432 9.57847 16.1698C10.1286 15.8964 10.5533 15.507 10.8525 15.002C11.1516 14.497 11.3012 13.8968 11.3012 13.2022C11.3012 12.5007 11.1516 11.899 10.8525 11.3973C10.5533 10.8951 10.1286 10.5075 9.57847 10.2341C9.0283 9.96067 8.37039 9.82395 7.60474 9.82395ZM7.01599 14.9394V11.4645H7.52749C7.7527 11.4645 7.97307 11.4889 8.18865 11.5372C8.40418 11.5851 8.59884 11.6721 8.77255 11.7978C8.94626 11.923 9.08624 12.1002 9.19238 12.3285C9.29857 12.5568 9.35167 12.8482 9.35167 13.2022C9.35167 13.5557 9.29857 13.8471 9.19238 14.0754C9.08624 14.3037 8.94626 14.4809 8.77255 14.6061C8.59884 14.7318 8.40418 14.8188 8.18865 14.8666C7.97307 14.915 7.7527 14.9394 7.52749 14.9394H7.01599ZM12.577 21.161C12.577 21.6608 12.6625 22.1216 12.8332 22.5423C13.004 22.9631 13.2465 23.3276 13.5606 23.6356C13.8747 23.9435 14.2452 24.1815 14.6722 24.3491C15.0991 24.5171 15.5688 24.6009 16.0811 24.6009C16.5934 24.6009 17.0646 24.5171 17.4946 24.3491C17.9246 24.1815 18.2952 23.9435 18.6062 23.6356C18.9173 23.3276 19.1582 22.9631 19.329 22.5423C19.4998 22.1216 19.5852 21.6608 19.5852 21.161C19.5852 20.6546 19.4983 20.1957 19.3244 19.7842C19.1506 19.3722 18.9051 19.0182 18.5879 18.7227C18.2708 18.4267 17.9002 18.1979 17.4763 18.0364C17.0524 17.8748 16.5874 17.7942 16.0811 17.7942C15.5871 17.7942 15.1281 17.8748 14.7042 18.0364C14.2803 18.1979 13.9098 18.4267 13.5926 18.7227C13.2754 19.0182 13.0269 19.3722 12.8469 19.7842C12.667 20.1957 12.577 20.6546 12.577 21.161ZM14.4526 21.161C14.4526 20.813 14.5197 20.5082 14.6539 20.2459C14.7881 19.9835 14.9771 19.7777 15.2211 19.6286C15.4651 19.479 15.7518 19.4044 16.0811 19.4044C16.4288 19.4044 16.7231 19.479 16.964 19.6286C17.2049 19.7777 17.3894 19.9835 17.5175 20.2459C17.6456 20.5082 17.7096 20.813 17.7096 21.161C17.7096 21.5025 17.6425 21.8058 17.5084 22.071C17.3742 22.3366 17.1866 22.5437 16.9457 22.6933C16.7047 22.8425 16.4166 22.9175 16.0811 22.9175C15.7518 22.9175 15.4651 22.8425 15.2211 22.6933C14.9771 22.5437 14.7881 22.3366 14.6539 22.071C14.5197 21.8058 14.4526 21.5025 14.4526 21.161ZM5.0152 24.6519C7.1515 24.6404 8.56501 24.072 9.50151 23.3285C11.7633 21.532 11.3387 18.5671 11.3387 18.5671C11.2728 18.1261 10.8667 17.7975 10.3871 17.7975H4.99725V19.5825H9.44996C9.39654 20.2643 9.15028 21.2585 8.25302 21.9716C7.90752 22.2459 7.46834 22.4719 6.91521 22.6284L6.92315 21.4951L5.00176 21.4832L5.0152 24.6519ZM24.4956 4.03001V6.86875H0V4.05627C0 4.05627 8.04294 5.03303 12.0692 5.03303C16.1518 5.03303 24.4956 4.03001 24.4956 4.03001ZM1.43522 0C3.82582 0.963431 7.8478 1.7455 12.2478 1.7455C16.6478 1.7455 20.6698 0.963431 23.0604 0C22.5448 2.45208 17.8773 4.44292 12.2478 4.44292C6.61825 4.44292 1.9508 2.45208 1.43522 0Z" fill="#1DFB9D"/>
    </svg>
  )
}

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
      className="fixed top-0 right-0 flex items-center z-30"
      style={{
        left: 'var(--mn-sidebar-w)',
        height: 'var(--mn-topbar-h)',
        background: '#171B2D',
        borderBottom: '1px solid rgba(229,229,229,0.25)',
        paddingLeft: 30,
        paddingRight: 20,
      }}
    >
      {/* Welcome / date block — font sizes scale with viewport via CSS clamp */}
      <div className="shrink-0">
        <p style={{
          fontFamily: M, fontWeight: 700,
          fontSize: 'clamp(18px, 2.5vh, 24px)', lineHeight: 1.25,
          letterSpacing: '0.3px', color: '#E5E5E5', margin: 0,
        }}>
          Welcome, Ninja
        </p>
        <p style={{
          fontFamily: M, fontWeight: 600,
          fontSize: 'clamp(12px, 1.8vh, 16px)', lineHeight: 1.4,
          letterSpacing: '0.3px', color: '#FFFFFF', margin: 0,
        }}>
          {date}
        </p>
      </div>

      {/* Time block */}
      <div className="shrink-0" style={{ borderLeft: '1px solid rgba(229,229,229,0.15)', paddingLeft: 16, marginLeft: 20 }}>
        <p className="tabular-nums" style={{
          fontFamily: M, fontWeight: 600,
          fontSize: 'clamp(12px, 1.8vh, 16px)', lineHeight: 1.4,
          letterSpacing: '0.3px', color: '#FFFFFF', margin: 0,
        }}>
          {time}
        </p>
        <p style={{
          fontFamily: M, fontWeight: 600,
          fontSize: 'clamp(10px, 1.4vh, 12px)', lineHeight: 1.3,
          letterSpacing: '0.1px', color: '#FFFFFF', margin: 0,
        }}>
          London, GMT
        </p>
      </div>

      {/* Spacer — pushes right-side elements to match Figma proportions */}
      <div className="flex-1" />

      {/* Search bar — slightly narrower on 13" Mac */}
      <div
        className="flex items-center gap-2 px-4 shrink-0"
        style={{
          background: 'rgba(253,255,255,0.2)',
          borderRadius: 15.5,
          height: 'clamp(28px, 4vh, 34px)',
          width: 'clamp(220px, 20vw, 280px)',
        }}
      >
        <Search size={13} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
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

      {/* Get a Quote button */}
      <button
        className="shrink-0 transition-opacity hover:opacity-90"
        style={{
          background: '#1DFB9D', color: '#16122A',
          height: 'clamp(28px, 4vh, 35px)',
          padding: '0 14px',
          borderRadius: 20,
          fontFamily: M, fontSize: 'clamp(10px, 1.4vh, 12px)', fontWeight: 600,
          letterSpacing: '0.1px', whiteSpace: 'nowrap',
          border: 'none', cursor: 'pointer', marginLeft: 12,
        }}
      >
        Get a Quote
      </button>

      {/* Moov Freight button */}
      <button
        className="shrink-0 transition-opacity hover:opacity-90"
        style={{
          background: '#1DFB9D', color: '#16122A',
          height: 'clamp(28px, 4vh, 35px)',
          padding: '0 14px',
          borderRadius: 20,
          fontFamily: M, fontSize: 'clamp(10px, 1.4vh, 12px)', fontWeight: 600,
          letterSpacing: '0.1px', whiteSpace: 'nowrap',
          border: 'none', cursor: 'pointer', marginLeft: 12,
        }}
      >
        Moov Freight
      </button>

      {/* Utility icons — icon size tracks --mn-icon-size via JS; button size proportional */}
      <div className="flex items-center shrink-0" style={{ gap: 10, marginLeft: 18 }}>
        <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 'var(--mn-topbar-btn)', height: 'var(--mn-topbar-btn)' }}>
          <IconMail sz={20} />
        </button>
        <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 'var(--mn-topbar-btn)', height: 'var(--mn-topbar-btn)' }}>
          <IconCalendar sz={22} />
        </button>
        <button className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 'var(--mn-topbar-btn)', height: 'var(--mn-topbar-btn)' }}>
          <IconDO sz={20} />
        </button>
      </div>

      {/* Divider — Figma: height 50px */}
      <div className="shrink-0" style={{ width: 1, height: 50, background: '#DFE0EB', opacity: 0.3, marginLeft: 16 }} />

      {/* Company name + Avatar */}
      <div className="flex items-center gap-3 shrink-0" style={{ marginLeft: 14 }}>
        <span style={{
          fontFamily: M, fontWeight: 600,
          fontSize: 'clamp(11px, 1.6vh, 14px)', lineHeight: 1.4,
          letterSpacing: '0.2px', color: '#E5E5E5', whiteSpace: 'nowrap',
        }}>
          Stealth Fulfilment
        </span>
        <div
          className="flex items-center justify-center font-bold"
          style={{
            width: 'clamp(34px, 5vh, 44px)', height: 'clamp(34px, 5vh, 44px)',
            borderRadius: '50%',
            background: '#6F4B9F', border: '1.5px solid #DFE0EB',
            color: '#fff', fontSize: 'clamp(11px, 1.5vh, 13px)', fontFamily: M,
            flexShrink: 0,
          }}
        >
          SF
        </div>
      </div>
    </header>
  )
}
