# Analytics System Implementation Guide

## Overview

This document describes the role-based analytics system implementation for the somdelie-posv1 POS application. Each role (Super Admin, Store Admin, Store Manager, Branch Manager, and Cashier) has access to analytics scoped to their authority level.

## Backend Endpoints

The backend provides analytics through the `/api/analytics` endpoints with the following structure:

### Summary Endpoints

- **Global (Super Admin)**: `GET /api/analytics/global/summary?from={date}&to={date}`
- **Store**: `GET /api/analytics/store/{storeId}/summary?from={date}&to={date}`
- **Branch**: `GET /api/analytics/branch/{branchId}/summary?from={date}&to={date}`
- **Cashier**: `GET /api/analytics/cashier/{cashierId}/summary?from={date}&to={date}`

### Daily Totals Endpoints

- **Global (Super Admin)**: `GET /api/analytics/global/daily?from={date}&to={date}`
- **Store**: `GET /api/analytics/store/{storeId}/daily?from={date}&to={date}`
- **Branch**: `GET /api/analytics/branch/{branchId}/daily?from={date}&to={date}`
- **Cashier**: `GET /api/analytics/cashier/{cashierId}/daily?from={date}&to={date}`

### Data Structures

**AnalyticsSummaryDTO**:

```typescript
{
  ordersCount: number;
  totalRevenue: number;
  payments: PaymentBreakdownDTO[];
}
```

**PaymentBreakdownDTO**:

```typescript
{
  paymentType: "CASH" | "CARD" | "MOBILE_MONEY";
  count: number;
  total: number;
}
```

**DailyTotalDTO**:

```typescript
{
  date: string; // YYYY-MM-DD format
  ordersCount: number;
  totalRevenue: number;
}
```

## Frontend Implementation

### Server Actions (`lib/actions/analytics.ts`)

All analytics API calls are handled through server actions that:

- Use JWT authentication from cookies
- Format dates as YYYY-MM-DD for backend
- Handle errors gracefully
- Return typed data structures

**Key Functions**:

- `getGlobalSummary(from, to)` - Super Admin analytics
- `getStoreSummary(storeId, from, to)` - Store-level analytics
- `getBranchSummary(branchId, from, to)` - Branch-level analytics
- `getCashierSummary(cashierId, from, to)` - Cashier-level analytics
- `get*Daily()` variants for daily breakdown data

### Reusable Components

#### 1. `AnalyticsSummaryCards` (`components/analytics/AnalyticsSummaryCards.tsx`)

Displays four key metrics in a grid:

- Total Revenue with order count
- Total Orders with average order value
- Cash Payments breakdown
- Digital Payments (Card + Mobile Money)

**Usage**:

```tsx
<AnalyticsSummaryCards summary={summaryData} period="this period" />
```

#### 2. `PaymentBreakdownCard` (`components/analytics/AnalyticsSummaryCards.tsx`)

Shows detailed payment method breakdown with:

- Payment type icon and label
- Transaction count
- Total amount and percentage

**Usage**:

```tsx
<PaymentBreakdownCard summary={summaryData} />
```

#### 3. `DailyRevenueChart` (`components/analytics/DailyRevenueChart.tsx`)

Bar chart showing daily revenue trend using recharts.

**Usage**:

```tsx
<DailyRevenueChart dailyData={dailyTotals} />
```

#### 4. `DateRangeSelector` (`components/analytics/DateRangeSelector.tsx`)

Quick date range selector with preset options:

- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- This Year

**Usage**:

```tsx
<DateRangeSelector
  onRangeChange={(from, to) => {
    // Handle date range change
  }}
/>
```

### Role-Specific Components

#### 1. `StoreAnalytics` (`components/analytics/StoreAnalytics.tsx`)

For Store Admin and Store Manager roles.

- Fetches store-scoped analytics
- Includes date range selector
- Shows summary cards, chart, and payment breakdown

#### 2. `BranchAnalytics` (`components/analytics/BranchAnalytics.tsx`)

For Branch Manager role.

- Fetches branch-scoped analytics
- Same UI components as store analytics

#### 3. `CashierAnalytics` (`components/analytics/CashierAnalytics.tsx`)

For Cashier role.

- Fetches cashier-scoped analytics
- Shows individual performance metrics

## Role-Based Dashboard Pages

### 1. Super Admin Dashboard

**Path**: `/app/(dashboard)/super-admin/dashboard/page.tsx`

- **Scope**: Global analytics across all stores
- **Features**:
  - Date range selector
  - Summary cards (revenue, orders, payments)
  - Daily revenue chart
  - Payment breakdown
- **API Calls**: `getGlobalSummary()`, `getGlobalDaily()`

### 2. Store Admin Dashboard

**Path**: `/app/(dashboard)/store/admin/page.tsx`

- **Scope**: Single store analytics
- **Features**:
  - Existing store information display
  - Store analytics section (added at bottom)
  - Date range selector
  - Summary cards, chart, payment breakdown
- **API Calls**: `getStoreSummary(storeId)`, `getStoreDaily(storeId)`

### 3. Store Manager Dashboard

**Path**: `/app/(dashboard)/store-manager/page.tsx`

- **Scope**: Store-level analytics
- **Features**: Same as Store Admin analytics
- **API Calls**: `getStoreSummary(storeId)`, `getStoreDaily(storeId)`

