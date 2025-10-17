# Orders API Documentation

## Available Server Actions

All functions are located in `lib/actions/orders.ts`

### 1. Create Order (Complete Sale)

```typescript
createOrder(data: CreateOrderData)
```

**Endpoint:** `POST /api/orders`

**Payload:**

```json
{
  "storeId": "uuid",
  "branchId": "uuid",
  "customerName": "John Doe",
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2,
      "price": 29995.0
    }
  ],
  "subtotal": 59990.0,
  "tax": 0.0,
  "discount": 0.0,
  "total": 59990.0,
  "paymentMethod": "CASH"
}
```

**Payment Methods:**

- `CASH`
- `CARD`
- `UPI`

---

### 2. Get Orders by Cashier

```typescript
getOrdersByCashier(cashierId: string)
```

**Endpoint:** `GET /api/orders/cashier/{cashierId}`

---

### 3. Get Order by ID

```typescript
getOrderById(orderId: string)
```

**Endpoint:** `GET /api/orders/{orderId}`

---

### 4. Get Orders by Store

```typescript
getOrdersByStore(storeId: string)
```

**Endpoint:** `GET /api/orders/store/{storeId}`

---

### 5. Get Orders by Date Range

```typescript
getOrdersByDateRange(cashierId: string, startDate: string, endDate: string)
```

**Endpoint:** `GET /api/orders/cashier/{cashierId}/range?startDate={start}&endDate={end}`

**Example:**

```
GET /api/orders/cashier/cashier-uuid/range
  ?startDate=2025-09-01T00:00:00
  &endDate=2025-09-27T23:59:59
```

---

## Type Definitions

```typescript
type OrderItem = {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
  subtotal?: number;
};

type Order = {
  id: string;
  orderNumber?: string;
  storeId: string;
  branchId?: string;
  cashierId: string;
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
};

type CreateOrderData = {
  storeId: string;
  branchId?: string;
  customerId?: string;
  customerName?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod: string;
};
```

---

## POS System Features

The POS component (`components/cashier/POSClient.tsx`) provides:

### Core Features:

1. **Product Search** - Search by name, SKU, or brand
2. **Shopping Cart** - Add/remove items, adjust quantities
3. **Real-time Calculations** - Subtotal, tax, discounts, total
4. **Payment Methods** - Cash, Card, UPI
5. **Customer Info** - Optional customer name
6. **Order Processing** - Complete sales with loading states

### UI Components:

- Grid view of products with images
- Side cart with item management
- Checkout dialog with payment selection
- Loading states and success/error toasts
- Responsive design for various screen sizes

### Key Functions:

```typescript
// Add product to cart
addToCart(product: Product)

// Update item quantity
updateQuantity(productId: string, delta: number)

// Remove item from cart
removeFromCart(productId: string)

// Clear entire cart
clearCart()

// Process order
handleCheckout()
confirmCheckout()
```

---

## Usage in Cashier Page

The main POS page is at `/store/cashier` and requires:

- Authenticated user
- Valid `storeId`
- Optional `branchId`

```tsx
<POSClient storeId={user.storeId} branchId={user.branchId} userId={user.id} />
```

---

## Order Flow

1. **Browse Products** - View all store products in grid
2. **Search/Filter** - Find specific products quickly
3. **Add to Cart** - Click product cards to add
4. **Adjust Quantities** - Use +/- buttons in cart
5. **Enter Customer** - Optional customer name
6. **Select Payment** - Choose CASH/CARD/UPI
7. **Complete Order** - Submit and receive order number
8. **Cart Clears** - Ready for next customer

---

## Notes

- All prices in minor currency units (e.g., 29995 = ₹299.95)
- JWT authentication required for all operations
- Orders are immediately processed and saved
- Success shows order number for reference
- Failed orders show error messages with details
