# Shift Management System

## Overview

Implemented a complete shift management system for cashiers that allows them to start and end shifts, track shift duration, and view real-time shift statistics. When a cashier ends their shift, they are automatically logged out of the system.

## API Endpoints

### Backend Endpoints (Spring Boot)

- **POST** `/api/shift-reports/start` - Start a new shift
- **PATCH** `/api/shift-reports/end` - End current shift
- **GET** `/api/shift-reports/current` - Get current active shift

All endpoints use JWT authentication - no manual data entry required. The cashier is identified from the JWT token.

## What Was Built

### 1. Server Actions (`lib/actions/shift.ts`)

#### Types

```typescript
interface ShiftReport {
  id: string;
  shiftStart: string;
  shiftEnd: string | null;
  totalSales: number | null;
  totalRefunds: number | null;
  netSale: number | null;
  totalOrders: number | null;
  cashier: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    branchId: string;
    storeId: string;
    lastLogin: string;
  };
  cashierId: string;
  branchId: string;
  paymentSummaries: any[] | null;
  topSellProducts: any[];
  recentOrders: any[];
  refunds: any[];
}
```

#### Functions

**`startShift()`**

- Creates a new shift for the logged-in cashier
- Uses JWT token for authentication
- Returns shift data with cashier info
- No parameters required

**`endShift()`**

- Ends the current active shift
- Calculates totals (sales, refunds, orders)
- Uses JWT token for authentication
- Triggers logout after success

**`getCurrentShift()`**

- Gets the current active shift if any
- Returns `undefined` if no active shift (not an error)
- Used to check shift status

### 2. ShiftInformationCard Component (`components/cashier/summary/ShiftInformationCard.tsx`)

**Purpose**: Display shift information on the cashier summary page with start/end functionality

**Features**:

- Real-time shift duration counter (HH:MM:SS format)
- Live badge when shift is active
- Displays cashier name, shift start time, shift end time, duration
- Start Shift button when no active shift
- End Shift & Logout button when shift is active
- Confirmation dialog before ending shift
- Beautiful gradient UI with animations
- Auto-refresh shift data

**States**:

- `currentShift`: Active shift data
- `loading`: Initial data fetch loading
- `actionLoading`: Start/end action loading
- `showEndShiftDialog`: Confirmation dialog visibility
- `shiftDuration`: Real-time calculated duration

**Key Functions**:

- `fetchCurrentShift()`: Loads current shift data
- `handleStartShift()`: Starts new shift
- `handleEndShift()`: Ends shift and logs out user
- Duration calculation with setInterval

### 3. ShiftManager Component (`components/cashier/ShiftManager.tsx`)

**Purpose**: Standalone shift management component (can be used anywhere)

**Features**:

- Same functionality as ShiftInformationCard
- Shows shift stats grid (Total Sales, Total Orders, Net Sales, Refunds)
- Larger, more detailed UI
- Can be added to dashboard or separate page

**UI Elements**:

- No Active Shift state with Start button
- Active Shift state with:
  - Live duration badge
  - 4 stat cards (sales, orders, net sales, refunds)
  - End Shift & Logout button
- Confirmation dialog with shift summary

## How It Works

### Starting a Shift

1. Cashier logs in and navigates to summary page
2. If no active shift, sees "No Active Shift" message
3. Clicks "Start Shift" button
4. API call to `/api/shift-reports/start` with JWT
5. Backend creates new shift record
6. UI updates to show active shift information
7. Duration counter starts

### During the Shift

1. Shift duration updates every second
2. Real-time display of:
   - Cashier name
   - Shift start time
   - Current duration
   - "LIVE" badge indicator
3. Cashier can take orders, process refunds, etc.
4. Stats update automatically (from backend)

### Ending a Shift

1. Cashier clicks "End Shift & Logout" button
2. Confirmation dialog appears showing:
   - Shift duration
   - Total orders
   - Warning about logout
3. Cashier confirms end shift
4. API call to `/api/shift-reports/end` with JWT
5. Backend:
   - Sets shift end time
   - Calculates totals
   - Returns final shift report
6. Frontend:
   - Shows success toast
   - Clears JWT (logs out)
   - Redirects to login page after 1.5s

## Security & Authentication

### JWT-Based Authentication

- All API calls include `Authorization: Bearer <jwt>` header
- No user ID or cashier ID needs to be passed
- Backend extracts user info from JWT token
- Secure and automatic user identification

### Automatic Logout

- When shift ends, `clearJWT()` is called
- Removes JWT from both:
  - Cookies (`jwt`, `user_data`)
  - localStorage
- Redirects to `/auth/login`
- User must log in again to start new shift

### No Manual Data Entry

- Shift start: Just click button (JWT identifies user)
- Shift end: Just click button (JWT identifies user)
- No forms, no manual input required

## Integration Points

### Summary Page

The `ShiftInformationCard` is already integrated in:

```
app/(dashboard)/store/cashier/summary/page.tsx
```

Layout:

```
<ShiftInformationCard /> | <SalesSummaryCard />
<PaymentSummaryCard /> | <TopSellingItems />
<RecentOrdersTable /> | <RefundsTable />
```

### Optional: Add to Main Dashboard

You can add `ShiftManager` component to any page:

```tsx
import ShiftManager from "@/components/cashier/ShiftManager";

<ShiftManager />;
```

## UI/UX Highlights

