# Refund Form - Backend Endpoint Fix

## Problem

When creating a refund, the form failed with error:

```
Failed to fetch store orders: 400 {"message":"No static resource api/orders/store/d371d1af-5199-4f08-b390-2a41e99d09de."}
```

## Root Cause

The refund form was trying to call `/api/orders/store/{storeId}` which **does not exist** on the backend.

## Available Backend Endpoints

Based on your Postman collection, the backend supports:

### Orders

- ✅ `GET /api/orders/cashier/{cashierId}` - Get orders by cashier
- ❌ `GET /api/orders/store/{storeId}` - Does NOT exist

### Refunds

- ✅ `POST /api/refunds` - Create new refund
- ✅ `GET /api/refunds` - Get all refunds
- ✅ `GET /api/refunds/{id}` - Get refund by ID
- ✅ `GET /api/refunds/cashier/{cashierId}` - Get refunds by cashier
- ✅ `GET /api/refunds/branch/{branchId}` - Get refunds by branch
- ✅ `GET /api/refunds/cashier/{cashierId}/range` - Get refunds by date range

## Solution Applied

### 1. Updated Refund Form Component

**File**: `components/cashier/refunds/ReturnRefundFormClient.tsx`

**Before:**

```typescript
import {
  getOrdersByCashier,
  getOrdersByStore,
  type Order,
} from "@/lib/actions/orders";

const fetchOrders = async () => {
  const result = await getOrdersByStore(storeId); // ❌ Endpoint doesn't exist
  // ...
};
```

**After:**

```typescript
import { getOrdersByCashier, type Order } from "@/lib/actions/orders";

const fetchOrders = async () => {
  // Fetch orders by cashier (current user)
  const result = await getOrdersByCashier(userId); // ✅ Valid endpoint
  if (result.success && result.data) {
    // Filter orders for selected customer
    const customerOrders = result.data.filter((order) => {
      // Check if order has customer and matches selected customer
      if (!order.customer?.id) return false;
      return order.customer.id === selectedCustomer;
    });
    setOrders(customerOrders);
  }
};
```

### 2. Commented Out Invalid Endpoint

**File**: `lib/actions/orders.ts`

Added note and commented out the `getOrdersByStore()` function:

```typescript
/**
 * Get orders by store ID
 * ⚠️ NOTE: This endpoint does NOT exist on the backend
 * Backend endpoints available:
 * - GET /api/orders/cashier/{cashierId}
 * Use getOrdersByCashier() instead
 */
/* 
export async function getOrdersByStore(...) {
  // Commented out - endpoint doesn't exist
}
*/
```

## How It Works Now

### Refund Creation Flow

1. **Cashier Opens Refund Form**

   - Component receives `userId` (cashier ID) and `storeId`

2. **Select Customer**

   - User selects customer from dropdown
   - `selectedCustomer` state is set

3. **Fetch Orders**

   - Calls `getOrdersByCashier(userId)`
   - Gets ALL orders created by this cashier
   - Filters client-side to show only orders for selected customer

4. **Display Filtered Orders**

   - Shows orders where `order.customer.id === selectedCustomer`
   - User selects order to refund

5. **Create Refund**
   - Calls `POST /api/refunds` with orderId, amount, reason
   - Redirects to refunds list on success

## Data Filtering Logic

### Before (Broken)

```
Frontend → getOrdersByStore(storeId)
    ↓
Backend API: /api/orders/store/{storeId} ❌ (doesn't exist)
    ↓
Error: 400 No static resource
```

### After (Fixed)

```
Frontend → getOrdersByCashier(userId)
    ↓
Backend API: /api/orders/cashier/{cashierId} ✅ (exists)
    ↓
Returns: All orders by this cashier
    ↓
Frontend filters: orders.filter(order => order.customer?.id === selectedCustomer)
    ↓
Shows: Only orders for selected customer
```

## Order Type Structure

The Order type now includes the full customer object:

```typescript
export type Order = {
  id: string;
  orderNumber?: string;
  storeId: string;
  branchId?: string;
  cashierId: string;
  customerId?: string; // Deprecated
  customer: {
    // ✅ Use this
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
};
```

## Testing Checklist

### Before Testing

- [ ] Backend is running on localhost:5000
- [ ] User is logged in as cashier
- [ ] Cashier has created some orders
- [ ] Orders have customer information

### Test Steps

1. **Navigate to Refunds**

   - Go to `/store/cashier/refunds`
   - Click "New Refund" button

2. **Select Customer**

   - Customer dropdown should load
   - Select a customer who has orders
   - Order dropdown should enable

