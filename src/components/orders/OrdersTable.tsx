'use client'

import { useState } from 'react'
import {
  Layers, Tag, Merge, FileText, Copy, Trash2,
  Upload, Download, ChevronDown, Bookmark, Filter,
  ChevronsUpDown, MoreVertical, Printer, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { Order } from '@/types/order'
import { StatusDot } from './StatusDot'
import { TagPill } from './TagPill'
import { ChannelBadge } from './ChannelBadge'

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
      className="flex items-center gap-1.5 px-3 h-8 rounded-full text-sm font-medium transition-colors shrink-0"
      style={{
        background: active ? 'rgba(0,200,83,0.12)' : '#1C1E35',
        border: `1px solid ${active ? '#00C853' : '#2A2D4A'}`,
        color: active ? '#00C853' : '#FFFFFF',
        fontSize: '12px',
      }}
    >
      {label}
      <ChevronDown size={12} style={{ color: active ? '#00C853' : '#9AA0BC' }} />
    </button>
  )
}

// ── Action icon button ───────────────────────────────────────────────────────
function ActionBtn({
  icon: Icon,
  label,
  danger = false,
}: {
  icon: React.ElementType
  label: string
  danger?: boolean
}) {
  return (
    <button
      className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors hover:bg-white/10"
      style={{ minWidth: 44 }}
    >
      <Icon size={16} style={{ color: danger ? '#E91E8C' : '#9AA0BC' }} strokeWidth={1.8} />
      <span style={{ fontSize: '9px', color: danger ? '#E91E8C' : '#9AA0BC', fontWeight: 600 }}>
        {label}
      </span>
    </button>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export function OrdersTable({
  orders,
  total,
}: {
  orders: Order[]
  total: number
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
          <h1 className="text-xl font-bold" style={{ color: '#00C853' }}>Orders</h1>
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
            style={{ background: '#00C853', color: '#000' }}
          >
            {total}
          </span>
          <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors">
            <Printer size={16} style={{ color: '#9AA0BC' }} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 h-8 rounded-full text-sm font-semibold"
            style={{ border: '1px solid #2A2D4A', background: '#1C1E35', color: '#fff', fontSize: '12px' }}
          >
            <Upload size={13} /> Import Orders <ChevronDown size={12} style={{ color: '#9AA0BC' }} />
          </button>
          <button
            className="flex items-center gap-2 px-3 h-8 rounded-full text-sm font-semibold"
            style={{ border: '1px solid #2A2D4A', background: '#1C1E35', color: '#fff', fontSize: '12px' }}
          >
            <Download size={13} /> Export Orders <ChevronDown size={12} style={{ color: '#9AA0BC' }} />
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
          style={{ border: '1px solid #2A2D4A', background: '#1C1E35' }}
        >
          <Bookmark size={14} style={{ color: '#9AA0BC' }} />
        </button>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/10"
          style={{ border: '1px solid #2A2D4A', background: '#1C1E35' }}
        >
          <Filter size={14} style={{ color: '#9AA0BC' }} />
        </button>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
          style={{
            border: `1px solid ${showExtraFilters ? '#00C853' : '#2A2D4A'}`,
            background: showExtraFilters ? 'rgba(0,200,83,0.12)' : '#1C1E35',
          }}
          onClick={() => setShowExtraFilters((v) => !v)}
        >
          <ChevronsUpDown size={14} style={{ color: showExtraFilters ? '#00C853' : '#9AA0BC' }} />
        </button>

        {/* Bulk actions */}
        <div className="flex items-center ml-auto" style={{ borderLeft: '1px solid #2A2D4A', paddingLeft: 8 }}>
          <ActionBtn icon={Layers}   label="Batch"   />
          <ActionBtn icon={Tag}      label="Tag"     />
          <ActionBtn icon={Merge}    label="Merge"   />
          <ActionBtn icon={FileText} label="Invoice" />
          <ActionBtn icon={Copy}     label="Copy"    />
          <ActionBtn icon={Trash2}   label="Delete"  danger />
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
        style={{ border: '1px solid #2A2D4A' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            {/* Header */}
            <thead>
              <tr style={{ background: '#14162A' }}>
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded accent-green-500"
                    style={{ accentColor: '#00C853' }}
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
                    style={{ fontSize: '11px', color: '#9AA0BC', letterSpacing: '0.04em' }}
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
                        ? 'rgba(0,200,83,0.06)'
                        : i % 2 === 0
                        ? '#0A0B1E'
                        : '#0D0F23',
                      borderBottom: '1px solid #1C1E35',
                    }}
                    onClick={() => toggleRow(order.id)}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(order.id)}
                        style={{ accentColor: '#00C853', width: 14, height: 14 }}
                      />
                    </td>

                    {/* Status dot */}
                    <td className="py-3 px-3">
                      <StatusDot status={order.status} />
                    </td>

                    {/* Tags */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {order.tags.map((tag) => (
                          <TagPill key={tag.id} tag={tag} />
                        ))}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span style={{ fontSize: '12px', color: '#FFFFFF' }}>{order.createdAt}</span>
                    </td>

                    {/* Channel */}
                    <td className="py-3 px-3">
                      <ChannelBadge channel={order.channel} storeName={order.channelStoreName} />
                    </td>

                    {/* Order number */}
                    <td className="py-3 px-3">
                      <span
                        className="font-semibold"
                        style={{ fontSize: '12px', color: '#7B2FBE', cursor: 'pointer' }}
                      >
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Service */}
                    <td className="py-3 px-3">
                      <span style={{ fontSize: '12px', color: '#FFFFFF' }}>{order.deliveryService}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span style={{ fontSize: '12px', color: '#FFFFFF' }}>{order.customerName}</span>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-0.5">
                        {order.sku.map((s) => (
                          <span key={s} style={{ fontSize: '11px', color: '#00BCD4' }}>{s}</span>
                        ))}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-3">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-black"
                        style={{ background: '#00C853', fontSize: '11px' }}
                      >
                        {order.itemCount}
                      </span>
                    </td>

                    {/* ISO */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col items-center">
                        <span style={{ fontSize: '16px' }}>{order.countryFlag}</span>
                        <span style={{ fontSize: '9px', color: '#9AA0BC' }}>{order.countryCode}</span>
                      </div>
                    </td>

                    {/* Postcode */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span style={{ fontSize: '12px', color: '#FFFFFF' }}>{order.postcode}</span>
                    </td>

                    {/* Row actions */}
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                        style={{ border: '1px solid #2A2D4A' }}
                      >
                        <MoreVertical size={13} style={{ color: '#9AA0BC' }} />
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
              background: perPage === n ? '#00C853' : '#1C1E35',
              color: perPage === n ? '#000' : '#FFFFFF',
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
            style={{ background: '#00C853', color: '#000' }}
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
