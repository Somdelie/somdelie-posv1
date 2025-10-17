import React from "react";
import { formatPrice } from "@/lib/formatPrice";

interface RefundReceiptProps {
  order: {
    id: number;
    orderNumber: string;
    createdAt: string;
    paymentMethod: string;
    customer: {
      fullName: string;
      phone: string;
      email?: string;
      address?: string;
    };
    totalItems: number;
    orderTotal: number;
    items: {
      id: string;
      name: string;
      quantity: number;
      price: number;
    }[];
    cashier?: {
      fullName: string;
      id: string;
    };
    refund: {
      id: string;
      amount: number;
      reason: string;
      refundMethod: string;
      createdAt: string;
      status?: "COMPLETED" | "PENDING" | "FAILED";
      itemsReturned: {
        id: string;
        name: string;
        quantity: number;
        refundAmount: number;
      }[];
    };
  };
}

export const RefundReceipt = React.forwardRef<
  HTMLDivElement,
  RefundReceiptProps
>(({ order }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          borderBottom: "2px solid #000000",
          paddingBottom: "24px",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}
        >
          REFUND RECEIPT
        </h1>
        <p style={{ fontSize: "18px", color: "#6b7280" }}>
          Return & Refund Confirmation
        </p>
      </div>

      {/* Store Info */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
          Your Store Name
        </h2>
        <p style={{ color: "#6b7280" }}>
          123 Business Street, City, State 12345
        </p>
        <p style={{ color: "#6b7280" }}>
          Phone: (123) 456-7890 | Email: support@store.com
        </p>
      </div>

      {/* Refund Information */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "32px",
          padding: "16px",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
        }}
      >
        <div>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Refund ID</p>
          <p style={{ fontWeight: "bold" }}>
            {order.refund.id.slice(0, 13).toUpperCase()}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Refund Date</p>
          <p style={{ fontWeight: "bold" }}>{order.refund.createdAt}</p>
        </div>
        <div>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Original Order #</p>
          <p style={{ fontWeight: "bold" }}>{order.orderNumber}</p>
        </div>
        <div>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Order Date</p>
          <p style={{ fontWeight: "bold" }}>{order.createdAt}</p>
        </div>
        <div>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Refund Status</p>
          <p style={{ fontWeight: "bold", color: "#16a34a" }}>
            {order.refund.status || "COMPLETED"}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Refund Method</p>
          <p style={{ fontWeight: "bold" }}>{order.refund.refundMethod}</p>
        </div>
      </div>

      {/* Customer Information */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "16px",
            borderBottom: "1px solid #d1d5db",
            paddingBottom: "8px",
          }}
        >
          Customer Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Name</p>
            <p style={{ fontWeight: "600" }}>{order.customer.fullName}</p>
          </div>
          <div>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>Phone</p>
            <p style={{ fontWeight: "600" }}>{order.customer.phone}</p>
          </div>
          {order.customer.email && (
            <div>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>Email</p>
              <p style={{ fontWeight: "600" }}>{order.customer.email}</p>
            </div>
          )}
          {order.customer.address && (
            <div>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>Address</p>
              <p style={{ fontWeight: "600" }}>{order.customer.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items Returned */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "16px",
            borderBottom: "1px solid #d1d5db",
            paddingBottom: "8px",
          }}
        >
          Items Returned
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #d1d5db" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>Item</th>
              <th style={{ textAlign: "center", padding: "8px" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "8px" }}>Unit Price</th>
              <th style={{ textAlign: "right", padding: "8px" }}>
                Refund Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {order.refund.itemsReturned.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px 8px" }}>{item.name}</td>
                <td style={{ textAlign: "center", padding: "12px 8px" }}>
                  {item.quantity}
                </td>
                <td style={{ textAlign: "right", padding: "12px 8px" }}>
                  {formatPrice(item.refundAmount / item.quantity)}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "12px 8px",
                    fontWeight: "600",
                  }}
                >
                  {formatPrice(item.refundAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Summary */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ marginLeft: "auto", maxWidth: "400px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #d1d5db",
            }}
          >
            <span style={{ color: "#6b7280" }}>Total Items Returned:</span>
            <span style={{ fontWeight: "600" }}>
              {order.refund.itemsReturned.reduce(
                (sum, item) => sum + item.quantity,
                0
              )}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #d1d5db",
            }}
          >
            <span style={{ color: "#6b7280" }}>Original Payment Method:</span>
            <span style={{ fontWeight: "600" }}>{order.paymentMethod}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "2px solid #9ca3af",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              Total Refund Amount:
            </span>
            <span
              style={{ fontSize: "20px", fontWeight: "bold", color: "#16a34a" }}
            >
              {formatPrice(order.refund.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Refund Reason */}
      <div
        style={{
          marginBottom: "32px",
          padding: "16px",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
          Refund Reason:
        </p>
        <p style={{ fontWeight: "600" }}>{order.refund.reason}</p>
      </div>

      {/* Processed By */}
      {order.cashier && (
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Processed By:</p>
          <p style={{ fontWeight: "600" }}>{order.cashier.fullName}</p>
        </div>
      )}

      {/* Terms and Conditions */}
      <div
        style={{
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "2px solid #d1d5db",
        }}
      >
        <h4 style={{ fontWeight: "bold", marginBottom: "8px" }}>
          Refund Policy & Terms:
        </h4>
        <ul style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
          <li>
            • The refund will be processed to the original payment method within
            5-7 business days
          </li>
          <li>• This receipt serves as proof of your refund transaction</li>
          <li>• Please retain this receipt for your records</li>
          <li>• For any queries, please contact our customer service</li>
        </ul>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "32px",
          textAlign: "center",
          fontSize: "14px",
          color: "#9ca3af",
          borderTop: "1px solid #d1d5db",
          paddingTop: "16px",
        }}
      >
        <p>Thank you for your business!</p>
        <p style={{ marginTop: "8px" }}>
          This is a computer-generated receipt and does not require a signature
        </p>
        <p style={{ marginTop: "4px" }}>
          Generated on: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
});

RefundReceipt.displayName = "RefundReceipt";
