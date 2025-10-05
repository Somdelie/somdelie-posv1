"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/formatPrice";
import { ArrowLeftIcon, UserIcon } from "lucide-react";
import React, { useState } from "react";

// Sample order data
const orderData = {
  id: 13,
  orderNumber: "Order 13",
  createdAt: "Jul 12, 2025, 09:47 PM",
  paymentMethod: "CASH",
  customer: {
    name: "Chitrodo Sharma",
    phone: "7659123890",
  },
  totalItems: 2,
  orderTotal: 998.0,
  items: [
    {
      id: "18",
      name: "Men Geometric Print Polo Neck Pure Cotton Black T-Shirt",
      quantity: 1,
      price: 599.0,
      returnQty: 0,
    },
    {
      id: "19",
      name: "Men Slim Fit Checkered Spread Collar Casual Shirt (Pack of 2)",
      quantity: 1,
      price: 399.0,
      returnQty: 0,
    },
  ],
};

export default function ReturnRefundPage() {
  const [returnItems, setReturnItems] = useState(
    orderData.items.map((item) => ({ ...item, returnQty: 0 }))
  );
  const [returnReason, setReturnReason] = useState("");
  const [refundMethod, setRefundMethod] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleReturnQtyChange = (itemId: string, newQty: number) => {
    setReturnItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, returnQty: Math.max(0, Math.min(newQty, item.quantity)) }
          : item
      )
    );
  };

  const handleToggleReturn = (itemId: string) => {
    setReturnItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, returnQty: item.returnQty > 0 ? 0 : item.quantity }
          : item
      )
    );
  };

  const totalRefundAmount = returnItems.reduce(
    (sum, item) => sum + item.price * item.returnQty,
    0
  );

  const itemsBeingReturned = returnItems.filter((item) => item.returnQty > 0);

  const handleProcessRefund = () => {
    if (itemsBeingReturned.length === 0) {
      alert("Please select at least one item to return");
      return;
    }
    if (!returnReason) {
      alert("Please select a return reason");
      return;
    }
    if (!refundMethod) {
      alert("Please select a refund method");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmRefund = () => {
    // Handle refund confirmation logic here
    console.log("Refund confirmed", {
      items: itemsBeingReturned,
      reason: returnReason,
      method: refundMethod,
      amount: totalRefundAmount,
    });
    setShowConfirmDialog(false);
    // Reset or redirect after confirmation
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Return / Refund
          </h1>
          <Button variant="outline" className="gap-2">
            <ArrowLeftIcon className="size-4" />
            Back to Order Search
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Order Information Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {orderData.orderNumber}
                  </h2>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-sm font-semibold">
                    {orderData.paymentMethod}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {orderData.createdAt}
                </p>

                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Customer
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <UserIcon className="size-4" />
                      <span>{orderData.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-sm">
                        {orderData.customer.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Total Items:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {orderData.totalItems}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Order Total:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatPrice(orderData.orderTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Order Items
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderData.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(item.price)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Return Items */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Return Items
                </h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Ordered</TableHead>
                      <TableHead className="text-center">Return Qty</TableHead>
                      <TableHead className="text-right">
                        Refund Amount
                      </TableHead>
                      <TableHead className="text-center">Return?</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.name.substring(0, 20)}...
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={item.returnQty}
                            onChange={(e) =>
                              handleReturnQtyChange(
                                item.id,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16 text-center"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {item.returnQty > 0
                            ? formatPrice(item.price * item.returnQty)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant={item.returnQty > 0 ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleToggleReturn(item.id)}
                          >
                            {item.returnQty > 0 ? "Yes" : "No"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Return Reason */}
                <div className="mt-6 space-y-4">
                  <div>
                    <Label
                      htmlFor="returnReason"
                      className="text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Return Reason
                    </Label>
                    <Select
                      value={returnReason}
                      onValueChange={setReturnReason}
                    >
                      <SelectTrigger id="returnReason" className="mt-2">
                        <SelectValue placeholder="Select a reason..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="damaged">Damaged product</SelectItem>
                        <SelectItem value="defective">
                          Defective product
                        </SelectItem>
                        <SelectItem value="wrong-size">Wrong size</SelectItem>
                        <SelectItem value="wrong-item">Wrong item</SelectItem>
                        <SelectItem value="color-mismatch">
                          Color mismatch
                        </SelectItem>
                        <SelectItem value="quality">Quality issue</SelectItem>
                        <SelectItem value="changed-mind">
                          Customer changed mind
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Refund Method */}
                  <div>
                    <Label
                      htmlFor="refundMethod"
                      className="text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Refund Method
                    </Label>
                    <Select
                      value={refundMethod}
                      onValueChange={setRefundMethod}
                    >
                      <SelectTrigger id="refundMethod" className="mt-2">
                        <SelectValue placeholder="Original Payment Method ()" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">
                          Original Payment Method ({orderData.paymentMethod})
                        </SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Total Refund Amount */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                        Total Refund Amount:
                      </span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {formatPrice(totalRefundAmount)}
                      </span>
                    </div>

                    <Button
                      onClick={handleProcessRefund}
                      disabled={totalRefundAmount === 0}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold"
                    >
                      Process Refund
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Refund</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Refund Amount
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {formatPrice(totalRefundAmount)}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                Refund Details:
              </h4>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <p>
                  <span className="font-medium">Order ID:</span> {orderData.id}
                </p>
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {orderData.customer.name}
                </p>
                <p>
                  <span className="font-medium">Refund Method:</span>{" "}
                  {refundMethod || orderData.paymentMethod}
                </p>
                <p>
                  <span className="font-medium">Return Reason:</span>{" "}
                  {returnReason}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Items Being Returned:
                </h4>
                <div className="space-y-1">
                  {itemsBeingReturned.map((item) => (
                    <p
                      key={item.id}
                      className="text-slate-600 dark:text-slate-400 text-xs"
                    >
                      {item.name.substring(0, 30)}... × {item.returnQty} (
                      {formatPrice(item.price * item.returnQty)})
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRefund}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
