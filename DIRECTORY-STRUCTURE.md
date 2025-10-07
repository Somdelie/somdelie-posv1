# Directory Structure - All Role Pages

## Complete Dashboard Structure

```
app/(dashboard)/
│
├── 📁 user/
│   └── 📁 profile/
│       └── 📄 page.tsx ✨ NEW
│           └── Role: ROLE_USER
│           └── Features: User profile, settings
│
├── 📁 cashier/
│   └── 📁 dashboard/
│       └── 📄 page.tsx ✨ NEW
│           └── Role: ROLE_BRANCH_CASHIER
│           └── Features: POS dashboard, sales metrics
│
├── 📁 branch-manager/
│   └── 📄 page.tsx ✨ NEW
│       └── Role: ROLE_BRANCH_MANAGER
│       └── Features: Branch analytics, staff management
│
├── 📁 store-manager/
│   └── 📄 page.tsx ✨ NEW
│       └── Role: ROLE_STORE_MANAGER
│       └── Features: Multi-branch overview, inventory
│
├── 📁 admin/
│   └── 📁 dashboard/
│       └── 📄 page.tsx ✅ EXISTS
│           └── Role: ROLE_SUPER_ADMIN
│           └── Features: System-wide admin panel
│
├── 📁 store/
│   ├── 📁 admin/
│   │   └── 📄 page.tsx ✅ EXISTS
│   │       └── Role: ROLE_STORE_ADMIN
│   │       └── Features: Store management dashboard
│   │
│   ├── 📁 cashier/
│   │   ├── 📄 page.tsx ✅ EXISTS (POS System)
│   │   ├── 📁 customer-lookup/
│   │   ├── 📁 customer-management/
│   │   ├── 📁 orders-history/
│   │   ├── 📁 refunds/
│   │   ├── 📁 summary/
│   │   └── 📁 profile/
│   │
│   └── 📁 branches/
│       └── 📄 page.tsx ✅ EXISTS
│           └── Features: Branch listing
│
└── 📁 super-admin/
    ├── 📄 layout.tsx
    └── 📁 dashboard/
        └── 📄 page.tsx ✅ EXISTS
            └── Role: ROLE_SUPER_ADMIN
            └── Features: Super admin controls
```

## Route Summary

| Role                  | Route                | Status    | Description                     |
| --------------------- | -------------------- | --------- | ------------------------------- |
| `ROLE_USER`           | `/user/profile`      | ✨ NEW    | User profile and settings       |
| `ROLE_BRANCH_CASHIER` | `/cashier/dashboard` | ✨ NEW    | Cashier performance dashboard   |
| `ROLE_BRANCH_MANAGER` | `/branch-manager`    | ✨ NEW    | Branch management and analytics |
| `ROLE_STORE_MANAGER`  | `/store-manager`     | ✨ NEW    | Store-wide management           |
| `ROLE_SUPER_ADMIN`    | `/admin/dashboard`   | ✅ EXISTS | System administration           |
| `ROLE_STORE_ADMIN`    | `/store/admin`       | ✅ EXISTS | Store administration            |

## Additional Routes

| Route                                | Purpose                 | Status    |
| ------------------------------------ | ----------------------- | --------- |
| `/store/cashier`                     | POS System              | ✅ EXISTS |
| `/store/cashier/customer-lookup`     | Find customers          | ✅ EXISTS |
| `/store/cashier/customer-management` | Manage customers        | ✅ EXISTS |
| `/store/cashier/orders-history`      | View order history      | ✅ EXISTS |
| `/store/cashier/refunds`             | Process returns/refunds | ✅ EXISTS |
| `/store/cashier/summary`             | Sales summary           | ✅ EXISTS |
| `/store/branches`                    | Branch management       | ✅ EXISTS |

## Page Features Breakdown

### 1. User Profile (`/user/profile`)

- Personal information display
- Edit profile functionality
- Account settings
- Role display

### 2. Cashier Dashboard (`/cashier/dashboard`)

- **Quick Actions Card**:
  - New Sale → `/store/cashier`
  - Customer Lookup → `/store/cashier/customer-lookup`
  - Returns → `/store/cashier/refunds`
  - Order History → `/store/cashier/orders-history`
- **Today's Performance**:
  - Total Sales (with trend)
  - Transactions Count
  - Average Transaction Value
  - Items Sold
  - Customers Served
- **Recent Transactions**:

  - Transaction ID
  - Amount
  - Time
  - Items count
  - Status badge

- **Real-time Features**:
  - Live clock
  - Shift status indicator

### 3. Branch Manager Dashboard (`/branch-manager`)

- **Key Metrics**:
  - Today's Sales (with comparison)
  - Active Staff / Total Employees
  - Customers Today
  - Low Stock Alerts
- **Sales Overview Tabs**:
  - Daily view
  - Weekly view
  - Monthly view
- **Top Selling Products**:
  - Product ranking (1-5)
  - Units sold
  - Revenue generated
- **Employee Performance**:
  - Employee name & role
  - Transaction count
  - Revenue generated
  - Performance rating (★)
- **Action Buttons**:
  - Generate Report
  - Manage Staff

### 4. Store Manager Dashboard (`/store-manager`)

- **Store Overview**:
  - Total Revenue (with growth %)
  - Total Branches (active count)
  - Total Products (across all branches)
  - Total Staff (company-wide)
- **Branch Performance Comparison**:
  - Branch name
  - Sales amount
  - Growth percentage
  - Status badge (Excellent/Good/Average/Concern)
  - Employee count per branch
  - Trend indicators (↑↓)
- **Inventory Alerts**:
  - Branch name
  - Low stock item count
  - Severity indicator (High/Medium/Low)
  - Color-coded dots
- **Recent Branch Orders**:
  - Order ID
  - Branch name
  - Amount
  - Status
  - Date
- **Action Buttons**:
  - Analytics
  - Manage Branches

## Component Dependencies

All pages use these shared components:

- `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@/components/ui/card`
- `Badge` from `@/components/ui/badge`
- `Button` from `@/components/ui/button`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`
- `DataTableDemo` from `@/components/common/DataTable`
- `useAppSelector` from `@/redux-toolkit/hooks`
- Icons from `lucide-react`

## Responsive Design

All pages are responsive with breakpoints:

- **Mobile**: Single column layout
- **Tablet (sm)**: 2 columns for cards
- **Desktop (lg)**: 4-5 columns for metrics, 2 columns for content sections

## Color Scheme

### Status Colors

- **Green**: Excellent performance, completed items
- **Blue**: Good performance, processing items
- **Yellow**: Average performance, warnings
- **Orange**: Needs attention, stock alerts
- **Red**: Critical issues, urgent actions

### Severity Indicators

- **Red**: High priority
- **Orange**: Medium priority
- **Yellow**: Low priority

---

**Last Updated**: October 6, 2025
**Total Pages Created**: 4 new pages
**Total Routes**: 6 role-based dashboards (all roles covered)
