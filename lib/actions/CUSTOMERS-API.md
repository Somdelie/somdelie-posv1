# Customers API Documentation

## Available Server Actions

All functions are located in `lib/actions/customers.ts`

### 1. Get All Customers

```typescript
getCustomers();
```

**Endpoint:** `GET /api/customers`

---

### 2. Get Customer by ID

```typescript
getCustomerById(customerId: string)
```

**Endpoint:** `GET /api/customers/{customerId}`

---

### 3. Create Customer

```typescript
createCustomer(data: CreateCustomerData)
```

**Endpoint:** `POST /api/customers`

**Payload:**

```json
{
  "fullName": "Thamie Moyo",
  "email": "ndumiso@gmail.com",
  "phone": "0603121981",
  "address": "57 jolex road kew"
}
```

**Required Fields:**

- `fullName` ✅
- `email` ✅
- `phone` ✅

**Optional Fields:**

- `address`

---

### 4. Update Customer

```typescript
updateCustomer(customerId: string, data: UpdateCustomerData)
```

**Endpoint:** `PUT /api/customers/{customerId}`

**Payload (all fields optional):**

```json
{
  "fullName": "Updated Name",
  "email": "updated@email.com",
  "phone": "0123456789",
  "address": "New address"
}
```

---

### 5. Delete Customer

```typescript
deleteCustomer(customerId: string)
```

**Endpoint:** `DELETE /api/customers/{customerId}`

---

## Type Definitions

```typescript
type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CreateCustomerData = {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
};

type UpdateCustomerData = {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
};
```

---

## POS Integration

The POS system now includes customer selection and creation:

### Features:

1. **Customer Dropdown** - Select from existing customers
2. **Walk-in Option** - Default for customers without selection
3. **Add New Customer** - Button opens creation dialog
4. **Auto-select** - Newly created customers are auto-selected
5. **Customer Display** - Shows name, phone, and email in dropdown

### Customer Selection Flow:

1. Click **Checkout** button in POS
2. **Select Customer** dropdown appears
3. Choose existing customer OR click **New Customer**
4. If creating new:
   - Fill in: Full Name (required)
   - Fill in: Email (required)
   - Fill in: Phone (required)
   - Fill in: Address (optional)
   - Click **Create Customer**
5. New customer is automatically selected
6. Complete order with selected customer

### UI Components:

```tsx
// Customer Selection in Checkout Dialog
<Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
  <SelectTrigger>
    <SelectValue placeholder="Walk-in Customer" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="">Walk-in Customer</SelectItem>
    {customers.map(customer => (
      <SelectItem key={customer.id} value={customer.id}>
        {customer.fullName} • {customer.phone}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

// New Customer Button
<Button onClick={() => setShowCustomerDialog(true)}>
  <UserPlusIcon /> New Customer
</Button>
```

---

## Usage Examples

### In POS Client Component:

```tsx
// Fetch all customers
const result = await getCustomers();
if (result.success && result.data) {
  setCustomers(result.data);
}

// Create new customer
const newCustomer = await createCustomer({
  fullName: "Thamie Moyo",
  email: "ndumiso@gmail.com",
  phone: "0603121981",
  address: "57 jolex road kew",
});

// Use in order
const orderData = {
  customerId: selectedCustomer || undefined,
  customerName: customer?.fullName || "Walk-in Customer",
  // ... other order fields
};
```

### In Server Component:

```tsx
import { getCustomers } from "@/lib/actions/customers";

export default async function CustomersPage() {
  const result = await getCustomers();

  return (
    <div>
      {result.data?.map((customer) => (
        <div key={customer.id}>
          {customer.fullName} - {customer.email}
        </div>
      ))}
    </div>
  );
}
```

---

## Validation

### Client-side validation in POS:

- Full Name: Required, cannot be empty
- Email: Required, must be valid email format
- Phone: Required, cannot be empty
- Address: Optional

### Error Handling:

```typescript
if (!newCustomer.fullName.trim()) {
  toast.error("Customer name is required");
  return;
}
if (!newCustomer.email.trim()) {
  toast.error("Customer email is required");
  return;
}
if (!newCustomer.phone.trim()) {
  toast.error("Customer phone is required");
  return;
}
```

---

## Notes

- All endpoints require JWT authentication via cookies
- Customer selection is optional (defaults to "Walk-in Customer")
- New customers are immediately available in the dropdown
- Customer data persists across orders
- Email and phone should be unique (validate on backend)
