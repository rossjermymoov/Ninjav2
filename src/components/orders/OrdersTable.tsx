'use client'

import { useState } from 'react'
import {
  MoreVertical, Printer, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Order, SalesChannel } from '@/types/order'
import { StatusDot } from './StatusDot'
import { TagPill } from './TagPill'
import { ChannelBadge } from './ChannelBadge'
import type { ChannelData } from '@/lib/channels'
import { CHANNEL_FALLBACKS } from '@/lib/channels'

// ── Figma chevron (V-shape, mint) ────────────────────────────────────────────
function ChevronV({ size = 10 }: { size?: number }) {
  return (
    <svg width={size + 2} height={size} viewBox="0 0 12 8" fill="none">
      <path d="M1 1L6 7L11 1" stroke="#1DFB9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Filter pill ──────────────────────────────────────────────────────────────
function FilterPill({
  label,
  active = false,
}: {
  label: string
  active?: boolean
}) {
  return (
    <button
      className="flex items-center gap-1.5 px-3 h-[35px] rounded-full text-sm font-medium transition-colors shrink-0"
      style={{
        background: '#171B2D',
        border: `1px solid ${active ? '#1DFB9D' : '#1A745A'}`,
        color: '#FFFFFF',
        fontSize: '12px',
      }}
    >
      {label}
      <ChevronV />
    </button>
  )
}

// ── Figma bookmark icon (filled mint flag shape) ──────────────────────────────
function IconBookmark() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M0 18.5V1H16V18.5L8.5 12.7L0 18.5Z" fill="#1DFB9D"/>
    </svg>
  )
}

// ── Figma funnel-X icon (muted green) ────────────────────────────────────────
function IconFunnelX() {
  return (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M11.8 12.43C11.55 12.67 11.41 13 11.41 13.35V19.41L7.49 22.98V13.36C7.49 13.01 7.34 12.68 7.09 12.44C5.79 11.22 1.7 7.37 0.41 6.15C0.15 5.92 0.01 5.58 0.01 5.24C0 4.19 0 2 0 2H18.88C18.88 2 18.88 4.17 18.89 5.21C18.89 5.56 18.75 5.89 18.49 6.13C17.2 7.35 13.1 11.21 11.8 12.43ZM8.38 6.78L6.73 8.43C6.43 8.72 6.43 9.2 6.73 9.5C7.03 9.8 7.51 9.8 7.8 9.5L9.45 7.86L11.1 9.5C11.39 9.8 11.87 9.8 12.17 9.5C12.47 9.2 12.47 8.72 12.17 8.43L10.52 6.78L12.17 5.14C12.47 4.84 12.47 4.36 12.17 4.07C11.87 3.77 11.39 3.77 11.1 4.07L9.45 5.71L7.8 4.07C7.51 3.77 7.03 3.77 6.73 4.07C6.43 4.36 6.43 4.84 6.73 5.14L8.38 6.78Z"
        fill="#1A745A"/>
    </svg>
  )
}

// ── Figma chevron-circle icon (mint V) ────────────────────────────────────────
function IconChevronCircle() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path d="M1 1L7 9L13 1" stroke="#1DFB9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Bulk action icons (from Figma) ────────────────────────────────────────────
function IconBatch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="7" width="16" height="10" rx="3" fill="#1A745A"/>
      <rect x="0.5" y="9" width="3" height="2.5" rx="1.25" fill="#1A745A"/>
      <rect x="16.5" y="9" width="3" height="2.5" rx="1.25" fill="#1A745A"/>
      <rect x="6" y="3.5" width="8" height="4" rx="1.5" fill="#1A745A" opacity="0.75"/>
    </svg>
  )
}

function IconTag() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M1.5 1.5H9.5L18.5 10.5L11 18L2 9V1.5Z" fill="#1A745A"/>
      <circle cx="6" cy="6" r="1.8" fill="#171B2D"/>
    </svg>
  )
}

function IconMerge() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <circle cx="7.5" cy="8" r="6.5" fill="#1A745A"/>
      <circle cx="14.5" cy="8" r="6.5" fill="#1A745A"/>
    </svg>
  )
}

function IconInvoice() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <rect x="1" y="1" width="14" height="18" rx="2" fill="#1A745A"/>
      <rect x="4" y="6" width="8" height="1.5" rx="0.75" fill="#0D2B1F"/>
      <rect x="4" y="9.5" width="8" height="1.5" rx="0.75" fill="#0D2B1F"/>
      <rect x="4" y="13" width="5" height="1.5" rx="0.75" fill="#0D2B1F"/>
    </svg>
  )
}

