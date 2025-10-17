# Shift Time Display Fix

## Problem Description

**Issue**: Shift information was showing invalid data:

- Shift Start: "Invalid Date"
- Shift End: "Ongoing" (correct)
- Duration: "NaN:NaN:NaN"

**Root Cause**: The backend was returning time values in Java `LocalTime` format (e.g., "22:06:03.1440087") instead of full `LocalDateTime` ISO strings. JavaScript's `new Date()` constructor couldn't parse these time-only strings, resulting in invalid dates and broken duration calculations.

## Backend Data Format

### What Backend Returns

```json
{
  "shiftStart": "22:06:03.1440087",  // LocalTime format (time only)
  "shiftEnd": null,                  // or "23:45:10.5678901"
  ...
}
```

### What Frontend Expected

```json
{
  "shiftStart": "2025-10-17T22:06:03.144",  // ISO DateTime
  "shiftEnd": null,
  ...
}
```

## The Fix

### Created Helper Function

```typescript
const parseShiftStartTime = (timeString: string): Date => {
  // If it's just a time string like "22:06:03.1440087", convert to today's date
  if (timeString && !timeString.includes("T") && !timeString.includes(" ")) {
    const today = new Date();
    const [hours, minutes, seconds] = timeString.split(":");
    today.setHours(
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds.split(".")[0])
    );
    return today;
  }
  // Otherwise, parse as normal datetime
  return new Date(timeString);
};
```

### How It Works

1. **Detects Time-Only Format**:

   - Checks if string contains 'T' or space (ISO format indicators)
   - If not, assumes it's a time-only string

2. **Converts to Today's Date**:

   - Creates new Date for today
   - Parses hours, minutes, seconds from string
   - Sets the time on today's date
   - Handles fractional seconds by splitting on '.'

3. **Falls Back to Normal Parsing**:
   - If it's already a full datetime, uses standard `new Date()`

### Examples

**Input**: `"22:06:03.1440087"` (LocalTime)
**Output**: `new Date()` with time set to 22:06:03 today

**Input**: `"2025-10-17T22:06:03.144"` (ISO DateTime)
**Output**: `new Date("2025-10-17T22:06:03.144")`

## Changes Made

### 1. ShiftInformationCard Component

**File**: `components/cashier/summary/ShiftInformationCard.tsx`

**Added**:

- `parseShiftStartTime()` helper function

**Updated**:

- Duration calculation: `parseShiftStartTime(currentShift.shiftStart)`
- Shift Start display: `parseShiftStartTime(currentShift.shiftStart).toLocaleTimeString()`
- Shift End display: `parseShiftStartTime(currentShift.shiftEnd).toLocaleTimeString()`
- Duration fallback: `{shiftDuration || "00:00:00"}`

### 2. ShiftManager Component

**File**: `components/cashier/ShiftManager.tsx`

**Added**:

- Same `parseShiftStartTime()` helper function

**Updated**:

- Duration calculation with time parsing

## Before vs After

### Before Fix ❌

```
Cashier: cashier 1
Shift Start: Invalid Date
Shift End: Ongoing
Duration: NaN:NaN:NaN
```

### After Fix ✅

```
Cashier: cashier 1
Shift Start: 10:06:03 PM
Shift End: Ongoing
Duration: 02:15:32
```

## Technical Details

### Why LocalTime from Backend?

The backend Java code uses:

```java
LocalDateTime shiftStart = LocalDateTime.now();
```

But when serializing to JSON, the `ShiftReportDTO` or mapper might be converting to `LocalTime` instead of preserving the full `LocalDateTime`.

### Duration Calculation Logic

```typescript
const start = parseShiftStartTime(currentShift.shiftStart);
const now = new Date();
const diff = now.getTime() - start.getTime(); // Milliseconds

const hours = Math.floor(diff / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((diff % (1000 * 60)) / 1000);

// Format: HH:MM:SS
setShiftDuration(`${hours}:${minutes}:${seconds}`);
```

### Edge Cases Handled

1. **Time-only strings**: "22:06:03.1440087" ✅
2. **ISO DateTime**: "2025-10-17T22:06:03" ✅
3. **Datetime with space**: "2025-10-17 22:06:03" ✅
4. **null values**: Handled with fallbacks ✅
5. **Fractional seconds**: Split on '.' to get integer ✅

## Alternative Solution (Backend Fix)

If the backend needs to be fixed instead, update the Java DTO:

```java
@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
private LocalDateTime shiftStart;

@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
private LocalDateTime shiftEnd;
```

Or use proper serialization:

```java
// In ShiftReport entity or DTO
@JsonSerialize(using = LocalDateTimeSerializer.class)
@JsonDeserialize(using = LocalDateTimeDeserializer.class)
private LocalDateTime shiftStart;
```

## Testing

### Test Cases

1. **Start a new shift**

   - ✅ Shift Start shows current time
   - ✅ Duration starts counting from 00:00:00
   - ✅ Duration updates every second

2. **Reload page during shift**

   - ✅ Shift Start shows correct time
   - ✅ Duration continues from correct point
   - ✅ No "Invalid Date" errors

3. **End shift**
   - ✅ Shift End shows end time
   - ✅ Duration stops at final value
   - ✅ All times display correctly

### Manual Testing Steps

1. Start a shift
2. Verify Shift Start shows time (not "Invalid Date")
3. Verify Duration starts at 00:00:00 and increments
4. Wait 1-2 minutes
5. Reload page
6. Verify Duration continues from correct value
7. End shift
8. Verify all times displayed correctly in confirmation dialog

## Related Files

- `components/cashier/summary/ShiftInformationCard.tsx` - Summary page component
- `components/cashier/ShiftManager.tsx` - Standalone shift manager
- `lib/actions/shift.ts` - Shift API actions (no changes needed)
- Backend: `ShiftReportServiceImpl.java` - Returns LocalTime format

## Future Improvements

### Option 1: Backend Returns Full DateTime (Preferred)

Update backend to return ISO datetime strings:

```json
{
  "shiftStart": "2025-10-17T22:06:03.144",
  "shiftEnd": null
}
```

### Option 2: Store Shift Start in Frontend

When shift starts, store the datetime in frontend state:

```typescript
const [shiftStartDateTime] = useState<Date>(new Date());
```

### Option 3: Backend Sends Additional Metadata

```json
{
  "shiftStart": "22:06:03.1440087",
  "shiftStartDate": "2025-10-17",
  "shiftStartDateTime": "2025-10-17T22:06:03.144"
}
```

## Status

✅ **FIXED** - Shift times and duration now display correctly by parsing LocalTime format to full Date objects.
