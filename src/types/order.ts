export type OrderStatus = 'ready' | 'processing' | 'issue'

export type SalesChannel =
  | 'tiktok'
  | 'shopify'
  | 'amazon'
  | 'etsy'
  | 'woocommerce'
  | 'ebay'
  | 'manual'

export interface OrderTag {
  id: string
  label: string
  colour: 'green' | 'purple' | 'amber' | 'teal'
}

export interface Order {
  id: string
  status: OrderStatus
  tags: OrderTag[]
  createdAt: string
  channel: SalesChannel
  channelStoreName: string
  orderNumber: string
  deliveryService: string
  customerName: string
  sku: string[]
  itemCount: number
  countryCode: string
  countryFlag: string
  postcode: string
}