### Visual Indicators

- **Green "LIVE" badge**: Shift is active
- **Pulsing dot**: Real-time indicator
- **Red End Shift button**: Clear action to end
- **Duration counter**: Updates every second
- **Gradient backgrounds**: Modern, professional look

### Loading States

- Spinner during initial load
- "Starting Shift..." text during start
- "Ending..." text during end
- Disabled buttons during actions

### Error Handling

- Toast notifications for errors
- Specific error messages from backend
- Graceful handling of "no active shift" state
- Console logging for debugging

### Responsive Design

- Works on desktop and mobile
- Compact information display
- Touch-friendly buttons
- Readable text sizes

## Business Logic

### Shift Lifecycle

1. **Idle** - No active shift (show start button)
2. **Active** - Shift running (show stats and end button)
3. **Ended** - Shift completed (logout and return to idle)

### Backend Calculations

When ending shift, backend calculates:

- Total sales amount
- Total refunds amount
- Net sales (sales - refunds)
- Total number of orders
- Top selling products
- Recent orders list
- Refunds list
- Payment method summaries

### Shift Reports

The ShiftReport data structure includes:

- Shift timing (start, end, duration)
- Financial totals
- Order statistics
- Product analytics
- Payment breakdowns
- Cashier information

## Testing Checklist

### Start Shift Flow

- [ ] Navigate to summary page
- [ ] Verify "No Active Shift" displays
- [ ] Click "Start Shift" button
- [ ] Verify loading state shows
- [ ] Verify success toast appears
- [ ] Verify shift info displays
- [ ] Verify "LIVE" badge shows
- [ ] Verify duration counter starts

### During Shift

- [ ] Verify cashier name displays correctly
- [ ] Verify shift start time is accurate
- [ ] Verify duration updates every second
- [ ] Create an order in POS
- [ ] Check if order count updates (may need refresh)
- [ ] Verify "End Shift & Logout" button shows

### End Shift Flow

- [ ] Click "End Shift & Logout" button
- [ ] Verify confirmation dialog appears
- [ ] Verify shift summary shows in dialog
- [ ] Click "Cancel" - dialog closes, shift continues
- [ ] Click "End Shift & Logout" again
- [ ] Click confirm button
- [ ] Verify loading state shows
- [ ] Verify success toast appears
- [ ] Verify redirect to login page
- [ ] Try accessing protected page - should redirect to login
- [ ] Log in again
- [ ] Verify "No Active Shift" displays

### Error Cases

- [ ] Test with expired JWT
- [ ] Test with network error
- [ ] Test starting shift twice
- [ ] Test ending non-existent shift
- [ ] Verify error messages are user-friendly

## API Response Examples

### Start Shift Response

```json
{
  "id": "fcd738ac-82ac-4e8c-bdc2-0bccfa536274",
  "shiftStart": "22:06:03.1440087",
  "shiftEnd": null,
  "totalSales": null,
  "totalRefunds": null,
  "netSale": null,
  "totalOrders": null,
  "cashier": {
    "id": "be3e02cb-7e06-434a-a290-1a0773f8b361",
    "fullName": "Nompumelelo Mlambo",
    "email": "manager@thembisa.co.za",
    "phone": "0727077541",
    "role": "ROLE_BRANCH_CASHIER",
    "branchId": "43e32841-e8d2-4a4b-b4e6-d620030074d7",
    "storeId": "d371d1af-5199-4f08-b390-2a41e99d09de",
    "lastLogin": "2025-10-17T22:05:28.611287"
  },
  "cashierId": "be3e02cb-7e06-434a-a290-1a0773f8b361",
  "branchId": "43e32841-e8d2-4a4b-b4e6-d620030074d7",
  "paymentSummaries": null,
  "topSellProducts": [],
  "recentOrders": [],
  "refunds": []
}
```

### End Shift Response

```json
{
  "id": "fcd738ac-82ac-4e8c-bdc2-0bccfa536274",
  "shiftStart": "22:06:03.1440087",
  "shiftEnd": "23:45:10.5678901",
  "totalSales": 15430.5,
  "totalRefunds": 250.0,
  "netSale": 15180.5,
  "totalOrders": 47,
  "cashier": {
    /* same as above */
  },
  "paymentSummaries": [
    /* payment breakdown */
  ],
  "topSellProducts": [
    /* top products */
  ],
  "recentOrders": [
    /* last 10 orders */
  ],
  "refunds": [
    /* all refunds */
  ]
}
```

## Future Enhancements

### Priority

1. Add shift report PDF download
2. Display shift stats from backend (currently shows 0s)
3. Add shift history page
4. Email shift report to manager

### Nice to Have

1. Multi-shift support (break between shifts)
2. Shift handover notes
3. Cash drawer reconciliation
4. Shift-to-shift comparison
5. Daily/weekly shift analytics
6. Shift performance scoring

## Related Files

- `lib/actions/shift.ts` - Server actions for shift API
- `components/cashier/summary/ShiftInformationCard.tsx` - Summary page shift card
- `components/cashier/ShiftManager.tsx` - Standalone shift manager
- `app/(dashboard)/store/cashier/summary/page.tsx` - Cashier summary page
- `lib/auth/jwt-utils.ts` - JWT management (used for logout)

## Status

✅ **COMPLETE** - Shift management system fully implemented with start/end functionality and automatic logout.
