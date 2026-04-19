export type OrderStatus = 'ready' | 'processing' | 'issue' | 'validation_error' | 'error'

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
  externalOrderId?: string     // channel's own order reference (e.g. 12-digit eBay/Shopify ID)
  deliveryService: string
  customerName: string
  sku: string[]
  itemCount: number
  countryCode: string
  countryFlag: string
  postcode: string
  validationError?: string     // populated when status === 'validation_error'
  processingError?: string     // populated when status === 'error'
}
