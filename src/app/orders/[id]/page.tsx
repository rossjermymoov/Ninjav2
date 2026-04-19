'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MOCK_ORDERS } from '@/lib/mock/orders'
import { CHANNEL_FALLBACKS } from '@/lib/channels'
import { colors, font, radii } from '@/lib/tokens'
import type { SalesChannel } from '@/types/order'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string
  product: string
  sku: string
  qty: number
  price: string
  hasError?: boolean
  errorMsg?: string
}

interface Activity {
  id: string
  timestamp: string
  user: string
  note: string
  type?: 'info' | 'error' | 'success'
}

// ─── Mock data helpers ────────────────────────────────────────────────────────

function getMockItems(orderId: string): OrderItem[] {
  const maps: Record<string, OrderItem[]> = {
    '1': [
      { id: 'i1', product: 'Bluetooth Headset', sku: 'BT-HEADSET-BLK', qty: 1, price: '£34.99' },
    ],
    '2': [
      { id: 'i1', product: 'Portable Speaker', sku: 'SPK-PORTABLE-WHT', qty: 1, price: '£29.99' },
      { id: 'i2', product: 'Portable Speaker', sku: 'SPK-PORTABLE-WHT', qty: 1, price: '£29.99' },
    ],
    '3': [
      { id: 'i1', product: 'Bluetooth Headset', sku: 'BT-HEADSET-BLK', qty: 1, price: '£34.99' },
      { id: 'i2', product: 'USB Cable Type-C', sku: 'USB-CABLE-C', qty: 1, price: '£7.99', hasError: true, errorMsg: 'SKU data missing' },
      { id: 'i3', product: 'Charging Pad 10W', sku: 'CHG-PAD-10W', qty: 1, price: '£19.99' },
    ],
    '7': [
      { id: 'i1', product: 'Portable Speaker Black', sku: 'SPK-PORTABLE-BLK', qty: 1, price: '£29.99' },
    ],
  }
  const order = MOCK_ORDERS.find(o => o.id === orderId)
  return maps[orderId] ?? (order ? [
    { id: 'i1', product: order.sku[0] ?? 'Product', sku: order.sku[0] ?? 'SKU', qty: 1, price: '£0.00' },
  ] : [])
}

function getMockActivities(): Activity[] {
  return [
    { id: 'a1', timestamp: '2024-03-15 09:34', user: 'System',                 note: 'Order received from channel',                    type: 'info' },
    { id: 'a2', timestamp: '2024-03-15 09:35', user: 'System',                 note: 'Validation passed — order marked as ready',       type: 'success' },
    { id: 'a3', timestamp: '2024-03-15 10:12', user: 'admin@moovninja.com',    note: 'Delivery service confirmed as 24 Hour',            type: 'info' },
  ]
}

// ─── Pill field row ───────────────────────────────────────────────────────────
// Label: grey-tinted left pill; Value: white-tinted right (editable or static)

function FieldRow({ label, value, editable = false, onChange, mono = false }: {
  label: string
  value: string
  editable?: boolean
  onChange?: (v: string) => void
  mono?: boolean
}) {
  const M = font.family
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      height: 34, borderRadius: 12,
      background: 'rgba(253,255,255,0.06)',
      overflow: 'hidden',
    }}>
      <div style={{
        width: 140, flexShrink: 0,
        height: '100%', display: 'flex', alignItems: 'center',
        padding: '0 12px',
        background: 'rgba(223,224,235,0.12)',
        borderRight: '1px solid rgba(253,255,255,0.07)',
      }}>
        <span style={{
          fontSize: '11px', fontWeight: font.weight.semibold,
          color: 'rgba(253,255,255,0.55)', fontFamily: M,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {label}
        </span>
      </div>
      <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
        {editable ? (
          <input
            value={value}
            onChange={e => onChange?.(e.target.value)}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              fontSize: '12px', fontWeight: font.weight.semibold,
              color: '#FDFFFF', fontFamily: mono ? 'monospace' : M,
              letterSpacing: mono ? '0.04em' : 'normal',
            }}
          />
        ) : (
          <span style={{
            fontSize: '12px', fontWeight: font.weight.semibold,
            color: '#FDFFFF', fontFamily: mono ? 'monospace' : M,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            letterSpacing: mono ? '0.04em' : 'normal',
          }}>
            {value}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Card + CardTitle ─────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: colors.cardBg,
      border: `1px solid ${colors.borderMint}`,
      borderRadius: radii.card,
      padding: '18px 20px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: '10px', fontWeight: font.weight.extrabold,
      color: 'rgba(253,255,255,0.35)', fontFamily: font.family,
      textTransform: 'uppercase', letterSpacing: '0.10em',
      display: 'block', marginBottom: 12,
    }}>
      {children}
    </span>
  )
}