### 4. Branch Manager Dashboard

**Path**: `/app/(dashboard)/branch-manager/page.tsx`

- **Scope**: Single branch analytics
- **Features**:
  - Existing branch information display
  - Branch analytics section (added at bottom)
  - Date range selector
  - Summary cards, chart, payment breakdown
- **API Calls**: `getBranchSummary(branchId)`, `getBranchDaily(branchId)`

### 5. Cashier Performance Page

**Path**: `/app/(dashboard)/store/cashier/performance/page.tsx`

- **Scope**: Individual cashier analytics
- **Features**:
  - Date range selector
  - Personal performance metrics
  - Daily trend chart
  - Payment breakdown
- **API Calls**: `getCashierSummary(cashierId)`, `getCashierDaily(cashierId)`
- **Navigation**: Added "My Performance" menu item to cashier sidebar

## Permission Updates

### Sidebar Menu (`components/common/DashboardSidebar.tsx`)

Added "My Performance" menu item to cashier roles:

```typescript
{
  label: "My Performance",
  href: "/store/cashier/performance",
  icon: TrendingUp,
}
```

### Route Permissions

The `/store/cashier/performance` route is covered by the existing `/store/cashier` prefix permission for:

- `ROLE_BRANCH_CASHIER`
- `ROLE_CASHIER`
- All higher roles (Manager, Admin, Super Admin)

## Date Handling

### Frontend → Backend

Dates are converted from JavaScript `Date` objects to `YYYY-MM-DD` format strings:

```typescript
function formatDateForBackend(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
```

### Backend → Frontend

The backend returns `LocalDate` in `YYYY-MM-DD` format, which is parsed by the chart component.

## UI/UX Features

1. **Loading States**: Skeleton loaders during data fetch
2. **Error Handling**: Graceful error messages if data fails to load
3. **Currency Formatting**: Consistent USD formatting with `Intl.NumberFormat`
4. **Responsive Design**: Grid layouts adapt to mobile/tablet/desktop
5. **Date Presets**: Quick selection of common date ranges
6. **Visual Hierarchy**: Card-based layout with icons and color coding
7. **Payment Icons**:
   - Cash: Green banknote icon
   - Card: Blue credit card icon
   - Mobile Money: Purple smartphone icon

## Testing Checklist

- [ ] Super Admin can view global analytics
- [ ] Store Admin can view store analytics
- [ ] Store Manager can view store analytics
- [ ] Branch Manager can view branch analytics
- [ ] Cashier can view personal performance
- [ ] Date range selector updates data correctly
- [ ] All charts render properly with data
- [ ] Empty states display when no data available
- [ ] Currency formatting is consistent
- [ ] Payment breakdown percentages sum to 100%
- [ ] Daily chart handles different date ranges
- [ ] Mobile responsiveness works correctly
- [ ] Loading states appear during fetch
- [ ] Error states display appropriate messages

## Future Enhancements

1. **Custom Date Range**: Calendar picker for arbitrary date ranges
2. **Export Functionality**: Download analytics as PDF/CSV
3. **Comparison Views**: Compare current period vs previous period
4. **Real-time Updates**: WebSocket integration for live data
5. **Advanced Filters**: Filter by payment type, product category, etc.
6. **Predictive Analytics**: Forecast future sales trends
7. **Top Products/Categories**: Most sold items analytics
8. **Customer Analytics**: Repeat customer analysis
9. **Hourly Breakdown**: Peak hours analysis for staffing
10. **Goals/Targets**: Set and track sales goals

## Architecture Benefits

1. **Separation of Concerns**: Server actions handle API, components handle UI
2. **Reusability**: Common components shared across all roles
3. **Type Safety**: Full TypeScript typing from backend to frontend
4. **Security**: All API calls use JWT authentication from cookies
5. **Performance**: Parallel data fetching, client-side date filtering
6. **Maintainability**: Single source of truth for analytics logic
7. **Scalability**: Easy to add new roles or analytics scopes

## Dependencies

- **recharts**: ^2.x - Chart rendering library
- **lucide-react**: Icons for UI components
- **shadcn/ui**: UI component library (Card, Button, Skeleton, etc.)

## Related Files

**Server Actions**:

- `lib/actions/analytics.ts`

**Components**:

- `components/analytics/AnalyticsSummaryCards.tsx`
- `components/analytics/DailyRevenueChart.tsx`
- `components/analytics/DateRangeSelector.tsx`
- `components/analytics/StoreAnalytics.tsx`
- `components/analytics/BranchAnalytics.tsx`
- `components/analytics/CashierAnalytics.tsx`

**Pages**:

- `app/(dashboard)/super-admin/dashboard/page.tsx`
- `app/(dashboard)/store/admin/page.tsx`
- `app/(dashboard)/store-manager/page.tsx`
- `app/(dashboard)/branch-manager/page.tsx`
- `app/(dashboard)/store/cashier/performance/page.tsx`

**Configuration**:

- `components/common/DashboardSidebar.tsx` - Menu items
- `lib/auth/permissions.ts` - Route permissions

## Summary

This analytics system provides comprehensive, role-based insights into business performance. Each role sees data scoped to their authority level, with a consistent UI experience across all dashboards. The modular architecture makes it easy to extend with new features while maintaining code quality and type safety.