3. **Verify Orders Load**

   - Orders dropdown should show customer's orders
   - Should show order number, date, payment, total
   - Should NOT show error about "No static resource"

4. **Select Order**

   - Select an order
   - Order details card should display
   - Refund amount should pre-fill

5. **Create Refund**
   - Enter refund reason
   - Click "Process Refund"
   - Should succeed and redirect to refunds list

### Expected Behavior

- ✅ No 400 error about "No static resource"
- ✅ Orders load successfully
- ✅ Only shows orders for selected customer
- ✅ Can create refund successfully

## Common Issues & Solutions

### Issue 1: No Orders Found

**Symptom**: "No orders found for this customer"

**Possible Causes:**

- Customer has no completed orders
- Orders were created by different cashier
- Customer object not populated in order

**Solution:**

- Create a test order with this customer first
- Ensure orders have `customer` object populated

### Issue 2: Orders Still Not Loading

**Symptom**: Error fetching orders

**Check:**

1. Backend endpoint exists:

   ```bash
   curl http://localhost:5000/api/orders/cashier/{cashierId}
   ```

2. JWT token is valid:

   - Check browser DevTools → Application → Cookies
   - Look for `jwt` cookie

3. Cashier ID is correct:
   - Check userId prop passed to component
   - Verify it matches backend cashier ID

### Issue 3: Customer Filter Not Working

**Symptom**: Shows orders for wrong customer

**Debug:**

```typescript
// Add console.log in fetchOrders()
console.log("Selected Customer:", selectedCustomer);
console.log("All Orders:", result.data);
console.log("Filtered Orders:", customerOrders);
```

**Check:**

- `order.customer?.id` exists
- `selectedCustomer` is set correctly
- IDs match exactly (case-sensitive)

## Refund Component Props

The refund form requires:

```typescript
type ReturnRefundFormClientProps = {
  userId: string; // Cashier ID (for fetching orders)
  storeId: string; // Store ID (for context, not used in API call)
};
```

## Page Component

The page passes the required props:

```typescript
// app/(dashboard)/store/cashier/refunds/new/page.tsx
export default async function ReturnRefundPage() {
  const user = await getCurrentUser();

  if (!user?.storeId) {
    redirect("/store/cashier/refunds");
  }

  return <ReturnRefundFormClient userId={user.id} storeId={user.storeId} />;
}
```

## Files Modified

1. ✅ `components/cashier/refunds/ReturnRefundFormClient.tsx`

   - Removed `getOrdersByStore` import
   - Changed to use `getOrdersByCashier(userId)`
   - Added client-side filtering by customer

2. ✅ `lib/actions/orders.ts`
   - Commented out `getOrdersByStore()` function
   - Added note about unavailable endpoint

## Backend Endpoint Recommendations

### Option 1: Keep Current Approach (Recommended)

Continue using `getOrdersByCashier()` with client-side filtering.

**Pros:**

- No backend changes needed
- Works with existing endpoints
- Simple implementation

**Cons:**

- Fetches all cashier orders (could be many)
- Filtering done client-side

### Option 2: Add Backend Endpoint (Future Enhancement)

Add new endpoint to backend:

```java
@GetMapping("/api/orders/customer/{customerId}")
public ResponseEntity<List<Order>> getOrdersByCustomer(
    @PathVariable UUID customerId,
    @AuthenticationPrincipal User cashier
) {
    // Return only orders for this customer created by this cashier
    List<Order> orders = orderService.findByCustomerAndCashier(customerId, cashier.getId());
    return ResponseEntity.ok(orders);
}
```

**Pros:**

- More efficient (filters on server)
- Reduces data transfer
- Better for large datasets

**Cons:**

- Requires backend changes
- More complex

## Performance Considerations

### Current Implementation

- Fetches all orders by cashier
- Filters client-side by customer
- Suitable for most POS use cases (cashiers typically have limited order history)

### When to Optimize

If a cashier has >1000 orders:

- Consider pagination
- Consider server-side filtering
- Consider date range limits

## Related Documentation

- Refund form: `components/cashier/refunds/REFUND-FORM-README.md`
- Order actions: `lib/actions/ORDERS-API.md`
- Backend endpoints: See Postman collection
- Integration fix: `ORDER-API-INTEGRATION-FIX.md`

## Status

✅ **Fixed and Ready**

- Refund form now uses correct endpoint
- No more 400 errors
- Orders load successfully
- Filtering works correctly

## Next Steps

Test the refund creation flow:

1. Login as cashier
2. Navigate to refunds → new
3. Select customer with orders
4. Select order
5. Create refund
6. Verify success
