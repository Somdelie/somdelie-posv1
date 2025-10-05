"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatPrice } from "@/lib/formatPrice";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CopyIcon,
  CreditCardIcon,
  PackageIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface OrdersProps {
  createdAt: string;
  totalAmount: number;
  id?: number;
  status: string;
  paymentMethod: string | "CASH";
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: string;
  trackingNumber?: string;
}

const PurchaseHistory = ({ orders }: { orders: OrdersProps[] }) => {
  const [selectedOrder, setSelectedOrder] = useState<OrdersProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to get badge variant/className based on status
  const getBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // function to get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method.toUpperCase()) {
      case "CASH":
        return (
          <Image
            src="/dollar.png"
            alt="Cash"
            width={24}
            height={24}
            className="inline mr-1"
          />
        );
      case "CARD":
        return (
          <Image
            src="/credit-card.png"
            alt="Card"
            width={24}
            height={24}
            className="inline mr-1"
          />
        );
      case "UPI":
        return (
          <Image
            src="/secure-payment.png"
            alt="UPI"
            width={24}
            height={24}
            className="inline mr-1"
          />
        );
      default:
        return (
          <Image
            src="/dollar.png"
            alt="Default"
            width={24}
            height={24}
            className="inline mr-1"
          />
        );
    }
  };

  const handleOrderClick = (order: OrdersProps) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 border-t pb-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {orders.map((order, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-2 hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors"
                onClick={() => handleOrderClick(order)}
              >
                <p>Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  <CalendarIcon className="size-4 inline mr-1" />
                  {order.createdAt}
                </p>
                <div className="">
                  <p className="font-semibold text-lg text-accent">
                    {formatPrice(order.totalAmount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getPaymentMethodIcon(order.paymentMethod)}
                    {order.paymentMethod}
                  </p>
                </div>
                <Badge className={getBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[50%] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="flex items-center gap-3 text-xl md:text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PackageIcon className="size-5 md:size-6 text-primary" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span>Order Details</span>
                <span className="text-base text-muted-foreground">
                  #{selectedOrder?.id}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Complete information about your order and its current status
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-8 pt-4">
              {/* Order Summary Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded p-6 border border-blue-200/50 dark:border-blue-800/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <CalendarIcon className="size-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">
                      Order Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Order Date:
                      </span>
                      <span className="font-semibold text-blue-900 dark:text-blue-100">
                        {selectedOrder.createdAt}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Status:
                      </span>
                      <Badge
                        className={`${getBadgeVariant(
                          selectedOrder.status
                        )} font-semibold px-3 py-1`}
                      >
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-blue-200/50 dark:border-blue-700/30">
                      <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Total Amount:
                      </span>
                      <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
                        {formatPrice(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment & Shipping Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded p-6 border border-emerald-200/50 dark:border-emerald-800/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <CreditCardIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-emerald-900 dark:text-emerald-100">
                      Payment & Shipping
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                        Payment Method:
                      </span>
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(selectedOrder.paymentMethod)}
                        <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                          {selectedOrder.paymentMethod}
                        </span>
                      </div>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                          Tracking:
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-md text-emerald-900 dark:text-emerald-100">
                            {selectedOrder.trackingNumber}
                          </span>
                          <Button className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                            <CopyIcon className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedOrder.shippingAddress && (
                      <div className="space-y-2">
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                          Shipping Address:
                        </span>
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3">
                          <p className="text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed">
                            {selectedOrder.shippingAddress}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded p-6 border border-purple-200/50 dark:border-purple-800/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
                      <TruckIcon className="size-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-100">
                      Order Items ({selectedOrder.items.length})
                    </h3>
                  </div>
                  <div className="grid gap-4">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4 bg-red-100 dark:bg-purple-900/20 rounded border border-purple-200/30 dark:border-teal-700/30 hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-teal-900 dark:text-teal-100 mb-1">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-teal-700 dark:text-teal-300">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Qty:</span>
                              <span className="bg-teal-100 dark:bg-purple-900/40 px-2 py-1 rounded">
                                {item.quantity}
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Unit Price:</span>
                              <span>{formatPrice(item.price)}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Status Timeline */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded p-6 border border-amber-200/50 dark:border-amber-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded">
                    <ClockIcon className="size-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-amber-900 dark:text-amber-100">
                    Order Status
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 bg-white/60 dark:bg-amber-900/20 rounded border border-amber-200/30 dark:border-amber-700/30">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          selectedOrder.status === "COMPLETED"
                            ? "bg-gradient-to-br from-green-400 to-green-600"
                            : selectedOrder.status === "SHIPPED"
                            ? "bg-gradient-to-br from-purple-400 to-purple-600"
                            : selectedOrder.status === "PROCESSING"
                            ? "bg-gradient-to-br from-blue-400 to-blue-600"
                            : selectedOrder.status === "PENDING"
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                            : "bg-gradient-to-br from-red-400 to-red-600"
                        }`}
                      >
                        {selectedOrder.status === "COMPLETED" && (
                          <CheckCircleIcon className="size-6 text-white" />
                        )}
                        {selectedOrder.status === "SHIPPED" && (
                          <TruckIcon className="size-6 text-white" />
                        )}
                        {selectedOrder.status === "PROCESSING" && (
                          <ClockIcon className="size-6 text-white animate-spin" />
                        )}
                        {selectedOrder.status === "PENDING" && (
                          <ClockIcon className="size-6 text-white" />
                        )}
                        {selectedOrder.status === "CANCELLED" && (
                          <XCircleIcon className="size-6 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-current"></div>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {selectedOrder.status}
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        {selectedOrder.status === "COMPLETED" &&
                          "Your order has been delivered successfully"}
                        {selectedOrder.status === "SHIPPED" &&
                          "Your order is on its way"}
                        {selectedOrder.status === "PROCESSING" &&
                          "We're preparing your order"}
                        {selectedOrder.status === "PENDING" &&
                          "Order received and being processed"}
                        {selectedOrder.status === "CANCELLED" &&
                          "This order has been cancelled"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseHistory;
