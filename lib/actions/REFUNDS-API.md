# Refunds API Documentation

## Available Server Actions

All functions are located in `lib/actions/refunds.ts`

### 1. Create Refund

```typescript
createRefund(data: CreateRefundData)
```

**Endpoint:** `POST /api/refunds`

**Payload:**

```json
{
  "orderId": "9fa7d224-c896-45b2-ae6e-1dba3e9ac9cd",
  "reason": "testing returned defective product",
  "amount": 234995.0
}
```

---

### 2. Get Refunds by Cashier

```typescript
getRefundsByCashier(cashierId: string)
```

**Endpoint:** `GET /api/refunds/cashier/{cashierId}`

**Example:** `GET /api/refunds/cashier/e70d8110-55dc-4342-bf16-dd83c2853432`

---

### 3. Get Refunds by Branch

```typescript
getRefundsByBranch(branchId: string)
```

**Endpoint:** `GET /api/refunds/branch/{branchId}`

**Example:** `GET /api/refunds/branch/423aa7c5-3d11-4824-95d1-8af26b525ee4`

---

### 4. Get Refunds by Date Range

```typescript
getRefundsByDateRange(cashierId: string, startDate: string, endDate: string)
```

**Endpoint:** `GET /api/refunds/cashier/{cashierId}/range?startDate={start}&endDate={end}`

**Example:**

```
GET /api/refunds/cashier/c69f42d9-7da2-480f-8554-80edd6c0a91e/range
  ?startDate=2025-09-01T00:00:00
  &endDate=2025-09-27T23:59:59
```

---

### 5. Get Refund by ID

```typescript
getRefundById(refundId: string)
```

**Endpoint:** `GET /api/refunds/{refundId}`

---

### 6. Update Refund

```typescript
updateRefund(refundId: string, data: UpdateRefundData)
```

**Endpoint:** `PUT /api/refunds/{refundId}`

**Payload:**

```json
{
  "reason": "Updated reason",
  "amount": 150000.0
}
```

---

### 7. Delete Refund

```typescript
deleteRefund(refundId: string)
```

**Endpoint:** `DELETE /api/refunds/{refundId}`

---

## Type Definitions

```typescript
type Refund = {
  id: string;
  order?: {
    orderNumber?: string;
    id?: string;
    customer?: {
      fullName?: string;
      name?: string;
    };
  } | null;
  orderId?: string;
  customerName?: string;
  reason: string;
  amount: number;
  cashier?: {
    fullName?: string;
    id?: string;
  } | null;
  cashierName?: string;
  paymentType?: string | null;
  createdAt: string;
};

type CreateRefundData = {
  orderId: string;
  reason: string;
  amount: number;
};

type UpdateRefundData = {
  reason?: string;
  amount?: number;
  paymentType?: string;
};
```

---

## Usage Examples

### In a Client Component:

```tsx
import { getRefundsByCashier, createRefund } from "@/lib/actions/refunds";

// Fetch refunds
const result = await getRefundsByCashier(userId);
if (result.success && result.data) {
  setRefunds(result.data);
}

// Create refund
const newRefund = await createRefund({
  orderId: "order-uuid",
  reason: "Defective product",
  amount: 234995.0,
});
```

### In a Server Component:

```tsx
import { getRefundsByCashier } from "@/lib/actions/refunds";

export default async function RefundsPage() {
  const result = await getRefundsByCashier(cashierId);

  return (
    <div>
      {result.data?.map((refund) => (
        <div key={refund.id}>{refund.reason}</div>
      ))}
    </div>
  );
}
```

---

## Notes

- All endpoints require JWT authentication via cookies
- API returns non-JSON responses (204 No Content) for some successful operations
- Date format for range queries: ISO 8601 (e.g., `2025-09-01T00:00:00`)
- All amounts are in minor currency units (e.g., 234995.0 = $2,349.95)
