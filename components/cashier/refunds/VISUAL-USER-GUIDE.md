# Refund Form - Visual User Guide

## Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Process Return & Refund                                        │
│  Select customer and order to issue a refund                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔄 Refund Information                                    │   │
│  │                                                          │   │
│  │ 👤 Select Customer *                                     │   │
│  │ ┌──────────────────────────────────────────────────┐    │   │
│  │ │ John Doe                              ▼          │    │   │
│  │ └──────────────────────────────────────────────────┘    │   │
│  │ Email: john@example.com | Phone: +1234567890            │   │
│  │                                                          │   │
│  │ 🔍 Select Order *                                        │   │
│  │ ┌──────────────────────────────────────────────────┐    │   │
│  │ │ Order #12345 - $99.99                 ▼          │    │   │
│  │ └──────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │ ┌────────────────────────────────────────────────┐      │   │
│  │ │ Order Details                                  │      │   │
│  │ │                                                │      │   │
│  │ │ Order Number    Order Date                    │      │   │
│  │ │ #12345          Oct 15, 2025                  │      │   │
│  │ │                                                │      │   │
│  │ │ Payment Method  Status                        │      │   │
│  │ │ [CASH]          [COMPLETED]                   │      │   │
│  │ │                                                │      │   │
│  │ │ Items                                         │      │   │
│  │ │ ┌────────────────────────────────────────┐   │      │   │
│  │ │ │ Product    Qty  Price    Total         │   │      │   │
│  │ │ │ T-Shirt     2   $25.00   $50.00        │   │      │   │
│  │ │ │ Jeans       1   $49.99   $49.99        │   │      │   │
│  │ │ └────────────────────────────────────────┘   │      │   │
│  │ │                                                │      │   │
│  │ │ Subtotal                            $99.99    │      │   │
│  │ │ Tax                                  $0.00    │      │   │
│  │ │ ────────────────────────────────────────────  │      │   │
│  │ │ Order Total                         $99.99    │      │   │
│  │ └────────────────────────────────────────────────┘      │   │
│  │                                                          │   │
│  │ 💵 Refund Amount *                                       │   │
│  │ ┌──────────────────────────────────────────────────┐    │   │
│  │ │ 99.99                                            │    │   │
│  │ └──────────────────────────────────────────────────┘    │   │
│  │ Maximum refund amount: $99.99                           │   │
│  │                                                          │   │
│  │ ⚠️ Refund Reason *                                       │   │
│  │ ┌──────────────────────────────────────────────────┐    │   │
│  │ │ Product was damaged during shipping              │    │   │
│  │ │                                                  │    │   │
│  │ │                                                  │    │   │
│  │ └──────────────────────────────────────────────────┘    │   │
│  │ Provide a clear explanation for the refund              │   │
│  │                                                          │   │
│  │ ┌──────────────────────┐  ┌─────────────┐              │   │
│  │ │  Process Refund      │  │ Clear Form  │              │   │
│  │ └──────────────────────┘  └─────────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Customer Dropdown (Opened)

```
┌──────────────────────────────────────────────────┐
│ 👤 Select Customer *                             │
│ ┌──────────────────────────────────────────────┐ │
│ │ [Dropdown Open]                      ▲       │ │
│ └──┬───────────────────────────────────────────┘ │
│    │                                              │
│    │ ┌────────────────────────────────────────┐  │
│    │ │ 🔍 Search customer...                  │  │
│    │ ├────────────────────────────────────────┤  │
│    │ │ ✓ John Doe                             │  │ ← Selected
│    │ │   john@example.com · +1234567890       │  │
│    │ ├────────────────────────────────────────┤  │
│    │ │   Jane Smith                           │  │
│    │ │   jane@example.com · +0987654321       │  │
│    │ ├────────────────────────────────────────┤  │
│    │ │   Bob Johnson                          │  │
│    │ │   bob@example.com · +1122334455        │  │
│    │ └────────────────────────────────────────┘  │
│                                                   │
└───────────────────────────────────────────────────┘
```

## Order Dropdown (Opened)

```
┌──────────────────────────────────────────────────┐
│ 🔍 Select Order *                                │
│ ┌──────────────────────────────────────────────┐ │
│ │ [Dropdown Open]                      ▲       │ │
│ └──┬───────────────────────────────────────────┘ │
│    │                                              │
│    │ ┌────────────────────────────────────────┐  │
│    │ │ 🔍 Search order...                     │  │
│    │ ├────────────────────────────────────────┤  │
│    │ │ ✓ Order #12345              $99.99     │  │ ← Selected
│    │ │   Oct 15, 2025 · CASH · 2 items        │  │
│    │ ├────────────────────────────────────────┤  │
│    │ │   Order #12344              $149.50    │  │
│    │ │   Oct 14, 2025 · CARD · 3 items        │  │
│    │ ├────────────────────────────────────────┤  │
│    │ │   Order #12343              $75.00     │  │
│    │ │   Oct 13, 2025 · UPI · 1 items         │  │
│    │ └────────────────────────────────────────┘  │
│                                                   │
└───────────────────────────────────────────────────┘
```

## Empty States

### No Customer Selected

