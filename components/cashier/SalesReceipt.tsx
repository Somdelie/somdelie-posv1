import React from "react";
import { formatPrice } from "@/lib/formatPrice";

interface SalesReceiptProps {
  order: {
    id: string;
    orderNumber?: string;
    createdAt: string;
    customer: {
      fullName: string;
      phone: string;
      email?: string;
      address?: string;
    } | null;
    items: {
      productId: string;
      productName: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[];
    subtotal: number;
    tax?: number;
    discount?: number;
    totalAmount: number;
    paymentType: string;
    cashier: {
      fullName: string;
      id: string;
    };
  };
}

export const SalesReceipt = React.forwardRef<HTMLDivElement, SalesReceiptProps>(
  ({ order }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "80mm",
          minHeight: "auto",
          backgroundColor: "#ffffff",
          color: "#000000",
          padding: "16px",
          fontFamily: "Courier New, monospace",
          fontSize: "12px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            SALES RECEIPT
          </h1>
          <p style={{ fontSize: "10px", color: "#6b7280" }}>Your Store Name</p>
          <p style={{ fontSize: "10px", color: "#6b7280" }}>
            123 Business Street, City
          </p>
          <p style={{ fontSize: "10px", color: "#6b7280" }}>
            Phone: (123) 456-7890
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px dashed #000", marginBottom: "12px" }} />

        {/* Order Info */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Receipt #:</span>
            <span style={{ fontWeight: "bold" }}>
              {order.orderNumber || order.id.slice(-8).toUpperCase()}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Date:</span>
            <span>{order.createdAt}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Cashier:</span>
            <span>{order.cashier.fullName}</span>
          </div>
        </div>

        {/* Customer Info */}
        {order.customer && (
          <>
            <div
              style={{ borderTop: "1px dashed #000", marginBottom: "12px" }}
            />
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                CUSTOMER:
              </div>
              <div>{order.customer.fullName}</div>
              <div>{order.customer.phone}</div>
              {order.customer.email && <div>{order.customer.email}</div>}
            </div>
          </>
        )}

        {/* Divider */}
        <div style={{ borderTop: "1px dashed #000", marginBottom: "12px" }} />

        {/* Items */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>ITEMS:</div>
          <table style={{ width: "100%", fontSize: "11px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #000" }}>
                <th style={{ textAlign: "left", paddingBottom: "4px" }}>
                  Item
                </th>
                <th style={{ textAlign: "center", paddingBottom: "4px" }}>
                  Qty
                </th>
                <th style={{ textAlign: "right", paddingBottom: "4px" }}>
                  Price
                </th>
                <th style={{ textAlign: "right", paddingBottom: "4px" }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan={4} style={{ paddingTop: "4px" }}>
                      {item.productName}
                    </td>
                  </tr>
                  <tr
                    style={{
                      borderBottom:
                        index === order.items.length - 1
                          ? "1px solid #000"
                          : "none",
                    }}
                  >
                    <td></td>
                    <td style={{ textAlign: "center", paddingBottom: "4px" }}>
                      {item.quantity}
                    </td>
                    <td style={{ textAlign: "right", paddingBottom: "4px" }}>
                      {formatPrice(item.price)}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        paddingBottom: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      {formatPrice(item.subtotal)}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ marginBottom: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <span>Subtotal:</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.tax && order.tax > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span>Tax:</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
          )}
          {order.discount && order.discount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span>Discount:</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div
            style={{
              borderTop: "1px solid #000",
              paddingTop: "4px",
              marginTop: "4px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                TOTAL:
              </span>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "4px",
            }}
          >
            <span>Payment:</span>
            <span style={{ fontWeight: "bold" }}>{order.paymentType}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px dashed #000", marginBottom: "12px" }} />

        {/* Footer */}
        <div
          style={{ textAlign: "center", fontSize: "10px", color: "#6b7280" }}
        >
          <p style={{ marginBottom: "4px" }}>Thank you for your purchase!</p>
          <p style={{ marginBottom: "4px" }}>Please come again</p>
          <p style={{ marginBottom: "8px" }}>
            Generated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Barcode placeholder */}
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 8px",
              border: "1px solid #000",
              fontSize: "10px",
              fontFamily: "monospace",
            }}
          >
            {order.orderNumber || order.id.slice(-12).toUpperCase()}
          </div>
        </div>
      </div>
    );
  }
);

SalesReceipt.displayName = "SalesReceipt";
