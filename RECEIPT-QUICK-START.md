# Refund Receipt Feature - Quick Start

## ✅ What's Working

### 1. **Print Receipt** 📄

- Click the **Print** button
- Professional A4 receipt opens in print dialog
- Save as PDF via browser or print directly
- Auto-named: `Refund_Receipt_ORD-12345_52956ebb`

### 2. **Download PDF** 💾

- Click the **Download** button
- High-quality PDF generates automatically
- Downloads as: `Refund_Receipt_ORD-12345_52956ebb.pdf`
- Perfect for customer emails or records

## 📋 Receipt Includes

✅ **Header**: Bold "REFUND RECEIPT" title  
✅ **Store Info**: Customizable business details  
✅ **Refund Details**: ID, Date, Status, Method  
✅ **Order Info**: Order #, Date, Payment method  
✅ **Customer**: Name, Phone, Email, Address  
✅ **Items Table**: Products, quantities, amounts  
✅ **Summary**: Total items, refund amount  
✅ **Reason**: Why refund was issued  
✅ **Cashier**: Who processed the refund  
✅ **Terms**: Refund policy & conditions  
✅ **Timestamp**: Auto-generated date/time

## 🎨 Professional Design

```
┌─────────────────────────────────────┐
│         REFUND RECEIPT              │
│   Return & Refund Confirmation      │
├─────────────────────────────────────┤
│                                     │
│        Your Store Name              │
│   123 Business St, City 12345       │
│                                     │
├─────────────────────────────────────┤
│  Refund ID: 52956EBB-724B...        │
│  Order #: ORD-12345                 │
│  Status: COMPLETED                  │
│  Method: CASH                       │
├─────────────────────────────────────┤
│  Customer: John Doe                 │
│  Phone: +1234567890                 │
├─────────────────────────────────────┤
│  Items Returned:                    │
│  • Product #5ab8d063  x1  R1,500    │
│  • Product #2cd686ea  x2  R1,500    │
├─────────────────────────────────────┤
│  Total Refund: R3,000               │
├─────────────────────────────────────┤
│  Reason: Damaged item               │
│  Processed by: Nompumelelo Mlambo   │
├─────────────────────────────────────┤
│  Terms & Conditions...              │
│  Generated: Oct 17, 2025 9:30 PM    │
└─────────────────────────────────────┘
```

## 🚀 How to Use

### As a Cashier

1. Process a refund
2. Navigate to refund details page
3. Click **"Print"** for instant printing
4. OR click **"Download"** for PDF file
5. Give receipt to customer or email it

### Customizing Store Info

Edit: `components/cashier/refunds/RefundReceipt.tsx` (lines 51-55)

```tsx
<h2 className="text-2xl font-bold">Your Actual Store Name</h2>
<p className="text-gray-600">Your Actual Address</p>
<p className="text-gray-600">Phone: Your Phone | Email: Your Email</p>
```

## 📦 Technology Used

- **react-to-print**: Browser print functionality
- **jsPDF**: PDF generation
- **html2canvas**: HTML to image conversion
- **Tailwind CSS**: Professional styling

## 🎯 File Locations

### Core Files

- `components/cashier/refunds/RefundReceipt.tsx` - Receipt template
- `components/cashier/refunds/ReturnDetails.tsx` - Print/Download logic

### Documentation

- `REFUND-RECEIPT-PRINT-PDF.md` - Full documentation
- `REFUND-DETAILS-RBAC.md` - Access control
- `REFUND-CASHIER-NULL-FIX.md` - Cashier handling

## ⚡ Quick Tips

### Better Quality PDF

```tsx
// In ReturnDetails.tsx, change scale from 2 to 3
scale: 3; // Higher = better quality, larger file
```

### Add Store Logo

```tsx
// In RefundReceipt.tsx header section
<img src="/logo.png" alt="Store Logo" className="mx-auto mb-4 h-16" />
```

### Custom Terms

```tsx
// In RefundReceipt.tsx terms section
<li>• Your custom refund policy here</li>
```

## 🧪 Test It Now!

1. Go to: `/store/cashier/refunds/{any-refund-id}`
2. Click **Print** button
3. See the beautiful receipt in print preview
4. Click **Download** button
5. Check your Downloads folder for the PDF

## 🔥 Features Highlight

✅ **One-click printing** - No setup required  
✅ **Auto PDF download** - Perfect for digital records  
✅ **Professional design** - Ready for business use  
✅ **Mobile responsive** - Works on all devices  
✅ **Toast notifications** - User feedback on actions  
✅ **Error handling** - Graceful failure messages  
✅ **High quality** - 2x scale for crisp output  
✅ **Custom naming** - Organized file downloads  
✅ **A4 format** - Standard business size  
✅ **Zero config** - Works out of the box

## 🎉 You're Ready!

Your refund receipts are now production-ready with professional print and PDF capabilities. Customers can receive physical or digital copies of their refund transactions.

**Next Steps**:

- Customize store information
- Add your logo (optional)
- Update terms & conditions
- Test with real refund data
- Share with your team!

---

💡 **Pro Tip**: The browser's "Print to PDF" also works great as an alternative to the Download button!
