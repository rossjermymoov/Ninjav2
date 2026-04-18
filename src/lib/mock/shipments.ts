// ─── Tracking event types ─────────────────────────────────────────────────────

export type TrackingEventType =
  | 'booked'
  | 'collected'
  | 'in_transit_to_depot'
  | 'at_collection_depot'
  | 'in_transit_to_hub'
  | 'at_hub'
  | 'in_transit_to_receiving'
  | 'at_receiving_depot'
  | 'out_for_delivery'
  | 'delivered'
  // Problem states — shown in red
  | 'on_hold'
  | 'address_issue'
  | 'customs_hold'
  | 'returned_to_sender'

export interface TrackingEvent {
  type: TrackingEventType
  timestamp: string
  location?: string
}

// ─── Shipment type ────────────────────────────────────────────────────────────

export interface Shipment {
  id: string
  orderNumber: string
  customerName: string
  postcode: string
  country: string
  countryFlag: string
  carrier: string
  trackingNumbers: string[]    // array — >1 means multi-parcel
  service: string
  bookedAt: string             // when the label was created
  estimatedDelivery?: string   // SLA-based estimate
  trackingEvents: TrackingEvent[]
  currentEvent: TrackingEventType
  weight: string
  items: number
}

// ─── Ordered newest-first ─────────────────────────────────────────────────────

