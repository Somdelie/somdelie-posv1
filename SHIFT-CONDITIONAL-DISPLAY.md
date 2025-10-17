# Shift-Based Summary Page Display

## Overview

Modified the cashier summary page to conditionally display content based on shift status. When no shift is active, only the "Start Shift" card is shown centered on the page. Once a shift is started, all summary components become visible.

## Changes Made

### 1. Summary Page (`app/(dashboard)/store/cashier/summary/page.tsx`)

**Converted to Client Component**

- Added `"use client"` directive
- Added state management for shift status
- Added loading state

**Conditional Rendering Logic**

#### Loading State

```tsx
if (loading) {
  return (
    <div className="h-full flex flex-col">
      <ShiftReportHeader />
      <div className="flex-1 flex items-center justify-center">
        <RefreshCw className="size-8 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}
```

#### No Active Shift State

```tsx
if (!currentShift) {
  return (
    <div className="h-full flex flex-col">
      <ShiftReportHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <ShiftInformationCard onShiftStarted={fetchCurrentShift} />
        </div>
      </div>
    </div>
  );
}
```

- Only shows ShiftInformationCard
- Centered on the page
- Max width of 2xl for better UX
- Calls `fetchCurrentShift` when shift is started

#### Active Shift State

```tsx
return (
  <div className="h-full flex flex-col">
    <ShiftReportHeader />
    <div className="flex-1 overflow-auto p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
        <ShiftInformationCard onShiftStarted={fetchCurrentShift} />
        <SalesSummaryCard />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
        <PaymentSummaryCard />
        <TopSellingItems />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
        <RecentOrdersTable />
        <RefundsTable />
      </div>
    </div>
  </div>
);
```

- Shows all summary components
- Grid layout with 2 columns on medium+ screens
- Full dashboard experience

### 2. ShiftInformationCard Component

**Added Props Interface**

```typescript
interface ShiftInformationCardProps {
  onShiftStarted?: () => void;
}

const ShiftInformationCard = ({ onShiftStarted }: ShiftInformationCardProps) => {
```

**Updated handleStartShift**

```typescript
const handleStartShift = async () => {
  setActionLoading(true);
  try {
    const result = await startShift();
    if (result.success && result.data) {
      setCurrentShift(result.data);
      toast.success("Shift started successfully!");
      // Notify parent component that shift has started
      if (onShiftStarted) {
        onShiftStarted();
      }
    } else {
      toast.error(result.error || "Failed to start shift");
    }
  } catch (error) {
    console.error("Error starting shift:", error);
    toast.error("An error occurred while starting shift");
  } finally {
    setActionLoading(false);
  }
};
```

## User Experience Flow

### Before Starting Shift

1. Cashier logs in and navigates to summary page
2. Page loads with spinner while checking shift status
3. If no active shift:
   - Header shows "Shift Report"
   - Large centered "Start Shift" card appears
   - All other summary components are hidden
   - Clean, focused UI directing user to start shift

### Starting a Shift

1. Cashier clicks "Start Shift" button
2. Button shows loading state
3. API call creates shift
4. Success toast appears
5. Page automatically refreshes (`onShiftStarted` callback)
6. All summary components fade in

### During Shift

1. Full dashboard with all components visible:
   - Shift Information (top-left)
   - Sales Summary (top-right)
   - Payment Summary (middle-left)
   - Top Selling Items (middle-right)
   - Recent Orders (bottom-left)
   - Refunds (bottom-right)
2. Real-time shift duration counter
3. All stats and data displayed

### Ending Shift

1. Cashier clicks "End Shift & Logout"
2. Confirmation dialog appears
3. After confirmation:
   - Shift ends
   - User logs out
   - Redirects to login page
4. Next login will show "Start Shift" card again

## Benefits

### User Experience

- **Clear Focus**: No distracting components when shift not started
- **Better Onboarding**: New cashiers immediately know to start shift
- **Data Accuracy**: Summary data only shown when shift is active and relevant
- **Cleaner Interface**: Reduces visual clutter when unnecessary

### Business Logic

- **Enforced Workflow**: Cashiers must start shift to see data
- **Accurate Reporting**: All displayed data tied to active shift
- **Shift Accountability**: Clear separation between shift and non-shift states

### Technical

- **Conditional Rendering**: Efficient component mounting
- **State Management**: Parent controls visibility based on shift status
- **Callback Pattern**: Child notifies parent of state changes
- **Loading States**: Smooth transitions between states

## Visual Layout

### No Active Shift

```
┌─────────────────────────────────────┐
│          Shift Report Header        │
├─────────────────────────────────────┤
│                                     │
│           (empty space)             │
│                                     │
│     ┌─────────────────────┐        │
│     │                     │        │
│     │  No Active Shift    │        │
│     │                     │        │
│     │  [Start Shift]      │        │
│     │                     │        │
│     └─────────────────────┘        │
│                                     │
│           (empty space)             │
│                                     │
└─────────────────────────────────────┘
```

### Active Shift

```
┌─────────────────────────────────────┐
│          Shift Report Header        │
├─────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Shift     │  │    Sales    │  │
│  │ Information │  │   Summary   │  │
│  └─────────────┘  └─────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  │
│  │  Payment    │  │  Top Selling│  │
│  │  Summary    │  │    Items    │  │
│  └─────────────┘  └─────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   Recent    │  │   Refunds   │  │
│  │   Orders    │  │             │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

## Testing Checklist

### No Active Shift State

- [ ] Navigate to `/store/cashier/summary`
- [ ] Verify loading spinner appears briefly
- [ ] Verify only "Start Shift" card is visible
- [ ] Verify card is centered on page
- [ ] Verify no other summary components visible
- [ ] Verify header still shows

### Starting Shift

- [ ] Click "Start Shift" button
- [ ] Verify button shows loading state
- [ ] Verify success toast appears
- [ ] Verify page automatically refreshes
- [ ] Verify all summary components appear
- [ ] Verify shift info card shows live data

### Active Shift State

- [ ] Verify all 6 components are visible
- [ ] Verify 2-column grid layout
- [ ] Verify shift duration counter updates
- [ ] Verify "End Shift" button is visible
- [ ] Navigate away and back - should still show all components

### Ending Shift

- [ ] Click "End Shift & Logout"
- [ ] Confirm in dialog
- [ ] Verify redirect to login
- [ ] Log back in
- [ ] Navigate to summary page
- [ ] Verify back to "Start Shift" only state

### Responsive Design

- [ ] Test on mobile (single column)
- [ ] Test on tablet (2 columns)
- [ ] Test on desktop (2 columns)
- [ ] Verify centering works on all sizes

## Edge Cases Handled

1. **API Error**: If shift status fetch fails, assumes no shift
2. **Slow Network**: Loading spinner shows during fetch
3. **Shift Ended Elsewhere**: Page will show "Start Shift" on next load
4. **Browser Refresh**: State is re-fetched from API
5. **Multiple Tabs**: Each tab independently checks shift status

## Performance Considerations

- **Conditional Mounting**: Components only mounted when needed
- **Single API Call**: One `getCurrentShift()` call on page load
- **Callback Pattern**: Efficient parent-child communication
- **No Polling**: Relies on user actions to update state

## Related Files

- `app/(dashboard)/store/cashier/summary/page.tsx` - Main summary page with conditional logic
- `components/cashier/summary/ShiftInformationCard.tsx` - Shift card with callback support
- `lib/actions/shift.ts` - Shift management API actions

## Status

✅ **COMPLETE** - Summary page now conditionally displays content based on shift status.
