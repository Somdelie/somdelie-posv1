# Order Creation API - Backend Integration Fix

## Problems Identified

### 1. Payment Type Always Null

`paymentType` was always `null` when creating orders in the backend.

### 2. Customer Always Null

`customer` was always `null` even when customer was selected in POS.

## Root Causes

### Issue 1: Payment Type Mismatch

- **Frontend**: Sending `paymentMethod` (string)
- **Backend**: Expecting `paymentType` (enum: CASH, CARD, UPI)

### Issue 2: Customer Data Structure Mismatch

- **Frontend**: Sending `customerId` (string only)
- **Backend**: Expecting `customer` (full object)

## Backend API Expected Format

Based on your Postman example:

```json
{
  "customer": {
    "id": "0b12ffc1-4741-4b74-9a41-96f0e2f4bdd6",
    "fullName": "Somdelie Ndlovu",
    "email": "somdeliedev@gmail.com",
    "phone": "0603121981",
    "address": "57 jolex road kew"
  },
  "items": [
    {
      "productId": "308e14bc-3d0a-409c-b4c0-8f06d45a2ca6",
      "quantity": 5
    },
    {
      "productId": "983d1ce1-b474-4de6-9ecd-b18a7c8e597a",
      "quantity": 30
    }
  ],
  "paymentType": "CASH"
}
```

## Solutions Applied

### Frontend Changes

#### 1. Updated TypeScript Type Definition

**File**: `lib/actions/orders.ts`

**Before:**

```typescript
export type CreateOrderData = {
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

**After:**

```typescript
export type CreateOrderData = {
  storeId: string;
  branchId?: string;
  customer?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address?: string;
  } | null;
  customerId?: string; // Deprecated: Use customer object instead
  customerName?: string; // Deprecated: Use customer.fullName instead
  items: {
    productId: string;
    quantity: number;
    price?: number; // Optional since backend may calculate from product
  }[];
  subtotal?: number; // Optional: Backend may calculate
  tax?: number;
  discount?: number;
  total?: number; // Optional: Backend may calculate
  paymentMethod?: string; // Keep for display purposes
  paymentType: string; // Required: Maps to backend PaymentType enum (CASH, CARD, UPI)
};
```

#### 2. Updated Order Creation in POS

**File**: `components/cashier/POSClient.tsx`

**Before:**

```typescript
const orderData: CreateOrderData = {
  storeId,
  branchId,
  customerId: customer?.id || undefined,
  customerName: customer?.fullName || customerName || "Walk-in Customer",
  items: cart.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    price: item.product.sellingPrice,
  })),
  subtotal,
  tax,
  discount,
  total,
  paymentMethod,
};
```

**After:**

```typescript
const orderData: CreateOrderData = {
  storeId,
  branchId,
  customer: customer
    ? {
        id: customer.id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      }
    : null,
  items: cart.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
  })),
  paymentType: paymentMethod, // Backend expects paymentType (CASH, CARD, UPI)
};
```

## Key Changes Summary

### ✅ Payment Type

- Now sending `paymentType` instead of `paymentMethod`
- Value matches backend enum: "CASH", "CARD", or "UPI"

### ✅ Customer Object

- Now sending full `customer` object with all fields
- Includes: id, fullName, email, phone, address
- Sends `null` for walk-in customers (no customer selected)

### ✅ Simplified Items

- Removed `price` from items (backend calculates from product)
- Only sending `productId` and `quantity`

### ✅ Removed Redundant Fields

- Removed `customerId` (replaced by customer.id)
- Removed `customerName` (replaced by customer.fullName)
- Removed `subtotal`, `total` (backend calculates these)
- Removed `tax`, `discount` (backend may calculate or apply these)

## Data Flow Comparison

### Before Fix

```
Frontend (POS)
    ↓
{
  customerId: "uuid-string",        ❌ Wrong structure
  customerName: "John Doe",         ❌ Wrong structure
  paymentMethod: "CASH",            ❌ Wrong field name
  items: [
    { productId, quantity, price }  ❌ Price not needed
  ]
}
    ↓
Backend
    ↓
customer = null                     ❌ Not mapped
paymentType = null                  ❌ Not mapped
```

### After Fix

```
Frontend (POS)
    ↓
{
  customer: {                       ✅ Correct structure
    id: "uuid",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "123456789",
    address: "123 Main St"
  },
  paymentType: "CASH",              ✅ Correct field name
  items: [
    { productId, quantity }         ✅ Simplified
  ]
}
    ↓
Backend
    ↓
