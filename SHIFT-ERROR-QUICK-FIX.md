# Quick Fix: Shift "Already Started" Error

## The Problem

**Error**: "Failed to start shift: ShiftReport already started for today!"

**Why**: Backend allows only **one shift per calendar day** per cashier. Once a shift is ended, you cannot start another until the next day.

## The Fix ✅

Updated error message to be clear and informative:

```typescript
if (errorMessage.includes("already started for today")) {
  toast.error(
    "Shift limit reached: Only one shift per day is allowed. " +
      "Your shift for today has been completed. " +
      "You can start a new shift tomorrow.",
    { autoClose: 7000 }
  );
}
```

## What Users Will See

### Before Fix

❌ "Failed to start shift: ShiftReport already started for today!"

- Confusing
- Doesn't explain the rule
- Users don't know what to do

### After Fix ✅

"Shift limit reached: Only one shift per day is allowed. Your shift for today has been completed. You can start a new shift tomorrow."

- Clear business rule explanation
- Confirms their shift is complete
- Tells them when they can start next shift
- Longer display time (7 seconds) so they can read it

## Business Rule

**One Shift Per Cashier Per Calendar Day**

- Cashier starts shift at any time today → ✅
- Cashier ends that shift → ✅
- Cashier tries to start another shift same day → ❌ Not allowed
- Cashier tries to start shift tomorrow → ✅ Allowed

## When Does This Happen?

1. **Split Shift Attempt**: Cashier works morning, ends shift, tries to work evening
2. **Test/Demo**: Starting and ending shifts multiple times for testing
3. **Mistake**: Accidentally ending shift early and trying to restart

## What to Tell Users

"Only one shift is allowed per day. If you ended your shift by mistake, please contact your manager. Otherwise, you can start a new shift tomorrow."

## For Development/Testing

If you need to test multiple shifts in one day:

### Option 1: Wait Until Midnight

- Simple but time-consuming

### Option 2: Manually Delete Shift in Database

```sql
DELETE FROM shift_reports
WHERE cashier_id = 'your-cashier-id'
AND DATE(shift_start) = CURDATE();
```

### Option 3: Use Different Cashier Account

- Each cashier can have one shift per day
- Create multiple test cashiers

## If Business Needs Change

If the business decides to allow multiple shifts per day, the backend code needs to be modified:

**File**: `ShiftReportServiceImpl.java`

**Current** (prevents multiple shifts per day):

```java
Optional<ShiftReport> existing = shiftReportRepository.findByCashierAndShiftStartBetween(
    currentUser, startOfDay, endOfDay
);

if(existing.isPresent()) {
    throw new Exception("ShiftReport already started for today!");
}
```

**Change to** (only prevents overlapping active shifts):

```java
Optional<ShiftReport> activeShift = shiftReportRepository
    .findTopByCashierAndShiftEndIsNullOrderByShiftStartDesc(currentUser);

if(activeShift.isPresent()) {
    throw new Exception("You have an active shift. Please end it before starting a new one.");
}
```

## Status

✅ **FIXED** - Clear error message now explains the one-shift-per-day business rule.
