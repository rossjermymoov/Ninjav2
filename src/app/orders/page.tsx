import { OrdersTable } from '@/components/orders/OrdersTable'
import { MOCK_ORDERS, MOCK_TOTAL_ORDERS } from '@/lib/mock/orders'

export default function OrdersPage() {
  return <OrdersTable orders={MOCK_ORDERS} total={MOCK_TOTAL_ORDERS} />
}
