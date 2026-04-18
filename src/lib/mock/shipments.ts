export type ShipmentStatus = 'ordered' | 'processing' | 'dispatched' | 'in_transit' | 'delivered' | 'issue'

export interface Shipment {
  id: string
  orderNumber: string
  customerName: string
  postcode: string
  countryFlag: string
  carrier: string
  trackingNumber: string
  service: string
  status: ShipmentStatus
  dispatchedAt: string
  estimatedDelivery: string
  weight: string
  items: number
}

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 's1',
    orderNumber: '#1012',
    customerName: 'Gary Fisher',
    postcode: 'SY7 9GH',
    countryFlag: '🇬🇧',
    carrier: 'Royal Mail',
    trackingNumber: 'RM123456789GB',
    service: '24hr Tracked',
    status: 'in_transit',
    dispatchedAt: '2024-03-15 10:30',
    estimatedDelivery: '2024-03-16',
    weight: '0.45 kg',
    items: 1,
  },
  {
    id: 's2',
    orderNumber: '#4836',
    customerName: 'Arthur Goth',
    postcode: 'DH2 1LP',
    countryFlag: '🇬🇧',
    carrier: 'Evri',
    trackingNumber: 'H00AA12345678',
    service: '48hr',
    status: 'dispatched',
    dispatchedAt: '2024-03-15 11:45',
    estimatedDelivery: '2024-03-17',
    weight: '1.20 kg',
    items: 2,
  },
  {
    id: 's3',
    orderNumber: '#4873',
    customerName: 'Alex Kassan',
    postcode: 'LE2 9PL',
    countryFlag: '🇬🇧',
    carrier: 'DPD',
    trackingNumber: 'DPD15935742013',
    service: 'Next Day',
    status: 'issue',
    dispatchedAt: '2024-03-14 15:20',
    estimatedDelivery: '2024-03-15',
    weight: '2.10 kg',
    items: 3,
  },
  {
    id: 's4',
    orderNumber: '#3391',
    customerName: 'Sarah Chen',
    postcode: 'EC1A 1BB',
    countryFlag: '🇬🇧',
    carrier: 'Royal Mail',
    trackingNumber: 'RM987654321GB',
    service: '24hr Tracked',
    status: 'delivered',
    dispatchedAt: '2024-03-13 09:10',
    estimatedDelivery: '2024-03-14',
    weight: '0.30 kg',
    items: 1,
  },
  {
    id: 's5',
    orderNumber: '#5102',
    customerName: 'James Hollis',
    postcode: 'M1 1AE',
    countryFlag: '🇬🇧',
    carrier: 'DPD',
    trackingNumber: 'DPD25748391022',
    service: 'Next Day',
    status: 'processing',
    dispatchedAt: '',
    estimatedDelivery: '2024-03-16',
    weight: '0.80 kg',
    items: 2,
  },
  {
    id: 's6',
    orderNumber: '#5287',
    customerName: 'Priya Sharma',
    postcode: 'BS1 4DJ',
    countryFlag: '🇬🇧',
    carrier: 'Evri',
    trackingNumber: 'H00BB98765432',
    service: '48hr',
    status: 'in_transit',
    dispatchedAt: '2024-03-15 13:00',
    estimatedDelivery: '2024-03-17',
    weight: '1.50 kg',
    items: 4,
  },
  {
    id: 's7',
    orderNumber: '#5394',
    customerName: 'Tom Whitaker',
    postcode: 'EH1 1YZ',
    countryFlag: '🇬🇧',
    carrier: 'Royal Mail',
    trackingNumber: 'RM112233445GB',
    service: '24hr Tracked',
    status: 'delivered',
    dispatchedAt: '2024-03-13 16:45',
    estimatedDelivery: '2024-03-14',
    weight: '0.55 kg',
    items: 1,
  },
  {
    id: 's8',
    orderNumber: '#5501',
    customerName: 'Lucy Brennan',
    postcode: 'CF10 1EP',
    countryFlag: '🇬🇧',
    carrier: 'DPD',
    trackingNumber: 'DPD38291047563',
    service: 'Saturday',
    status: 'ordered',
    dispatchedAt: '',
    estimatedDelivery: '2024-03-16',
    weight: '3.20 kg',
    items: 5,
  },
]

export const MOCK_TOTAL_SHIPMENTS = 142
