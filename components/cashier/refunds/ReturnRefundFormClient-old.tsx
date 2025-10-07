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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { formatPrice } from "@/lib/formatPrice";
import {
  ArrowLeftIcon,
  UserIcon,
  SearchIcon,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { getOrdersByCashier } from "@/redux-toolkit/fetures/order/orderThunk";
import { createRefund } from "@/redux-toolkit/fetures/refund/refundThunk";
import { toast } from "react-toastify";

type OrderItem = {
  id: string;
  name?: string;
  quantity: number;
  price: number;
  product?: {
    name?: string;
    productName?: string;
  };
};

type Order = {
  id: number;
  orderNumber: string;
  createdAt: string;
  paymentMethod: string;
  customer: {
    fullName?: string;
    phone: string;
  };
  totalItems: number;
  orderTotal?: number;
  totalAmount?: number;
  items: OrderItem[];
};

type ReturnItem = OrderItem & {
  returnQty: number;
};

export function ReturnRefundFormClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state: any) => state.order);
  const { userProfile } = useAppSelector((state: any) => state.user);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnReason, setReturnReason] = useState("");
  // refundMethod removed - always CASH for POS
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (userProfile?.id) {
      dispatch(getOrdersByCashier(userProfile.id));
    }
  }, [dispatch, userProfile?.id]);

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    const order = orders.find((o: Order) => o.id.toString() === orderId);
    if (order) {
      setSelectedOrder(order);
      setReturnItems(
        order.items.map(
          (item: OrderItem): ReturnItem => ({ ...item, returnQty: 0 })
        )
      );
      // Reset form state
      setReturnReason("");
      // refundMethod removed - always CASH for POS
    }
    setOpen(false);
  };

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
      toast.error("Please select at least one item to return");
      return;
    }
    if (!returnReason) {
      toast.error("Please select a return reason");
      return;
    }
    // Refund method validation removed - always CASH for POS
    setShowConfirmDialog(true);
  };

  const handleConfirmRefund = async () => {
    if (!selectedOrder) {
      toast.error("No order selected");
      return;
    }

    try {
      // Prepare refund data to match backend structure
      const refundData = {
        orderId: selectedOrder.id,
        reason: returnReason,
        amount: totalRefundAmount,
      };

      console.log("Creating refund:", refundData);

      // Create refund via API
      const result = await dispatch(createRefund(refundData));

      console.log("Refund creation result:", result);

      if (createRefund.fulfilled.match(result)) {
        toast.success("Refund processed successfully!");
        setShowConfirmDialog(false);

        // Reset form
        setSelectedOrder(null);
        setSelectedOrderId("");
        setReturnItems([]);
        setReturnReason("");
        // refundMethod removed - always CASH for POS

        // Navigate back to refunds list
        setTimeout(() => {
          router.push("/store/cashier/refunds");
        }, 1000);
      } else {
        console.error("Refund creation failed:", result);
        console.error("Error payload:", result.payload);
        toast.error((result.payload as string) || "Failed to process refund");
      }
    } catch (error) {
      console.error("Refund creation error:", error);
      toast.error("Error processing refund: " + (error as any).message);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!selectedOrder) {
    return (
      <div className="h-full flex flex-col w-full">
        <div className="flex-1 overflow-auto p-6 w-full">
          <div className="mb-6 w-full flex items-center justify-between border-b pb-4">
            <h1 className="text-3xl w-full font-bold text-slate-700 dark:text-slate-100 mb-4">
              Return / Refund
            </h1>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleBack}
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="w-full">
                <div className="flex items-center justify-center mb-6">
                  <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <SearchIcon className="size-8 text-slate-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-2">
                  Select an Order
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
                  Search and select an order to process a refund
                </p>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="order-search"
                      className="text-slate-700 dark:text-slate-300 font-semibold mb-2"
                    >
                      Search Orders
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild className="w-full">
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between mt-2 bg-transparent"
                        >
                          {selectedOrderId
                            ? orders.find(
                                (order: Order) =>
                                  order.id.toString() === selectedOrderId
                              )?.orderNumber +
                              " - " +
                              orders.find(
                                (order: Order) =>
                                  order.id.toString() === selectedOrderId
                              )?.customer.fullName
                            : "Select an order..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command className="md:min-w-[450px]">
                          <CommandInput placeholder="Search by order number, customer name..." />
                          <CommandList>
                            <CommandEmpty>No orders found.</CommandEmpty>
                            <CommandGroup>
                              {orders.map((order: Order) => (
                                <CommandItem
                                  key={order.id}
                                  value={`${order.id} ${order.customer.fullName} ${order.totalAmount}`}
                                  onSelect={() =>
                                    handleOrderSelect(order.id.toString())
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedOrderId === order.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <div className="text-sm text-slate-500">
                                      {order.customer.fullName ||
                                        order.customer.fullName}{" "}
                                      -{" "}
                                      <span className="text-red-800 font-bold">
                                        {formatPrice(
                                          order.totalAmount ||
                                            order.orderTotal ||
                                            0
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                                        {order.id
                                          ? order.id
                                              .toString()
                                              .substring(0, 8)
                                              .toUpperCase()
                                          : "N/A"}
                                      </p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {order.items?.length || 0} item
                                        {(order.items?.length || 0) > 1
                                          ? "s"
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                      Showing {orders.length} recent orders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Return / Refund
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={handleBack}
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => {
                setSelectedOrder(null);
                setSelectedOrderId("");
              }}
            >
              Change Order
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Order Information Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedOrder.orderNumber}
                  </h2>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {selectedOrder.id
                        ?.toString()
                        .substring(0, 8)
                        .toUpperCase() || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedOrder.items?.length || 0} item
                      {(selectedOrder.items?.length || 0) > 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-sm font-semibold">
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {selectedOrder.createdAt}
                </p>

                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Customer
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <UserIcon className="size-4" />
                      <span>
                        {selectedOrder.customer.fullName ||
                          selectedOrder.customer.fullName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-sm">
                        {selectedOrder.customer.phone}
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
                        {selectedOrder.totalItems}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Order Total:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatPrice(
                          selectedOrder.totalAmount ||
                            selectedOrder.orderTotal ||
                            0
                        )}
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
                    {selectedOrder.items.map((item) => {
                      const itemName =
                        item.name ||
                        item.product?.name ||
                        item.product?.productName ||
                        "Unknown Item";
                      const displayName =
                        itemName.length > 30
                          ? itemName.substring(0, 30) + "..."
                          : itemName;

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {displayName}
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
                      );
                    })}
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
                    {returnItems.map((item) => {
                      const itemName =
                        item.name || item.product?.name || "Unknown Item";
                      const displayName =
                        itemName.length > 20
                          ? itemName.substring(0, 20) + "..."
                          : itemName;

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {displayName}
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
                                  Number.parseInt(e.target.value) || 0
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
                              variant={
                                item.returnQty > 0 ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handleToggleReturn(item.id)}
                            >
                              {item.returnQty > 0 ? "Yes" : "No"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

                  {/* Refund Method - Always CASH for POS */}
                  <div>
                    <Label
                      htmlFor="refundMethod"
                      className="text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Refund Method
                    </Label>
                    <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <span className="text-green-700 dark:text-green-400 text-xl font-bold">
                          💵
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-green-800 dark:text-green-300">
                          Cash Refund
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          All POS refunds are processed as cash
                        </p>
                      </div>
                    </div>
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
                  <span className="font-medium">Order ID:</span>{" "}
                  {selectedOrder.id}
                </p>
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {selectedOrder.customer.fullName ||
                    selectedOrder.customer.fullName}
                </p>
                <p>
                  <span className="font-medium">Refund Method:</span> CASH
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
                  {itemsBeingReturned.map((item) => {
                    const itemName =
                      item.name || item.product?.name || "Unknown Item";
                    const displayName =
                      itemName.length > 30
                        ? itemName.substring(0, 30) + "..."
                        : itemName;

                    return (
                      <p
                        key={item.id}
                        className="text-slate-600 dark:text-slate-400 text-xs"
                      >
                        {displayName} × {item.returnQty} (
                        {formatPrice(item.price * item.returnQty)})
                      </p>
                    );
                  })}
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