function IconActionCopy() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <rect x="5.5" y="5.5" width="11" height="13" rx="2" stroke="#1DFB9D" strokeWidth="1.5"/>
      <path d="M2.5 14V2H13" stroke="#1DFB9D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconActionDelete() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M0.5 4.5H15.5" stroke="#1DFB9D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5.5 1.5H10.5" stroke="#1DFB9D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12.5 4.5L11.5 17.5H4.5L3.5 4.5H12.5Z" stroke="#1DFB9D" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M6.5 8V14M9.5 8V14" stroke="#1DFB9D" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

// ── Action icon button ───────────────────────────────────────────────────────
function ActionBtn({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors hover:bg-white/10"
      style={{ minWidth: 44 }}
    >
      {icon}
      <span style={{ fontSize: '9px', color: '#9AA0BC', fontWeight: 600 }}>
        {label}
      </span>
    </button>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export function OrdersTable({
  orders,
  total,
  channelMap = {},
}: {
  orders: Order[]
  total: number
  channelMap?: Record<string, ChannelData>
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [allSelected, setAllSelected] = useState(false)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [showExtraFilters, setShowExtraFilters] = useState(false)

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set())
      setAllSelected(false)
    } else {
      setSelected(new Set(orders.map((o) => o.id)))
      setAllSelected(true)
    }
  }

  const toggleRow = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) { next.delete(id) } else { next.add(id) }
    setSelected(next)
    setAllSelected(next.size === orders.length)
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="flex flex-col gap-3">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold" style={{ color: '#1DFB9D' }}>Orders</h1>
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
            style={{ background: '#1DFB9D', color: '#0A0B1E' }}
          >
            {total}
          </span>
          <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors">
            <Printer size={16} style={{ color: '#9AA0BC' }} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 h-[35px] rounded-full font-semibold shrink-0"
            style={{ border: '1px solid #1DFB9D', background: '#171B2D', color: '#fff', fontSize: '12px' }}
          >
            Import Orders <ChevronV />
          </button>
          <button
            className="flex items-center gap-2 px-4 h-[35px] rounded-full font-semibold shrink-0"
            style={{ border: '1px solid #1DFB9D', background: '#171B2D', color: '#fff', fontSize: '12px' }}
          >
            Export Orders <ChevronV />
          </button>
        </div>
      </div>

      {/* ── Filter bar row 1 ────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterPill label="Favourite Filters" />
        <FilterPill label="Date Range" />
        <FilterPill label="Sales Channel" />
        <FilterPill label="Delivery Service" />
        <FilterPill label="Sort Orders" />
        <FilterPill label="Tags" />

        {/* Icon filters */}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/10"
          style={{ border: '1px solid #1A745A', background: '#171B2D' }}
        >
          <IconBookmark />
        </button>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/10"
          style={{ border: '1px solid #1A745A', background: '#171B2D' }}
        >
          <IconFunnelX />
        </button>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
          style={{
            border: `1px solid ${showExtraFilters ? '#1DFB9D' : '#1A745A'}`,
            background: showExtraFilters ? 'rgba(29,251,157,0.10)' : '#171B2D',
          }}
          onClick={() => setShowExtraFilters((v) => !v)}
        >
          <IconChevronCircle />
        </button>

        {/* Bulk actions */}
        <div className="flex items-center ml-auto" style={{ borderLeft: '1px solid #2A2D4A', paddingLeft: 8 }}>
          <ActionBtn icon={<IconBatch />}        label="Batch"   />
          <ActionBtn icon={<IconTag />}          label="Tag"     />
          <ActionBtn icon={<IconMerge />}        label="Merge"   />
          <ActionBtn icon={<IconInvoice />}      label="Invoice" />
          <ActionBtn icon={<IconActionCopy />}   label="Copy"    />
          <ActionBtn icon={<IconActionDelete />} label="Delete"  />
        </div>
      </div>

      {/* ── Filter bar row 2 (expandable) ───────────────────────── */}
      {showExtraFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <FilterPill label="SKU" />
          <FilterPill label="Destination" />
          <FilterPill label="Order Type" />
          <FilterPill label="Item Quantity" />
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid #DFE0EB' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            {/* Header */}
            <thead>
              <tr style={{ background: '#171B2D' }}>
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded"
                    style={{ accentColor: '#1DFB9D' }}
                  />
                </th>
                {[
                  'Status', 'Tags', 'Date & Time', 'Channel',
                  'Order No.', 'Service', 'Customer', 'SKU',
                  'Items', 'ISO', 'Postcode', '',
                ].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-3 text-left font-semibold whitespace-nowrap"
                    style={{ fontSize: '11px', color: '#FFFFFF', letterSpacing: '0.04em' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {orders.map((order, i) => {
                const isSelected = selected.has(order.id)
                return (
                  <tr
                    key={order.id}
                    className="mn-row transition-colors cursor-pointer"
                    style={{
                      background: isSelected
                        ? 'rgba(29,251,157,0.07)'
                        : '#FDFFFF',
                      borderBottom: '1px solid #DFE0EB',
                      height: 50,
                    }}
                    onClick={() => toggleRow(order.id)}
                  >
                    {/* Checkbox */}
                    <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(order.id)}
                        style={{ accentColor: '#1DFB9D', width: 14, height: 14 }}
                      />
                    </td>

                    {/* Status dot */}
                    <td className="py-2 px-3">
                      <StatusDot status={order.status} />
                    </td>

                    {/* Tags */}
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1">
                        {order.tags.map((tag) => (
                          <TagPill key={tag.id} tag={tag} />
                        ))}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span style={{ fontSize: '12px', color: '#171B2D' }}>{order.createdAt}</span>
                    </td>

                    {/* Channel */}
                    <td className="py-2 px-3">
                      <ChannelBadge
                        storeName={order.channelStoreName}
                        channel={channelMap[order.channel] ?? CHANNEL_FALLBACKS[order.channel as SalesChannel]}
                      />
                    </td>

                    {/* Order number */}
                    <td className="py-2 px-3">
                      <span
                        className="font-semibold"
                        style={{ fontSize: '12px', color: '#6F4B9F', cursor: 'pointer' }}
                      >
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Service */}
                    <td className="py-2 px-3">
                      <span style={{ fontSize: '12px', color: '#171B2D' }}>{order.deliveryService}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span style={{ fontSize: '12px', color: '#171B2D' }}>{order.customerName}</span>
                    </td>

                    {/* SKU */}
                    <td className="py-2 px-3">
                      <div className="flex flex-col gap-0.5">
                        {order.sku.map((s) => (
                          <span key={s} style={{ fontSize: '11px', color: '#276E93' }}>{s}</span>
                        ))}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-2 px-3">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full font-bold"
                        style={{ background: '#1DFB9D', color: '#0A0B1E', fontSize: '11px' }}
                      >
                        {order.itemCount}
                      </span>
                    </td>

                    {/* ISO */}
                    <td className="py-2 px-3">
                      <div className="flex flex-col items-center">
                        <span style={{ fontSize: '16px' }}>{order.countryFlag}</span>
                        <span style={{ fontSize: '9px', color: '#6B7280' }}>{order.countryCode}</span>
                      </div>
                    </td>

                    {/* Postcode */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span style={{ fontSize: '12px', color: '#171B2D' }}>{order.postcode}</span>
                    </td>

                    {/* Row actions */}
                    <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:opacity-80"
                        style={{ border: '1px solid #1DFB9D', background: '#171B2D' }}
                      >
                        <MoreVertical size={13} style={{ color: '#1DFB9D' }} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Per page selector */}
        <button
          className="flex items-center gap-2 px-3 h-8 rounded-full text-sm"
          style={{ background: '#1C1E35', border: '1px solid #2A2D4A', color: '#FFFFFF', fontSize: '12px' }}
        >
          <span className="text-xs">⊞</span> Orders per page
        </button>
        {[10, 50, 100].map((n) => (
          <button
            key={n}
            onClick={() => setPerPage(n)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors"
            style={{
              background: perPage === n ? '#1DFB9D' : '#1C1E35',
              color: perPage === n ? '#0A0B1E' : '#FFFFFF',
              border: perPage === n ? 'none' : '1px solid #2A2D4A',
              fontSize: '12px',
            }}
          >
            {n}
          </button>
        ))}

        {/* Page navigation */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-30"
            style={{ border: '1px solid #2A2D4A' }}
          >
            <ChevronLeft size={14} style={{ color: '#FFFFFF' }} />
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm"
            style={{ background: '#1DFB9D', color: '#0A0B1E' }}
          >
            {page}
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10 disabled:opacity-30"
            style={{ border: '1px solid #2A2D4A' }}
          >
            <ChevronRight size={14} style={{ color: '#FFFFFF' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