```
┌──────────────────────────────────────────────────┐
│ 🔍 Select Order *                                │
│ ┌──────────────────────────────────────────────┐ │
│ │ Select customer first...              ▼      │ │ ← Disabled
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### No Orders Found

```
┌────────────────────────────────────────┐
│ 🔍 Search order...                     │
├────────────────────────────────────────┤
│                                        │
│        📄 No orders found              │
│        for this customer.              │
│                                        │
└────────────────────────────────────────┘
```

### No Customers Found (Search)

```
┌────────────────────────────────────────┐
│ 🔍 Search customer... xyz              │
├────────────────────────────────────────┤
│                                        │
│        👤 No customer found.           │
│                                        │
└────────────────────────────────────────┘
```

## Form States

### Initial Load (Empty Form)

- Customer dropdown: Enabled, "Select customer..."
- Order dropdown: Disabled, "Select customer first..."
- Order details: Hidden
- Refund amount: Disabled, empty
- Refund reason: Disabled, empty
- Submit button: Disabled

### Customer Selected

- Customer dropdown: Shows selected customer
- Order dropdown: Enabled, "Select order..."
- Order details: Hidden
- Refund amount: Disabled, empty
- Refund reason: Disabled, empty
- Submit button: Disabled

### Order Selected

- Customer dropdown: Shows selected customer
- Order dropdown: Shows selected order
- Order details: Visible with full info
- Refund amount: Enabled, pre-filled with order total
- Refund reason: Enabled, empty
- Submit button: Disabled (waiting for reason)

### Form Complete (Valid)

- All fields filled correctly
- Submit button: Enabled, ready to click
- Clear button: Enabled

### Form Submitting

- All fields: Disabled
- Submit button: Shows "Processing..."
- Loading toast: "Processing refund..."

### Form Success

- Success toast: "Refund processed successfully!"
- Form resets
- Redirect to refunds list in 1.5 seconds

### Form Error

- Error toast: Shows error message
- All fields: Re-enabled
- Form data: Preserved for retry
- User can fix and resubmit

## Toast Notifications

### Loading Toast

```
┌─────────────────────────────┐
│ ⏳ Processing refund...     │
└─────────────────────────────┘
```

### Success Toast

```
┌─────────────────────────────────────┐
│ ✅ Refund processed successfully!   │
└─────────────────────────────────────┘
```

### Error Toast

```
┌─────────────────────────────────────┐
│ ❌ Please select a customer         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ❌ Please select an order            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ❌ Refund amount cannot exceed       │
│    order total                       │
└─────────────────────────────────────┘
```

### Info Toast

```
┌─────────────────────────────────────┐
│ ℹ️ No orders found for this customer │
└─────────────────────────────────────┘
```

## Keyboard Navigation

### In Command Dropdowns

- **↑ / ↓**: Navigate through items
- **Enter**: Select highlighted item
- **Escape**: Close dropdown
- **Type**: Filter/search items

### In Form

- **Tab**: Move to next field
- **Shift + Tab**: Move to previous field
- **Enter**: Submit form (when valid)
- **Escape**: Close open dropdowns

## Mobile View

On smaller screens:

- Form takes full width
- Dropdowns stack vertically
- Order details table scrolls horizontally
- Touch-friendly tap targets
- Larger touch areas for dropdowns

## Validation Messages

### Inline (Below Fields)

```
Refund Amount
┌──────────────────────────────┐
│ 150.00                       │
└──────────────────────────────┘
❌ Maximum refund amount: $99.99
```

### Toast Popup

- Used for critical validations
- Appears at top of screen
- Auto-dismisses after 3 seconds
- Can be manually dismissed

## Success Flow Animation

```
1. User clicks "Process Refund"
   │
   ▼
2. Button changes to "Processing..."
   Button becomes disabled
   │
   ▼
3. Loading toast appears
   "⏳ Processing refund..."
   │
   ▼
4. Server processes refund
   │
   ▼
5. Success toast appears
   "✅ Refund processed successfully!"
   │
   ▼
6. Form resets
   All fields cleared
   │
   ▼
7. After 1.5 seconds
   │
   ▼
8. Redirect to refunds list
   /store/cashier/refunds
```

## Color Coding

### Status Badges

- **Completed**: 🟢 Green background
- **Pending**: 🟡 Yellow background
- **Cancelled**: 🔴 Red background

### Payment Method Badges

- All payment methods: Gray outlined badge
- Examples: `[CASH]` `[CARD]` `[UPI]`

### Amounts

- Regular text: Default color
- Discounts: 🟢 Green text (positive for user)
- Totals: Bold text

### Buttons

- Primary action (Process Refund): Blue
- Secondary action (Clear Form): Gray outline
- Disabled: Muted colors with reduced opacity

## Accessibility Indicators

### Required Fields

- Marked with asterisk (\*) in label
- Label: "Select Customer \*"

### Disabled States

- Lighter color
- Cursor changes to "not-allowed"
- Cannot receive focus

### Focus States

- Blue outline around focused element
- Visible keyboard navigation path

### Error States

- Red text for error messages
- Icon (❌) for visual indicator
- ARIA live region announces to screen readers

## Tips for Best UX

1. **Search as you type**: No need to press enter, results filter instantly
2. **Keyboard shortcuts**: Use ↑↓ arrows to navigate, Enter to select
3. **Pre-filled amount**: Refund amount auto-fills with order total
4. **Clear visibility**: Selected items show checkmark ✓
5. **Smart defaults**: Most common refund is full amount
6. **Quick clear**: Clear form button resets everything instantly
7. **Prevent errors**: Fields disabled until prerequisites met
8. **Immediate feedback**: Toast notifications for all actions