customer = Customer object          ✅ Mapped correctly
paymentType = PaymentType.CASH      ✅ Mapped correctly
```

## Walk-in Customer Handling

### With Selected Customer

```json
{
  "customer": {
    "id": "customer-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St"
  },
  "items": [...],
  "paymentType": "CASH"
}
```

### Walk-in Customer (No Customer Selected)

```json
{
  "customer": null,
  "items": [...],
  "paymentType": "CASH"
}
```

## Testing Checklist

### Frontend (POS Component)

- [ ] Select customer from dropdown
- [ ] Add items to cart
- [ ] Select payment method (CASH/CARD/UPI)
- [ ] Click checkout
- [ ] Verify order data in Network tab

### Backend Response

- [ ] Customer object is populated (not null)
- [ ] paymentType is set correctly (CASH/CARD/UPI)
- [ ] Order is created successfully
- [ ] Order total is calculated correctly

### Walk-in Orders

- [ ] Leave customer as "Walk-in Customer"
- [ ] Complete order
- [ ] Verify customer is null in backend
- [ ] Order still created successfully

## Network Request Verification

### Open Browser DevTools

1. Go to POS page
2. Open DevTools → Network tab
3. Add items to cart
4. Select customer (or leave as walk-in)
5. Select payment method
6. Click "Complete Order"
7. Find the POST request to `/api/orders`

### Request Payload Should Look Like:

```json
{
  "storeId": "store-uuid",
  "branchId": "branch-uuid",
  "customer": {
    "id": "customer-uuid",
    "fullName": "Somdelie Ndlovu",
    "email": "somdeliedev@gmail.com",
    "phone": "0603121981",
    "address": "57 jolex road kew"
  },
  "items": [
    {
      "productId": "product-uuid-1",
      "quantity": 5
    },
    {
      "productId": "product-uuid-2",
      "quantity": 30
    }
  ],
  "paymentType": "CASH"
}
```

### Response Should Include:

```json
{
  "id": "order-uuid",
  "orderNumber": "ORD-12345",
  "customer": {
    "id": "customer-uuid",
    "fullName": "Somdelie Ndlovu",
    "email": "somdeliedev@gmail.com",
    "phone": "0603121981",
    "address": "57 jolex road kew"
  },
  "paymentType": "CASH",
  "totalAmount": 500.00,
  "status": "COMPLETED",
  "items": [...],
  "createdAt": "2025-10-17T..."
}
```

## Backend Verification

### Check Database

```sql
SELECT
    o.id,
    o.payment_type,
    o.total_amount,
    o.status,
    c.full_name as customer_name,
    c.email as customer_email
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
ORDER BY o.created_at DESC
LIMIT 5;
```

### Expected Result

```
id         | payment_type | total_amount | status    | customer_name    | customer_email
-----------+--------------+--------------+-----------+------------------+------------------
uuid-1     | CASH         | 500.00       | COMPLETED | Somdelie Ndlovu  | somdeliedev@...
uuid-2     | CARD         | 750.00       | COMPLETED | John Doe         | john@...
uuid-3     | CASH         | 100.00       | COMPLETED | NULL             | NULL
```

Note: Row 3 shows walk-in customer (customer fields are NULL)

## Common Issues & Solutions

### Issue 1: Customer Still Null After Fix

**Possible Causes:**

- Frontend not selecting customer properly
- Customer not found in customers array
- Backend not mapping customer object

**Debug Steps:**

```typescript
// Add console.log in POSClient.tsx before order creation
console.log("Selected Customer ID:", selectedCustomer);
console.log("Found Customer:", customer);
console.log("Order Data:", orderData);
```

### Issue 2: PaymentType Enum Error

**Error**: `IllegalArgumentException: No enum constant PaymentType.cash`

**Cause**: Case sensitivity - backend expects uppercase

**Solution**: Already fixed - frontend now sends uppercase ("CASH", "CARD", "UPI")

### Issue 3: Items Not Calculated

**Error**: `Items total doesn't match expected amount`

**Cause**: Backend needs to fetch product prices

**Solution**: Ensure backend fetches product and uses product.price \* quantity

## Files Modified

### Frontend

1. ✅ `lib/actions/orders.ts`

   - Updated `CreateOrderData` type
   - Changed to send `customer` object
   - Changed to send `paymentType` instead of `paymentMethod`

2. ✅ `components/cashier/POSClient.tsx`
   - Updated order data construction
   - Send full customer object
   - Simplified items array
   - Use `paymentType` field

### Backend (Recommended Checks)

1. ⏳ Verify `Order.java` entity accepts `customer` object
2. ⏳ Verify `OrderController` maps `customer` correctly
3. ⏳ Verify `OrderService` calculates totals from items
4. ⏳ Verify `PaymentType` enum has CASH, CARD, UPI values

## Backend Entity Mapping

Your backend should have something like:

```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer; // ✅ This should now be populated

    @Enumerated(EnumType.STRING)
    private PaymentType paymentType; // ✅ This should now be populated

    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    // ... other fields
}
```

## API Contract

### Request

```typescript
POST /api/orders
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "storeId": string,
  "branchId": string (optional),
  "customer": {
    "id": string,
    "fullName": string,
    "email": string,
    "phone": string,
    "address": string (optional)
  } | null,
  "items": [
    {
      "productId": string,
      "quantity": number
    }
  ],
  "paymentType": "CASH" | "CARD" | "UPI"
}
```

### Response

```typescript
{
  "id": string,
  "orderNumber": string,
  "customer": Customer | null,
  "items": OrderItem[],
  "totalAmount": number,
  "paymentType": "CASH" | "CARD" | "UPI",
  "status": "COMPLETED" | "PENDING" | "CANCELLED",
  "createdAt": string,
  "updatedAt": string
}
```

## Status

✅ **Frontend Fixed**

- Sending full `customer` object
- Sending `paymentType` correctly
- Simplified items structure

⏳ **Backend Testing Required**

- Test with actual customer
- Test with walk-in customer (null)
- Verify payment type enum mapping
- Verify order totals calculation

## Next Steps

1. Test order creation with selected customer
2. Test order creation as walk-in (no customer)
3. Verify customer and paymentType are populated in database
4. Check order history displays correctly
5. Verify all payment types (CASH, CARD, UPI) work

## Related Documentation

- Order types: `lib/actions/orders.ts`
- POS component: `components/cashier/POSClient.tsx`
- Customer types: `lib/actions/customers.ts`
- Payment type fix: `PAYMENT-TYPE-FIX.md`
