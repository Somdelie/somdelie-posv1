# Analytics Data Field Fix

## Issue

Analytics dashboard showing:

- R0.00 for cash and card payments
- NaN% for payment percentages

## Root Cause

Backend returns field name `total` but frontend was expecting `totalAmount`.

**Backend DTO** (Java):

```java
public class PaymentBreakdownDTO {
    private PaymentType paymentType;
    private long count;
    private double total;  // ← Backend uses 'total'
}
```

**Frontend Interface** (TypeScript - BEFORE):

```typescript
export interface PaymentBreakdownDTO {
  paymentType: "CASH" | "CARD" | "MOBILE_MONEY";
  count: number;
  totalAmount: number; // ← Frontend expected 'totalAmount'
}
```

## Fix Applied

### 1. Updated Type Definition (`lib/actions/analytics.ts`)

Changed `totalAmount` to `total` to match backend:

```typescript
export interface PaymentBreakdownDTO {
  paymentType: "CASH" | "CARD" | "MOBILE_MONEY";
  count: number;
  total: number; // ✅ Now matches backend
}
```

### 2. Updated Component References (`components/analytics/AnalyticsSummaryCards.tsx`)

**Cash Payments Card**:

```typescript
// BEFORE
{
  formatPrice(cashPayment?.totalAmount || 0);
}

// AFTER
{
  formatPrice(cashPayment?.total || 0);
}
```

**Digital Payments Card**:

```typescript
// BEFORE
{
  formatPrice(
    (cardPayment?.totalAmount || 0) + (mobilePayment?.totalAmount || 0)
  );
}

// AFTER
{
  formatPrice((cardPayment?.total || 0) + (mobilePayment?.total || 0));
}
```

**Payment Breakdown Card**:

```typescript
// BEFORE
<p className="font-semibold">{formatPrice(payment.totalAmount)}</p>
<p className="text-sm text-muted-foreground">
  {calculatePercentage(payment.totalAmount)}%
</p>

// AFTER
<p className="font-semibold">{formatPrice(payment.total)}</p>
<p className="text-sm text-muted-foreground">
  {calculatePercentage(payment.total)}%
</p>
```

### 3. Improved Average Order Calculation

Added proper division-by-zero handling:

```typescript
// BEFORE
Average: {formatPrice(summary.totalRevenue / summary.ordersCount || 0)} per order

// AFTER
Average: {summary.ordersCount > 0
  ? formatPrice(summary.totalRevenue / summary.ordersCount)
  : formatPrice(0)} per order
```

## Result

✅ Payment amounts now display correctly  
✅ Payment percentages calculate correctly  
✅ No more NaN% values  
✅ Proper handling of zero-order scenarios

## Files Modified

1. `lib/actions/analytics.ts` - Type definition
2. `components/analytics/AnalyticsSummaryCards.tsx` - Component references

## Testing

After this fix, the analytics dashboard should display:

- Correct payment totals (Cash, Card, Mobile Money)
- Valid percentages (not NaN%)
- Proper average order values
- All currency values formatted correctly

The data should now flow correctly from backend → server actions → components → UI.
