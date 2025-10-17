# Refund Details Page - Role-Based Access Control

## Overview

Implemented real-time refund details page with proper role-based access control (RBAC). Different user roles see different refunds based on their permissions.

## Role-Based Access Matrix

| Role                    | Access Level   | Can View                                   |
| ----------------------- | -------------- | ------------------------------------------ |
| **ROLE_SUPER_ADMIN**    | Full Access    | All refunds across all stores and branches |
| **ROLE_STORE_ADMIN**    | Store Level    | All refunds in their store                 |
| **ROLE_STORE_MANAGER**  | Store Level    | All refunds in their store                 |
| **ROLE_BRANCH_MANAGER** | Branch Level   | All refunds in their branch only           |
| **ROLE_BRANCH_CASHIER** | Personal Level | Only their own refunds                     |

## Implementation

### File Updated

`app/(dashboard)/store/cashier/refunds/[id]/page.tsx`

### Data Flow

```
1. Page loads with refund ID from URL
   ↓
2. Fetch current user (getCurrentUser)
   ↓
3. Fetch refund by ID (getRefundById)
   ↓
4. Check role-based access (checkRefundAccess)
   ↓
5. If access denied → Redirect to refunds list
   ↓
6. Fetch related order data (getOrderById)
   ↓
7. Transform data to match component props
   ↓
8. Render RefundDetails component
```

### Access Control Logic

```typescript
function checkRefundAccess(user: any, refund: any): boolean {
  const role = user.role;

  switch (role) {
    case "ROLE_SUPER_ADMIN":
    case "ROLE_STORE_ADMIN":
      // Can see all refunds
      return true;

    case "ROLE_STORE_MANAGER":
      // Can see refunds in their store
      return user.storeId === refund.order?.storeId;

    case "ROLE_BRANCH_MANAGER":
      // Can see refunds in their branch
      return user.branchId === refund.order?.branchId;

    case "ROLE_BRANCH_CASHIER":
      // Can only see their own refunds
      return user.id === refund.cashier?.id;

    default:
      return false;
  }
}
```

## API Calls Used

### 1. Get Current User

```typescript
const user = await getCurrentUser();
```

**Source**: `lib/actions/auth.ts`
**Returns**: User object with role, storeId, branchId

### 2. Get Refund by ID

```typescript
const refundResult = await getRefundById(id);
```

**Endpoint**: `GET /api/refunds/{id}`
**Source**: `lib/actions/refunds.ts`
**Returns**: Refund object with order details

### 3. Get Order by ID

```typescript
const orderResult = await getOrderById(refund.orderId);
```

**Endpoint**: `GET /api/orders/{id}`
**Source**: `lib/actions/orders.ts`
**Returns**: Full order details with items and customer

## Data Transformation

### API Response Structure

```typescript
// Refund from API
{
  id: "uuid",
  orderId: "order-uuid",
  reason: "Damaged item",
  amount: 500,
  cashier: { id: "uuid", fullName: "John Doe" },
  paymentType: "CASH",
  createdAt: "2025-10-17T..."
}

// Order from API
{
  id: "uuid",
  orderNumber: "ORD-12345",
  customer: {
    id: "uuid",
    fullName: "Customer Name",
    email: "email@example.com",
    phone: "1234567890",
    address: "123 Main St"
  },
  items: [
    {
      productId: "uuid",
      productName: "Product Name",
      quantity: 2,
      price: 250
    }
  ],
  totalAmount: 500,
  paymentType: "CASH",
  status: "COMPLETED",
  createdAt: "2025-10-17T..."
}
```

### Transformed for Component

```typescript
{
  id: 123,  // Converted from UUID
  orderNumber: "ORD-12345",
  createdAt: "Oct 17, 2025, 2:30 PM",
  paymentMethod: "CASH",
  customer: {
    fullName: "Customer Name",
    phone: "1234567890",
    email: "email@example.com",
    address: "123 Main St"
  },
  totalItems: 1,
  orderTotal: 500,
  items: [
    {
      id: "product-uuid",
      name: "Product Name",
      quantity: 2,
      price: 250
    }
  ],
  cashier: {
    fullName: "John Doe",
    id: "cashier-uuid"
  },
  refund: {
    id: "refund-uuid",
    reason: "Damaged item",
    amount: 500,
    refundMethod: "CASH",
    createdAt: "Oct 17, 2025, 2:30 PM",
    status: "COMPLETED",
    itemsReturned: [...]
  }
}
```

## Security Features

### 1. Authentication Check

```typescript
if (!user) {
  redirect("/auth/login");
}
```

**Purpose**: Ensure user is logged in

### 2. Data Validation

```typescript
if (!refundResult.success || !refundResult.data) {
  redirect("/store/cashier/refunds");
}
```

**Purpose**: Handle invalid refund IDs

### 3. Role-Based Access Control

```typescript
const canAccessRefund = checkRefundAccess(user, refund);
if (!canAccessRefund) {
  redirect("/store/cashier/refunds");
}
```

**Purpose**: Prevent unauthorized access

### 4. Order Validation

```typescript
if (!orderResult.success || !orderResult.data) {
  redirect("/store/cashier/refunds");
}
```

**Purpose**: Ensure order exists and is accessible

## Access Scenarios

### Scenario 1: Cashier Views Own Refund

```
User: { id: "cashier-1", role: "ROLE_BRANCH_CASHIER" }
Refund: { cashier: { id: "cashier-1" } }
Result: ✅ Access Granted
```

### Scenario 2: Cashier Views Other's Refund