export const MOCK_SHIPMENTS: Shipment[] = [
  // ── s9: just booked, multi-parcel ──
  {
    id: 's9',
    orderNumber: '#5643',
    customerName: 'Mia Roberts',
    postcode: 'W1A 1AA',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'DPD',
    trackingNumbers: ['DPD99182736450', 'DPD99182736451', 'DPD99182736452'],
    service: 'Next Day',
    bookedAt: '2024-03-15 17:30',
    estimatedDelivery: '2024-03-16',
    trackingEvents: [
      { type: 'booked', timestamp: '2024-03-15 17:30' },
    ],
    currentEvent: 'booked',
    weight: '4.80 kg',
    items: 6,
  },
  // ── s8: booked, awaiting collection ──
  {
    id: 's8',
    orderNumber: '#5501',
    customerName: 'Lucy Brennan',
    postcode: 'CF10 1EP',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'DPD',
    trackingNumbers: ['DPD38291047563'],
    service: 'Saturday',
    bookedAt: '2024-03-15 16:00',
    estimatedDelivery: '2024-03-16',
    trackingEvents: [
      { type: 'booked', timestamp: '2024-03-15 16:00' },
    ],
    currentEvent: 'booked',
    weight: '3.20 kg',
    items: 5,
  },
  // ── s5: processing → booked label ──
  {
    id: 's5',
    orderNumber: '#5102',
    customerName: 'James Hollis',
    postcode: 'M1 1AE',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'DPD',
    trackingNumbers: ['DPD25748391022'],
    service: 'Next Day',
    bookedAt: '2024-03-15 14:15',
    estimatedDelivery: '2024-03-16',
    trackingEvents: [
      { type: 'booked', timestamp: '2024-03-15 14:15' },
    ],
    currentEvent: 'booked',
    weight: '0.80 kg',
    items: 2,
  },
  // ── s6: in transit, multi-parcel ──
  {
    id: 's6',
    orderNumber: '#5287',
    customerName: 'Priya Sharma',
    postcode: 'BS1 4DJ',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'Evri',
    trackingNumbers: ['H00BB98765432', 'H00BB98765433'],
    service: '48hr',
    bookedAt: '2024-03-15 13:00',
    estimatedDelivery: '2024-03-17',
    trackingEvents: [
      { type: 'booked',             timestamp: '2024-03-15 13:00' },
      { type: 'collected',          timestamp: '2024-03-15 16:45', location: 'Bristol Evri Drop-off' },
      { type: 'in_transit_to_depot',timestamp: '2024-03-15 19:00' },
      { type: 'at_collection_depot',timestamp: '2024-03-15 23:30', location: 'Bristol Depot' },
      { type: 'in_transit_to_hub',  timestamp: '2024-03-16 03:00' },
    ],
    currentEvent: 'in_transit_to_hub',
    weight: '1.50 kg',
    items: 4,
  },
  // ── s2: dispatched / collected ──
  {
    id: 's2',
    orderNumber: '#4836',
    customerName: 'Arthur Goth',
    postcode: 'DH2 1LP',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'Evri',
    trackingNumbers: ['H00AA12345678'],
    service: '48hr',
    bookedAt: '2024-03-15 11:45',
    estimatedDelivery: '2024-03-17',
    trackingEvents: [
      { type: 'booked',              timestamp: '2024-03-15 11:45' },
      { type: 'collected',           timestamp: '2024-03-15 15:30', location: 'Durham Evri Drop-off' },
      { type: 'in_transit_to_depot', timestamp: '2024-03-15 18:00' },
    ],
    currentEvent: 'in_transit_to_depot',
    weight: '1.20 kg',
    items: 2,
  },
  // ── s1: in transit heading to hub ──
  {
    id: 's1',
    orderNumber: '#1012',
    customerName: 'Gary Fisher',
    postcode: 'SY7 9GH',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'Royal Mail',
    trackingNumbers: ['RM123456789GB'],
    service: '24hr Tracked',
    bookedAt: '2024-03-15 10:30',
    estimatedDelivery: '2024-03-16',
    trackingEvents: [
      { type: 'booked',              timestamp: '2024-03-15 10:30' },
      { type: 'collected',           timestamp: '2024-03-15 14:00', location: 'Shrewsbury Mail Centre' },
      { type: 'in_transit_to_depot', timestamp: '2024-03-15 16:30' },
      { type: 'at_collection_depot', timestamp: '2024-03-15 20:00', location: 'Shrewsbury MC' },
      { type: 'in_transit_to_hub',   timestamp: '2024-03-16 01:00' },
      { type: 'at_hub',              timestamp: '2024-03-16 04:30', location: 'Northampton National DC' },
      { type: 'in_transit_to_receiving', timestamp: '2024-03-16 07:00' },
    ],
    currentEvent: 'in_transit_to_receiving',
    weight: '0.45 kg',
    items: 1,
  },
  // ── s3: on hold (problem) ──
  {
    id: 's3',
    orderNumber: '#4873',
    customerName: 'Alex Kassan',
    postcode: 'LE2 9PL',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'DPD',
    trackingNumbers: ['DPD15935742013'],
    service: 'Next Day',
    bookedAt: '2024-03-14 15:20',
    estimatedDelivery: '2024-03-15',
    trackingEvents: [
      { type: 'booked',              timestamp: '2024-03-14 15:20' },
      { type: 'collected',           timestamp: '2024-03-14 18:00', location: 'Leicester DPD' },
      { type: 'in_transit_to_depot', timestamp: '2024-03-14 20:00' },
      { type: 'at_collection_depot', timestamp: '2024-03-14 23:15', location: 'Leicester Depot' },
      { type: 'in_transit_to_hub',   timestamp: '2024-03-15 02:00' },
      { type: 'at_hub',              timestamp: '2024-03-15 05:30', location: 'DPD Hub Hinckley' },
      { type: 'on_hold',             timestamp: '2024-03-15 08:00', location: 'DPD Hub Hinckley' },
    ],
    currentEvent: 'on_hold',
    weight: '2.10 kg',
    items: 3,
  },
  // ── s10: address issue ──
  {
    id: 's10',
    orderNumber: '#4791',
    customerName: 'Omar Khalid',
    postcode: 'B1 1BB',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'Royal Mail',
    trackingNumbers: ['RM554433221GB'],
    service: '48hr Tracked',
    bookedAt: '2024-03-14 12:00',
    estimatedDelivery: '2024-03-16',
    trackingEvents: [
      { type: 'booked',              timestamp: '2024-03-14 12:00' },
      { type: 'collected',           timestamp: '2024-03-14 15:00', location: 'Birmingham MC' },
      { type: 'in_transit_to_depot', timestamp: '2024-03-14 17:00' },
      { type: 'at_collection_depot', timestamp: '2024-03-14 21:00', location: 'Birmingham MC' },
      { type: 'in_transit_to_hub',   timestamp: '2024-03-15 00:00' },
      { type: 'at_hub',              timestamp: '2024-03-15 04:00', location: 'Coventry NDC' },
      { type: 'in_transit_to_receiving', timestamp: '2024-03-15 07:00' },
      { type: 'at_receiving_depot',  timestamp: '2024-03-15 10:00', location: 'Birmingham Delivery Office' },
      { type: 'address_issue',       timestamp: '2024-03-15 12:30', location: 'Birmingham Delivery Office' },
    ],
    currentEvent: 'address_issue',
    weight: '0.90 kg',
    items: 2,
  },
  // ── s7: out for delivery ──
  {
    id: 's7',
    orderNumber: '#5394',
    customerName: 'Tom Whitaker',
    postcode: 'EH1 1YZ',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'Royal Mail',
    trackingNumbers: ['RM112233445GB'],
    service: '24hr Tracked',
    bookedAt: '2024-03-13 16:45',
    estimatedDelivery: '2024-03-14',
    trackingEvents: [
      { type: 'booked',                  timestamp: '2024-03-13 16:45' },
      { type: 'collected',               timestamp: '2024-03-13 20:00', location: 'Edinburgh MC' },
      { type: 'in_transit_to_depot',     timestamp: '2024-03-13 22:00' },
      { type: 'at_collection_depot',     timestamp: '2024-03-14 01:30', location: 'Edinburgh MC' },
      { type: 'in_transit_to_hub',       timestamp: '2024-03-14 03:00' },
      { type: 'at_hub',                  timestamp: '2024-03-14 06:00', location: 'Edinburgh NDC' },
      { type: 'in_transit_to_receiving', timestamp: '2024-03-14 07:30' },
      { type: 'at_receiving_depot',      timestamp: '2024-03-14 09:00', location: 'Edinburgh DO' },
      { type: 'out_for_delivery',        timestamp: '2024-03-14 09:45' },
    ],
    currentEvent: 'out_for_delivery',
    weight: '0.55 kg',
    items: 1,
  },
  // ── s4: delivered ──
  {
    id: 's4',
    orderNumber: '#3391',
    customerName: 'Sarah Chen',
    postcode: 'EC1A 1BB',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    carrier: 'Royal Mail',
    trackingNumbers: ['RM987654321GB'],
    service: '24hr Tracked',
    bookedAt: '2024-03-13 09:10',
    estimatedDelivery: '2024-03-14',
    trackingEvents: [
      { type: 'booked',                  timestamp: '2024-03-13 09:10' },
      { type: 'collected',               timestamp: '2024-03-13 13:00', location: 'London EC1 MC' },
      { type: 'in_transit_to_depot',     timestamp: '2024-03-13 15:00' },
      { type: 'at_collection_depot',     timestamp: '2024-03-13 18:30', location: 'Mount Pleasant MC' },
      { type: 'in_transit_to_hub',       timestamp: '2024-03-13 22:00' },
      { type: 'at_hub',                  timestamp: '2024-03-14 01:00', location: 'Gatwick NDC' },
      { type: 'in_transit_to_receiving', timestamp: '2024-03-14 04:00' },
      { type: 'at_receiving_depot',      timestamp: '2024-03-14 07:00', location: 'London EC1 DO' },
      { type: 'out_for_delivery',        timestamp: '2024-03-14 08:15' },
      { type: 'delivered',               timestamp: '2024-03-14 11:43', location: 'EC1A 1BB' },
    ],
    currentEvent: 'delivered',
    weight: '0.30 kg',
    items: 1,
  },
  // ── s11: customs hold (international) ──
  {
    id: 's11',
    orderNumber: '#3214',
    customerName: 'Pierre Dubois',
    postcode: '75001',
    country: 'France',
    countryFlag: '🇫🇷',
    carrier: 'Royal Mail',
    trackingNumbers: ['RM776655443GB'],
    service: 'International Tracked',
    bookedAt: '2024-03-12 14:00',
    estimatedDelivery: '2024-03-18',
    trackingEvents: [
      { type: 'booked',              timestamp: '2024-03-12 14:00' },
      { type: 'collected',           timestamp: '2024-03-12 17:00', location: 'London WC2 MC' },
      { type: 'in_transit_to_depot', timestamp: '2024-03-12 19:00' },
      { type: 'at_collection_depot', timestamp: '2024-03-12 23:00', location: 'Heathrow IDB' },
      { type: 'customs_hold',        timestamp: '2024-03-13 09:00', location: 'Heathrow IDB' },
    ],
    currentEvent: 'customs_hold',
    weight: '1.10 kg',
    items: 2,
  },
]

export const MOCK_TOTAL_SHIPMENTS = 142
