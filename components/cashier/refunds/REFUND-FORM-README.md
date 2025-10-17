# Refund Form - Implementation Summary

## Overview

Complete refund processing form with searchable customer and order selection using shadcn/ui Command component for a better UX.

## Components Used

### shadcn/ui Components

- **Command**: Searchable dropdown component
- **Popover**: Dropdown container for Command
- **Table**: Display order items
- **Card**: Layout and sections
- **Button**: Actions and triggers
- **Input**: Text and number inputs
- **Textarea**: Multi-line refund reason
- **Label**: Form labels
- **Badge**: Status and payment method indicators

### Icons (Lucide React)

- `RefreshCcw`: Refund header
- `User`: Customer selection
- `Search`: Order selection
- `DollarSign`: Amount input
- `AlertCircle`: Reason input
- `Check`: Selected item indicator
- `ChevronsUpDown`: Dropdown indicator

## Features Implemented

### 1. Customer Selection with Command Component

```tsx
<Command>
  <CommandInput placeholder="Search customer..." />
  <CommandList>
    <CommandEmpty>No customer found.</CommandEmpty>
    <CommandGroup>
      {customers.map((customer) => (
        <CommandItem>
          <Check /> {/* Show if selected */}
          <div>
            <p>{customer.fullName}</p>
            <p>
              {customer.email} · {customer.phone}
            </p>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  </CommandList>
</Command>
```

**Features:**

- ✅ Searchable dropdown with real-time filtering
- ✅ Displays customer name, email, and phone
- ✅ Shows selected customer with checkmark
- ✅ Auto-closes on selection
- ✅ Loads all customers on component mount

### 2. Order Selection with Command Component

```tsx
<Command>
  <CommandInput placeholder="Search order..." />
  <CommandList>
    <CommandEmpty>No orders found for this customer.</CommandEmpty>
    <CommandGroup>
      {orders.map((order) => (
        <CommandItem>
          <Check /> {/* Show if selected */}
          <div>
            <p>Order #{order.orderNumber}</p>
            <p>Date · Payment Method · Items count</p>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  </CommandList>
</Command>
```

**Features:**

- ✅ Searchable dropdown for orders
- ✅ Disabled until customer is selected
- ✅ Auto-fetches orders when customer is selected
- ✅ Displays order number, date, payment method, and item count
- ✅ Shows order total in list
- ✅ Shows selected order with checkmark
- ✅ Auto-closes on selection

### 3. Order Details Display

When an order is selected, shows:

- Order number and date
- Payment method and status badges
- Complete item list in a table
  - Product name
  - Quantity
  - Unit price
  - Line total
- Order totals breakdown:
  - Subtotal
  - Tax (if applicable)
  - Discount (if applicable)
  - Final total

### 4. Refund Amount Input

- Pre-filled with order total when order is selected
- Can be edited to partial refund amount
- Validates maximum refund (cannot exceed order total)
- Number input with step of 0.01
- Shows maximum refund amount hint

### 5. Refund Reason Textarea

- Multi-line text input
- Required field
- Placeholder with examples
- Disabled until order is selected

### 6. Form Validation

- ✅ Customer must be selected
- ✅ Order must be selected
- ✅ Refund amount must be valid number > 0
- ✅ Refund amount cannot exceed order total
- ✅ Reason must not be empty
- ✅ Submit button disabled until all validations pass

### 7. Form Actions

- **Process Refund**: Creates refund and redirects to refunds list
- **Clear Form**: Resets all fields
- Loading states during processing
- Toast notifications for feedback

## Data Flow

### 1. Component Mount

```
1. Fetch all customers → setCustomers()
2. Show customer dropdown ready
```

### 2. Customer Selection

```
1. User selects customer
2. setSelectedCustomer(customerId)
3. useEffect triggers → fetchOrders()
4. Filter orders by customerId
5. setOrders() with filtered results
6. Show order dropdown ready
```

### 3. Order Selection

```
1. User selects order
2. setSelectedOrder(orderId)
3. useEffect triggers → Update refund amount
4. setRefundAmount(order.total)
5. Display order details card
```

### 4. Form Submission

```
1. Validate all fields
2. Show loading toast
3. Call createRefund() server action
4. On success:
   - Update toast to success
   - Reset form
   - Redirect to /store/cashier/refunds
5. On error:
   - Update toast to error
   - Keep form data for retry
```