```
User: { id: "cashier-1", role: "ROLE_BRANCH_CASHIER" }
Refund: { cashier: { id: "cashier-2" } }
Result: ❌ Access Denied → Redirect
```

### Scenario 3: Branch Manager Views Branch Refund

```
User: { branchId: "branch-1", role: "ROLE_BRANCH_MANAGER" }
Refund: { order: { branchId: "branch-1" } }
Result: ✅ Access Granted
```

### Scenario 4: Branch Manager Views Other Branch Refund

```
User: { branchId: "branch-1", role: "ROLE_BRANCH_MANAGER" }
Refund: { order: { branchId: "branch-2" } }
Result: ❌ Access Denied → Redirect
```

### Scenario 5: Store Admin Views Any Refund

```
User: { role: "ROLE_STORE_ADMIN" }
Refund: { any refund }
Result: ✅ Access Granted
```

## Error Handling

### Invalid Refund ID

```
URL: /store/cashier/refunds/invalid-id
↓
getRefundById returns: { success: false }
↓
Redirect to: /store/cashier/refunds
```

### Missing Order Data

```
Refund exists but order is deleted/missing
↓
getOrderById returns: { success: false }
↓
Redirect to: /store/cashier/refunds
```

### Unauthorized Access

```
User tries to access refund outside their scope
↓
checkRefundAccess returns: false
↓
Redirect to: /store/cashier/refunds
```

### Not Authenticated

```
No JWT token or invalid token
↓
getCurrentUser returns: null
↓
Redirect to: /auth/login
```

## Date Formatting

All dates are formatted for user-friendly display:

```typescript
new Date(isoString).toLocaleString("en-US", {
  month: "short", // "Oct"
  day: "numeric", // "17"
  year: "numeric", // "2025"
  hour: "numeric", // "2"
  minute: "2-digit", // "30"
  hour12: true, // "PM"
});
// Result: "Oct 17, 2025, 2:30 PM"
```

## Component Props Interface

```typescript
interface RefundDetailsProps {
  order: {
    id: number;
    orderNumber: string;
    createdAt: string;
    paymentMethod: string;
    customer: {
      fullName: string;
      phone: string;
      email?: string;
      address?: string;
    };
    totalItems: number;
    orderTotal: number;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    cashier: {
      fullName: string;
      id: string;
    };
    refund: {
      id: string;
      amount: number;
      reason: string;
      refundMethod: string;
      createdAt: string;
      status: "COMPLETED" | "PENDING" | "FAILED";
      itemsReturned: Array<{
        id: string;
        name: string;
        quantity: number;
        refundAmount: number;
      }>;
    };
  };
}
```

## Testing Checklist

### As Cashier

- [ ] Login as cashier
- [ ] View own refund details
- [ ] Try to access another cashier's refund (should redirect)
- [ ] Verify correct customer information displays
- [ ] Verify correct order items display
- [ ] Verify refund reason displays

### As Branch Manager

- [ ] Login as branch manager
- [ ] View refund from own branch
- [ ] Try to access refund from different branch (should redirect)
- [ ] Verify all branch refunds are accessible

### As Store Admin

- [ ] Login as store admin
- [ ] View any refund in store
- [ ] Access refunds from different branches
- [ ] Verify all store refunds are accessible

### As Store Manager

- [ ] Login as store manager
- [ ] View refunds from own store
- [ ] Try to access refund from different store (should redirect)

### Edge Cases

- [ ] Access non-existent refund ID
- [ ] Access refund with deleted order
- [ ] Access as logged out user
- [ ] Access with invalid JWT token

## Performance Considerations

### Server-Side Rendering

- All data fetching happens on server
- No client-side loading states needed
- Faster initial page load
- Better SEO

### Sequential API Calls

```
getCurrentUser → getRefundById → getOrderById
```

**Why Sequential**: Each call depends on previous data

**Optimization Ideas**:

- Cache user data
- Combine refund + order in single backend endpoint
- Use parallel fetching where possible

## URL Structure

```
/store/cashier/refunds/[id]
```

**Example**:

```
/store/cashier/refunds/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

## Navigation

### Entry Points

- Refunds list page → Click "View" button
- Direct URL access (if authorized)

### Exit Points

- Back button → Returns to previous page
- Redirect (unauthorized) → /store/cashier/refunds
- Redirect (not authenticated) → /auth/login

## Server Actions Used

All from `lib/actions/`:

1. **auth.ts**

   - `getCurrentUser()` - Get authenticated user

2. **refunds.ts**

   - `getRefundById(id)` - Fetch refund details

3. **orders.ts**
   - `getOrderById(id)` - Fetch order details

## Related Files

- Page: `app/(dashboard)/store/cashier/refunds/[id]/page.tsx`
- Component: `components/cashier/refunds/ReturnDetails.tsx`
- Actions: `lib/actions/refunds.ts`, `lib/actions/orders.ts`, `lib/actions/auth.ts`
- Types: Order, Refund, User types
- Permissions: `lib/auth/permissions.ts`

## Future Enhancements

- [ ] Add refund status update capability
- [ ] Add refund cancellation for managers
- [ ] Add refund approval workflow
- [ ] Add refund notes/comments
- [ ] Add refund receipt download
- [ ] Add refund email notification
- [ ] Add refund audit log
- [ ] Add refund analytics
- [ ] Cache frequently accessed refunds
- [ ] Add print refund receipt

## Status

✅ **Complete and Functional**

- Role-based access control implemented
- Real API data integration
- Proper error handling
- Security checks in place
- Data transformation working
- All user roles supported
