# Analytics Debugging Guide

## Issue

- Payment amounts showing R0.00
- Payment percentages showing NaN%
- Chart not displaying

## Debugging Steps Added

I've added comprehensive console logging throughout the analytics flow to help identify the issue.

### 1. Check Browser Console

Open your browser's Developer Tools (F12) and look for these console messages:

#### User Information

```
👤 Current User for Analytics: { id: "...", ... }
```

**What to check**: Does the user have a valid `id` field?

#### API Request

```
🔍 Fetching cashier summary from: http://localhost:5000/api/analytics/cashier/{id}/summary?from=2025-10-17&to=2025-10-17
```

**What to check**:

- Is the URL correct?
- Is the cashier ID valid (not undefined)?
- Are the dates formatted correctly?

#### API Response

```
✅ Cashier Summary API Response: { ordersCount: 2, totalRevenue: 206000, payments: [...] }
```

**What to check**:

- Is the response structure correct?
- Do payments have `total` field (not `totalAmount`)?
- Are payment types correct: "CASH", "CARD", "MOBILE_MONEY"?

#### Component Data

```
📊 Cashier Analytics Data: { summaryData: {...}, daily: [...] }
💳 Summary Cards Data: { ordersCount: 2, totalRevenue: 206000, payments: [...] }
💰 Payment Breakdown: { cash: {...}, card: {...}, mobile: {...} }
```

### 2. Common Issues & Solutions

#### Issue: No JWT Token

**Console**: `❌ No JWT token found`
**Solution**: User needs to log in again

#### Issue: API 404 Error

**Console**: `❌ Failed to fetch cashier summary: 404 Not Found`
**Solution**: Backend endpoint `/api/analytics/cashier/{id}/summary` doesn't exist or is misconfigured

#### Issue: API 401 Unauthorized

**Console**: `❌ Failed to fetch cashier summary: 401 Unauthorized`
**Solution**: JWT token is invalid or expired

#### Issue: Payment Array is Empty

**Console**: `💰 Payment Breakdown: { cash: undefined, card: undefined, mobile: undefined }`
**Reason**: Backend returned empty `payments` array
**Solution**: Cashier has no transactions yet, or backend query is filtering incorrectly

#### Issue: Wrong Field Names

**Backend returns**:

```json
{
  "payments": [{ "paymentType": "CASH", "count": 1, "totalAmount": 100 }]
}
```

**Frontend expects**:

```json
{
  "payments": [{ "paymentType": "CASH", "count": 1, "total": 100 }]
}
```

**Solution**: Backend needs to return `total` not `totalAmount`, OR frontend types need updating

### 3. Backend Verification

Check your backend is running and test the endpoint directly:

```bash
# Get JWT token from browser cookies or localStorage
# Then test the endpoint:

curl -X GET "http://localhost:5000/api/analytics/cashier/{CASHIER_ID}/summary?from=2025-10-17&to=2025-10-17" \
  -H "Authorization: Bearer {YOUR_JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

Expected response:

```json
{
  "ordersCount": 2,
  "totalRevenue": 206000.0,
  "payments": [
    {
      "paymentType": "CARD",
      "count": 1,
      "total": 206000.0
    }
  ]
}
```

### 4. Check Date Range

The default is "Today" which uses:

- **from**: Today at 00:00:00
- **to**: Current time

If no orders exist today, all values will be 0.

**Try**: Click "Yesterday" or "Last 7 Days" to see if data appears.

### 5. Chart Not Showing

Check console for:

```
✅ Cashier Daily API Response: [...]
```

If the array is empty `[]`, the chart will show "No daily data available".

**Reasons**:

1. No orders in selected date range
2. Backend `/api/analytics/cashier/{id}/daily` endpoint not implemented
3. Backend query is filtering incorrectly

### 6. Field Name Mismatch Investigation

Add this to your console to inspect the exact structure:

```javascript
// In browser console after page loads:
console.table(summary?.payments);
```

This will show you the exact field names the backend is returning.

### 7. Quick Test with Mock Data

To verify the UI works with correct data, temporarily add this to `CashierAnalytics.tsx`:

```typescript
// After fetchAnalytics, add:
if (summaryData) {
  // Override with test data
  setSummary({
    ordersCount: 5,
    totalRevenue: 500000,
    payments: [
      { paymentType: "CASH", count: 2, total: 200000 },
      { paymentType: "CARD", count: 2, total: 250000 },
      { paymentType: "MOBILE_MONEY", count: 1, total: 50000 },
    ],
  });
}
```

If this shows correctly, the issue is with the backend data.

## Next Steps

1. **Check browser console** for the logging messages
2. **Copy and share** the console output showing:
   - The API URL being called
   - The API response structure
   - Any error messages
3. **Verify backend** is returning data in the correct format
4. **Test different date ranges** to see if data exists

## Files with Debug Logging

- `lib/actions/analytics.ts` - API calls and responses
- `components/analytics/CashierAnalytics.tsx` - Data fetching
- `components/analytics/AnalyticsSummaryCards.tsx` - Data rendering
- `app/(dashboard)/store/cashier/performance/page.tsx` - User info

All logging uses emojis for easy identification:

- 👤 User data
- 🔍 API requests
- ✅ Successful responses
- ❌ Errors
- 📊 Analytics data
- 💳 Summary cards
- 💰 Payments

## Remove Debug Logging Later

Once the issue is fixed, you can remove the `console.log` statements to clean up the console.