## Server Actions Used

### From `lib/actions/customers.ts`

- **getCustomers()**: Fetch all customers for selection

### From `lib/actions/orders.ts`

- **getOrdersByStore(storeId)**: Fetch all store orders, then filter by customer

### From `lib/actions/refunds.ts`

- **createRefund(data)**: Process the refund
  ```typescript
  {
    orderId: string;
    amount: number;
    reason: string;
  }
  ```

## Component Props

```typescript
type ReturnRefundFormClientProps = {
  userId: string; // Cashier ID
  storeId: string; // Store ID for fetching orders
};
```

## State Management

```typescript
// Data states
const [customers, setCustomers] = useState<Customer[]>([]);
const [orders, setOrders] = useState<Order[]>([]);

// Loading states
const [loadingCustomers, setLoadingCustomers] = useState(false);
const [loadingOrders, setLoadingOrders] = useState(false);
const [processing, setProcessing] = useState(false);

// Form states
const [selectedCustomer, setSelectedCustomer] = useState<string>("");
const [selectedOrder, setSelectedOrder] = useState<string>("");
const [refundAmount, setRefundAmount] = useState<string>("");
const [refundReason, setRefundReason] = useState<string>("");

// Popover states
const [openCustomer, setOpenCustomer] = useState(false);
const [openOrder, setOpenOrder] = useState(false);
```

## Usage

### Page Component (Server)

```tsx
// app/(dashboard)/store/cashier/refunds/new/page.tsx
import { getCurrentUser } from "@/lib/actions/auth";
import ReturnRefundFormClient from "@/components/cashier/refunds/ReturnRefundFormClient";

export default async function ReturnRefundPage() {
  const user = await getCurrentUser();

  if (!user?.storeId) {
    redirect("/store/cashier/refunds");
  }

  return <ReturnRefundFormClient userId={user.id} storeId={user.storeId} />;
}
```

## Command Component Benefits

### Before (Regular Select)

- Limited search capability
- No multi-line item display
- Basic dropdown UI
- Limited customization

### After (Command Component)

- ✅ Full-text search across all fields
- ✅ Multi-line item display with metadata
- ✅ Rich UI with icons and badges
- ✅ Keyboard navigation support
- ✅ Better UX for large lists
- ✅ Consistent with modern UI patterns

## Toast Notifications

### Success Messages

- "Refund processed successfully!"
- "Found X orders" (when using date filter)

### Error Messages

- "Please select a customer"
- "Please select an order"
- "Please provide a reason for the refund"
- "Please enter a valid refund amount"
- "Refund amount cannot exceed order total"
- "Failed to fetch customers"
- "Failed to fetch orders"
- "Failed to process refund"

### Info Messages

- "No orders found for this customer"

## Styling Features

- Responsive grid layout
- Muted backgrounds for cards
- Color-coded badges
- Disabled states with opacity
- Loading states with disabled inputs
- Hover effects on command items
- Border and shadow on popover
- Proper spacing and padding throughout

## Future Enhancements

- [ ] Partial refund with item selection
- [ ] Multiple refund methods (cash, card, store credit)
- [ ] Refund approval workflow
- [ ] Print refund receipt
- [ ] Email refund confirmation to customer
- [ ] Barcode scanning for order lookup
- [ ] Recent orders quick access
- [ ] Refund templates for common reasons
- [ ] Attachment support (photos of damaged items)
- [ ] Refund history for customer

## API Endpoints Used

- `GET /api/customers` - Fetch all customers
- `GET /api/orders/store/{storeId}` - Fetch store orders (filtered by customer)
- `POST /api/refunds` - Create refund

## Error Handling

- Network errors caught and displayed as toasts
- Validation errors prevent form submission
- Loading states prevent double submission
- Form reset on successful submission
- Redirect timeout for UX smoothness

## Installation Command Used

```powershell
pnpm dlx shadcn@latest add command
```

This installed/verified:

- `components/ui/command.tsx`
- `components/ui/dialog.tsx` (dependency)

## Dependencies

```json
{
  "react": "^19.x",
  "next": "^15.x",
  "lucide-react": "^0.x",
  "react-toastify": "^10.x",
  "@radix-ui/react-popover": "^1.x",
  "@radix-ui/react-dialog": "^1.x",
  "cmdk": "^1.x" // Command component
}
```