// ─── Qty badge ────────────────────────────────────────────────────────────────

function QtyBadge({ qty }: { qty: number }) {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%',
      background: colors.mint,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span style={{ fontSize: '11px', fontWeight: font.weight.extrabold, color: '#0A0B1E', fontFamily: font.family }}>
        {qty}
      </span>
    </div>
  )
}

// ─── Items table ──────────────────────────────────────────────────────────────

function ItemsTable({ items, onAddProduct }: { items: OrderItem[]; onAddProduct: () => void }) {
  const M = font.family
  return (
    <div style={{ border: `1px solid ${colors.mint}`, borderRadius: 12, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 140px 52px 76px 60px',
        background: '#171B2D', padding: '0 14px', height: 34, alignItems: 'center', gap: 8,
      }}>
        {['Product', 'SKU', 'Qty', 'Price', ''].map((h, i) => (
          <span key={i} style={{
            fontSize: '10px', fontWeight: font.weight.extrabold,
            color: 'rgba(253,255,255,0.45)', fontFamily: M,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            textAlign: i === 2 ? 'center' : 'left',
          }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {items.map(item => (
        <div key={item.id}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 140px 52px 76px 60px',
            background: item.hasError ? 'rgba(205,28,105,0.14)' : 'rgba(253,255,255,0.04)',
            borderTop: '1px solid rgba(253,255,255,0.06)',
            padding: '0 14px', minHeight: 44, alignItems: 'center', gap: 8,
          }}>
            {/* Product */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {item.hasError && (
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: '#CD1C69', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '10px', fontWeight: font.weight.extrabold, color: '#FDFFFF', fontFamily: M }}>!</span>
                </div>
              )}
              <span style={{
                fontSize: '13px', fontWeight: font.weight.semibold,
                color: item.hasError ? '#FF6B8A' : '#FDFFFF', fontFamily: M,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{item.product}</span>
            </div>

            {/* SKU */}
            <span style={{
              fontSize: '11px', fontWeight: font.weight.semibold,
              color: item.hasError ? '#FF6B8A' : 'rgba(253,255,255,0.55)', fontFamily: M,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{item.sku}</span>

            {/* Qty */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <QtyBadge qty={item.qty} />
            </div>

            {/* Price */}
            <span style={{
              fontSize: '13px', fontWeight: font.weight.semibold,
              color: item.hasError ? '#FF6B8A' : '#FDFFFF', fontFamily: M,
            }}>{item.price}</span>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, opacity: 0.75 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M11.334 1.99967C11.5091 1.8246 11.7169 1.68593 11.9456 1.59168C12.1743 1.49744 12.4194 1.44922 12.6667 1.44922C12.9139 1.44922 13.159 1.49744 13.3877 1.59168C13.6164 1.68593 13.8242 1.8246 13.9993 1.99967C14.1744 2.17473 14.3131 2.38257 14.4073 2.61126C14.5016 2.83995 14.5498 3.08507 14.5498 3.33234C14.5498 3.5796 14.5016 3.82472 14.4073 4.05341C14.3131 4.2821 14.1744 4.48994 13.9993 4.665L4.99935 13.665L1.33268 14.6663L2.33268 11.0003L11.334 1.99967Z" stroke={colors.mint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, opacity: 0.75 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333A1.333 1.333 0 0111.333 14.667H4.667A1.333 1.333 0 013.333 13.333V4h9.334z" stroke={colors.mint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {item.hasError && item.errorMsg && (
            <div style={{
              padding: '5px 14px 7px',
              background: 'rgba(205,28,105,0.09)',
              borderTop: '1px solid rgba(205,28,105,0.20)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 4a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 7a1 1 0 100 2 1 1 0 000-2z"
                  fill="#CD1C69"/>
              </svg>
              <span style={{ fontSize: '11px', fontWeight: font.weight.bold, color: '#CD1C69', fontFamily: M }}>
                {item.errorMsg}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Add product */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end',
        padding: '10px 14px',
        borderTop: '1px solid rgba(253,255,255,0.06)',
        background: 'rgba(253,255,255,0.02)',
      }}>
        <button
          onClick={onAddProduct}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 16px', borderRadius: 99,
            background: colors.mint, border: 'none', cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="#0A0B1E" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: '12px', fontWeight: font.weight.extrabold, color: '#0A0B1E', fontFamily: M }}>
            Add product
          </span>
        </button>
      </div>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    ready:            { color: colors.mint,        label: 'Ready' },
    processing:       { color: '#F5A623',           label: 'Processing' },
    issue:            { color: colors.statusIssue,  label: 'Issue' },
    validation_error: { color: colors.statusIssue,  label: 'Validation Error' },
    error:            { color: colors.statusIssue,  label: 'Processing Error' },
  }
  const cfg = map[status] ?? { color: colors.textMuted, label: status }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 11px', borderRadius: 99,
      background: `${cfg.color}18`, border: `1px solid ${cfg.color}50`,
      fontSize: '11px', fontWeight: font.weight.bold,
      color: cfg.color, fontFamily: font.family,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: cfg.color, boxShadow: `0 0 5px ${cfg.color}`,
        display: 'inline-block', flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  )
}

// ─── Activity entry ───────────────────────────────────────────────────────────

function ActivityEntry({ activity }: { activity: Activity }) {
  const M = font.family
  const dotColor = activity.type === 'error' ? colors.statusIssue
    : activity.type === 'success' ? colors.mint
    : 'rgba(253,255,255,0.25)'
  return (
    <div style={{ display: 'flex', gap: 10, paddingBottom: 14, borderBottom: '1px solid rgba(253,255,255,0.06)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 3 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, boxShadow: `0 0 4px ${dotColor}` }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: font.weight.bold, color: colors.mint, fontFamily: M }}>
            {activity.timestamp}
          </span>
          <span style={{ fontSize: '10px', color: 'rgba(253,255,255,0.35)', fontFamily: M }}>
            {activity.user}
          </span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: font.weight.semibold, color: 'rgba(253,255,255,0.70)', fontFamily: M }}>
          {activity.note}
        </span>
      </div>
    </div>
  )
}

// ─── Order Details page ───────────────────────────────────────────────────────

export default function OrderDetailsPage() {
  const params  = useParams()
  const router  = useRouter()
  const orderId = params?.id as string
  const order   = MOCK_ORDERS.find(o => o.id === orderId)

  const [items,         setItems]         = useState<OrderItem[]>(() => getMockItems(orderId))
  const [activityNote,  setActivityNote]  = useState('')

  // Customer fields
  const [customerName,  setCustomerName]  = useState(order?.customerName ?? '')
  const [customerEmail, setCustomerEmail] = useState('customer@example.com')
  const [customerPhone, setCustomerPhone] = useState('+44 7700 900123')

  // Address fields
  const [addressLine1,  setAddressLine1]  = useState('14 Station Road')
  const [addressLine2,  setAddressLine2]  = useState('')
  const [city,          setCity]          = useState('Birmingham')
  const [county,        setCounty]        = useState('West Midlands')
  const [postcode,      setPostcode]      = useState(order?.postcode ?? '')
  const [country,       setCountry]       = useState(order?.countryCode ?? 'GB')
  const [what3words,    setWhat3words]    = useState('///tables.chair.lamp')
  const [taxId,         setTaxId]         = useState('')
  const [eoriId,        setEoriId]        = useState('')
  const [ukimsNumber,   setUkimsNumber]   = useState('')

  const M = font.family

  if (!order) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textMuted, fontFamily: M }}>
        Order not found.
      </div>
    )
  }

  const channelData = CHANNEL_FALLBACKS[order.channel as SalesChannel]

  const subtotal = items.reduce((acc, i) => {
    const n = parseFloat(i.price.replace('£', ''))
    return acc + (isNaN(n) ? 0 : n * i.qty)
  }, 0)

  const activities = getMockActivities()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>

        {/* Left: back + title + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => router.push('/orders')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px', borderRadius: 99,
              background: 'transparent', border: `1px solid ${colors.borderMint}`,
              color: colors.textPrimary, fontSize: font.size.xs, fontWeight: font.weight.semibold,
              fontFamily: M, cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${colors.mint}12`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke={colors.mint} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Channel logo */}
            {channelData?.logoUrl && (
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: colors.cardBg,
                border: `1px solid ${colors.borderMint}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={channelData.logoUrl}
                  alt={channelData.displayName}
                  style={{ height: 24, width: 'auto', maxWidth: 32, objectFit: 'contain' }}
                />
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{
                  margin: 0, fontSize: font.size['2xl'], fontWeight: font.weight.extrabold,
                  color: colors.textPrimary, fontFamily: M, lineHeight: 1,
                }}>
                  Order {order.orderNumber}
                </h1>
                <StatusBadge status={order.status} />
              </div>
              <span style={{ fontSize: font.size.sm, color: colors.textSecondary, fontFamily: M, marginTop: 3, display: 'block' }}>
                {order.channelStoreName} · {order.createdAt}
              </span>
            </div>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => router.push('/orders')}
            style={{
              padding: '8px 20px', borderRadius: 99,
              background: 'transparent', border: `1px solid ${colors.borderMint}`,
              color: colors.textPrimary, fontSize: font.size.xs, fontWeight: font.weight.semibold,
              fontFamily: M, cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${colors.mint}12`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Cancel
          </button>
          <button style={{
            padding: '8px 24px', borderRadius: 99,
            background: colors.mint, border: 'none',
            color: '#0A0B1E', fontSize: font.size.xs, fontWeight: font.weight.extrabold,
            fontFamily: M, cursor: 'pointer', transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ── 25 / 50 / 25 three-column layout ───────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        gap: 16,
        alignItems: 'start',
      }}>

        {/* ── Left 25%: Customer Info + Order Summary ──────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <Card>
            <CardTitle>Customer</CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <FieldRow label="Full Name"  value={customerName}  editable onChange={setCustomerName} />
              <FieldRow label="Email"      value={customerEmail} editable onChange={setCustomerEmail} />
              <FieldRow label="Phone"      value={customerPhone} editable onChange={setCustomerPhone} />
            </div>
          </Card>

          <Card>
            <CardTitle>Order Summary</CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {order.externalOrderId && (
                <FieldRow label="Channel ID"   value={order.externalOrderId} mono />
              )}
              <FieldRow label="Channel"        value={order.channelStoreName} />
              <FieldRow label="Delivery"       value={order.deliveryService} />
              <FieldRow label="Date Created"   value={order.createdAt} />
              {order.tags.length > 0 && (
                <FieldRow label="Tags"         value={order.tags.map(t => t.label).join(', ')} />
              )}
            </div>
          </Card>
        </div>

        {/* ── Middle 50%: Address + Items ──────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <Card>
            <CardTitle>Shipping Address</CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <FieldRow label="Address Line 1"  value={addressLine1}  editable onChange={setAddressLine1} />
              <FieldRow label="Address Line 2"  value={addressLine2}  editable onChange={setAddressLine2} />
              <FieldRow label="City"            value={city}          editable onChange={setCity} />
              <FieldRow label="County"          value={county}        editable onChange={setCounty} />
              <FieldRow label="Postcode"        value={postcode}      editable onChange={setPostcode} />
              <FieldRow label="Country"         value={country}       editable onChange={setCountry} />
              <FieldRow label="What3Words"      value={what3words}    editable onChange={setWhat3words} mono />
            </div>
          </Card>

          <Card>
            <CardTitle>Tax &amp; Compliance</CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <FieldRow label="Tax ID"     value={taxId}       editable onChange={setTaxId}       mono />
              <FieldRow label="EORI ID"    value={eoriId}      editable onChange={setEoriId}      mono />
              <FieldRow label="UKIMS No."  value={ukimsNumber} editable onChange={setUkimsNumber} mono />
            </div>
          </Card>

          <Card style={{ padding: '18px 20px' }}>
            <CardTitle>Items</CardTitle>
            <ItemsTable
              items={items}
              onAddProduct={() => setItems(prev => [...prev, {
                id: `new-${Date.now()}`,
                product: 'New Product',
                sku: 'NEW-SKU',
                qty: 1,
                price: '£0.00',
              }])}
            />
            {/* Totals */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end',
              marginTop: 12, paddingTop: 12,
              borderTop: '1px solid rgba(253,255,255,0.08)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                  <span style={{ fontSize: '12px', color: 'rgba(253,255,255,0.45)', fontFamily: M }}>Subtotal</span>
                  <span style={{ fontSize: '13px', fontWeight: font.weight.semibold, color: '#FDFFFF', fontFamily: M }}>
                    £{subtotal.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                  <span style={{ fontSize: '12px', color: 'rgba(253,255,255,0.45)', fontFamily: M }}>Shipping</span>
                  <span style={{ fontSize: '13px', fontWeight: font.weight.semibold, color: '#FDFFFF', fontFamily: M }}>£4.99</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', gap: 24,
                  paddingTop: 8, borderTop: '1px solid rgba(253,255,255,0.12)',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: font.weight.extrabold, color: '#FDFFFF', fontFamily: M }}>Total</span>
                  <span style={{ fontSize: '14px', fontWeight: font.weight.extrabold, color: colors.mint, fontFamily: M }}>
                    £{(subtotal + 4.99).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Right 25%: Activity Log ──────────────────────────────── */}
        <Card>
          <CardTitle>Activity Log</CardTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activities.map(a => <ActivityEntry key={a.id} activity={a} />)}
          </div>

          <div style={{ marginTop: 16 }}>
            <span style={{
              fontSize: '10px', fontWeight: font.weight.bold,
              color: 'rgba(253,255,255,0.35)', fontFamily: M,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', marginBottom: 8,
            }}>
              Add Note
            </span>
            <textarea
              value={activityNote}
              onChange={e => setActivityNote(e.target.value)}
              placeholder="Type a note..."
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(253,255,255,0.05)',
                border: '1px solid rgba(253,255,255,0.10)',
                borderRadius: 10, padding: '10px 12px',
                color: '#FDFFFF', fontFamily: M, fontSize: '12px',
                fontWeight: font.weight.semibold,
                resize: 'vertical', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = colors.mint)}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(253,255,255,0.10)')}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                disabled={!activityNote.trim()}
                style={{
                  padding: '6px 16px', borderRadius: 99,
                  background: activityNote.trim() ? colors.mint : 'rgba(29,251,157,0.18)',
                  border: 'none', cursor: activityNote.trim() ? 'pointer' : 'not-allowed',
                  color: '#0A0B1E', fontSize: '11px', fontWeight: font.weight.extrabold,
                  fontFamily: M, transition: 'all 0.15s',
                }}
                onClick={() => setActivityNote('')}
              >
                Post Note
              </button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
