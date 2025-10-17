# Order History Receipt Reprint Feature

## Overview

Added print and download functionality to the order history page, allowing cashiers to reprint receipts for past orders. This is useful when customers need a duplicate receipt or when the original receipt was not printed during checkout.

## What Was Added

### 1. New Imports

```typescript
import { useRef } from "react";
import { PrinterIcon, DownloadIcon } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SalesReceipt } from "@/components/cashier/SalesReceipt";
```

### 2. New State

```typescript
const receiptRef = useRef<HTMLDivElement>(null);
```

### 3. Print Function

```typescript
const handlePrint = useReactToPrint({
  contentRef: receiptRef,
  documentTitle: `Receipt-${
    selectedOrder?.orderNumber || selectedOrder?.id?.slice(-8)
  }`,
  onAfterPrint: () => {
    toast.success("Receipt printed successfully!");
  },
});
```

### 4. Download PDF Function

```typescript
const handleDownloadPDF = async () => {
  if (!receiptRef.current || !selectedOrder) return;

  try {
    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 302, // 80mm at 96 DPI
      windowHeight: 1000,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200], // Thermal receipt size
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(
      `receipt-${selectedOrder.orderNumber || selectedOrder.id?.slice(-8)}.pdf`
    );

    toast.success("Receipt downloaded successfully!");
  } catch (error) {
    console.error("PDF generation error:", error);
    toast.error("Failed to generate PDF. Please try again.");
  }
};
```

### 5. UI Changes in Order Details Dialog

Added two action buttons at the bottom of the order details dialog:

```tsx
{
  /* Print and Download Actions */
}
<div className="flex gap-3 pt-4 border-t">
  <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
    <PrinterIcon className="size-4" />
    Print Receipt
  </Button>
  <Button
    variant="outline"
    className="flex-1 gap-2"
    onClick={handleDownloadPDF}
  >
    <DownloadIcon className="size-4" />
    Download PDF
  </Button>
</div>;
```

### 6. Hidden Receipt Component

Added at the end of the component (off-screen for printing/PDF generation):

```tsx
{
  /* Hidden Receipt Component for Printing/PDF */
}
{
  selectedOrder && (
    <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
      <SalesReceipt
        ref={receiptRef}
        order={{
          ...selectedOrder,
          items: selectedOrder.items.map((item) => ({
            productId: item.productId,
            productName: item.productName || item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
          cashier: {
            fullName: "Store Cashier",
            id: userId,
          },
        }}
      />
    </div>
  );
}
```

## How It Works

### User Flow:

1. Cashier navigates to Order History page
2. Searches for an order (by order number, customer name, etc.)
3. Clicks "View Details" (eye icon) on any order
4. Order details dialog opens showing complete order information
5. At the bottom of the dialog, two buttons are available:
   - **Print Receipt**: Opens browser print dialog
   - **Download PDF**: Downloads thermal receipt as PDF

### Data Transformation:

The `Order` type from the backend doesn't include a `cashier` property, so we transform the data:

- Map items to include `productName` and calculated `subtotal`
- Add cashier info with userId and generic name "Store Cashier"
- Pass all other order properties as-is

### Off-Screen Rendering:

The receipt is rendered off-screen using:

```css
className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none"
```

This ensures:

- Element stays in DOM for html2canvas to capture
- Not visible to users
- Doesn't interfere with UI interactions

## Use Cases

### 1. Customer Lost Receipt

Customer returns to store needing proof of purchase:

- Search for order by date/customer name
- View order details
- Print duplicate receipt

### 2. Missed Print During Checkout

Cashier closes the success dialog before printing:

- Go to order history
- Find the recent order
- Print receipt from history

### 3. Record Keeping

Store needs PDF records of transactions:

- View order details
- Download as PDF
- Attach to accounting records

### 4. Email/Share Receipt

Customer wants receipt sent digitally:

- Download receipt as PDF
- Email PDF to customer

## Technical Notes

### Same Pattern as POS Checkout

- Uses identical `SalesReceipt` component
- Same print/PDF functions
- Consistent thermal format (80mm)
- Inline RGB/HEX styles (no Tailwind lab() colors)

### Error Handling

- Validates receiptRef and selectedOrder before processing
- Try-catch blocks for PDF generation
- User-friendly error messages via toast notifications
- Console logging for debugging

### Performance

- Receipt component only renders when order is selected
- Off-screen rendering has minimal performance impact
- PDF generation happens on-demand

## Future Enhancements

### Short-term:

1. Fetch actual cashier name from order data (when backend includes it)
2. Add email receipt feature
3. Add receipt customization options

### Long-term:

1. Bulk print receipts for multiple orders
2. Custom receipt templates
3. SMS receipt option
4. Receipt history/reprint log

## Related Files

- `components/cashier/order-history/OrderHistoryTable.tsx` - Main component with reprint feature
- `components/cashier/SalesReceipt.tsx` - Thermal receipt component (shared)
- `components/cashier/POSClient.tsx` - Original print/download implementation
- `SALES-RECEIPT-IMPLEMENTATION.md` - Original sales receipt documentation
- `PDF-GENERATION-FIX.md` - Technical documentation for PDF issues

## Testing Checklist

- [ ] Search for an order in history
- [ ] Click "View Details" to open dialog
- [ ] Verify order details display correctly
- [ ] Click "Print Receipt" button
  - [ ] Print dialog opens
  - [ ] Receipt preview looks correct
  - [ ] Print successfully
  - [ ] Success toast appears
- [ ] Click "Download PDF" button
  - [ ] PDF downloads with correct filename
  - [ ] PDF opens and displays correctly
  - [ ] Thermal format (80mm) is correct
  - [ ] Success toast appears
- [ ] Test with different order types:
  - [ ] Cash payment
  - [ ] Card payment
  - [ ] Mobile payment
  - [ ] With customer info
  - [ ] Walk-in customer
  - [ ] With tax/discount
  - [ ] Without tax/discount

## Status

✅ **COMPLETE** - Receipt reprint feature fully implemented in order history page.
