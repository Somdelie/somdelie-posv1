# Product Name Not Showing in Refund Details

## Problem

The refund details page is showing product IDs (UUIDs) instead of product names in the "Items Returned" table:

```
Item Name: 5ab8d063-bbf5-4499-b0d6-8ebd6a2dc38c  ❌ (shows UUID)
Item Name: 2cd686ea-1727-4391-8c1f-8f8064277c99  ❌ (shows UUID)
```

Expected:

```
Item Name: Men's Formal Shirt  ✅ (shows product name)
Item Name: Women's Dress       ✅ (shows product name)
```

## Root Cause

The backend API is **not populating `productName`** in the order items response:

```json
{
  "id": "order-uuid",
  "items": [
    {
      "productId": "5ab8d063-bbf5-4499-b0d6-8ebd6a2dc38c",
      "productName": null, // ❌ This should be populated
      "quantity": 1,
      "price": 1500
    }
  ]
}
```

## Current Frontend Handling

The page tries to handle this with a fallback:

```typescript
// app/(dashboard)/store/cashier/refunds/[id]/page.tsx
items: order.items?.map((item) => ({
  id: item.productId,
  name: item.productName || item.productId, // Falls back to UUID
  quantity: item.quantity,
  price: item.price,
})) || [];
```

Since `item.productName` is `null`, it falls back to `item.productId`, which displays the UUID.

## Backend Fix Required

### Option 1: Eager Fetch Product in Order Items (Recommended)

In your `Order` entity or DTO, ensure product relationship is eagerly loaded:

```java
@Entity
public class OrderItem {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)  // ✅ Add EAGER fetch
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
    private Double price;

    // In DTO mapper
    public OrderItemDTO toDTO() {
        return OrderItemDTO.builder()
            .productId(product.getId())
            .productName(product.getName())  // ✅ Include product name
            .quantity(quantity)
            .price(price)
            .build();
    }
}
```

### Option 2: Include Product Details in Response DTO

Ensure your OrderItemDTO includes product name:

```java
@Data
@Builder
public class OrderItemDTO {
    private UUID productId;
    private String productName;  // ✅ Make sure this is populated
    private Integer quantity;
    private Double price;
    private Double subtotal;
}
```

### Option 3: Use @JsonProperty on Entity

If using entity directly in response:

```java
@Entity
public class OrderItem {
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @JsonProperty("productName")
    public String getProductName() {
        return product != null ? product.getName() : null;
    }
}
```

## Frontend Workaround (Not Recommended)

If you can't fix the backend immediately, you could fetch product names on the frontend:

```typescript
// This adds extra API calls - NOT recommended
const productsResult = await getStoreProducts(user.storeId);
const productsMap = new Map(
  productsResult.products?.map((p) => [p.id, p.name]) || []
);

items: order.items?.map((item) => ({
  id: item.productId,
  name: productsMap.get(item.productId) || item.productName || item.productId,
  quantity: item.quantity,
  price: item.price,
}));
```

**Why this is bad**:

- Adds extra API call
- Slower page load
- Products might be deleted but still in order history
- Unnecessary complexity

## Verify Backend Response

Check your Spring Boot controller response:

```bash
# Test the order endpoint
curl -H "Authorization: Bearer YOUR_JWT" \
  http://localhost:5000/api/orders/{orderId}
```

Expected response:

```json
{
  "id": "1bbad20e-33ff-4d3a-bf29-88ba67dad893",
  "items": [
    {
      "productId": "5ab8d063-bbf5-4499-b0d6-8ebd6a2dc38c",
      "productName": "Men's Formal Shirt", // ✅ Should be populated
      "quantity": 2,
      "price": 1500
    }
  ]
}
```

## Database Check

Verify the data exists in the database:

```sql
-- Check if product names exist
SELECT oi.id, oi.product_id, p.name as product_name, oi.quantity, oi.price
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = '1bbad20e-33ff-4d3a-bf29-88ba67dad893';
```

If product names are in DB but not in API response → Backend mapping issue
If product names are NULL in DB → Data integrity issue

## Related Files

### Frontend

- `app/(dashboard)/store/cashier/refunds/[id]/page.tsx` - Transforms order data
- `components/cashier/refunds/ReturnDetails.tsx` - Displays item names
- `lib/actions/orders.ts` - Order type definition

### Backend (needs fixing)

- `OrderItem.java` entity
- `OrderItemDTO.java` DTO
- `OrderController.java` API response
- Order service/mapper

## Testing After Fix

1. Create a new order with products
2. Create a refund for that order
3. View refund details page
4. Verify product names (not UUIDs) are displayed

## Temporary Display Fix

While waiting for backend fix, you could display a more user-friendly message:

```typescript
// In page.tsx
name: item.productName || `Product #${item.productId.slice(0, 8)}...`,
```

This shows: `Product #5ab8d063...` instead of the full UUID.

## Status

❌ **Backend Issue** - Product name not populated in Order Items API response

**Action Required**: Update backend to include `productName` field when returning order items in GET `/api/orders/{id}` endpoint.

**Priority**: High - Affects user experience in refund details, order history, and order details pages.
