"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Search,
  Check,
  ChevronsUpDown,
  RefreshCcw,
  DollarSign,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCustomers, type Customer } from "@/lib/actions/customers";
import { getOrdersByCashier, type Order } from "@/lib/actions/orders";
import { createRefund } from "@/lib/actions/refunds";
import { toast } from "react-toastify";
import { formatPrice } from "@/lib/formatPrice";
import { formatDate } from "@/lib/formatDate";
import { useRouter } from "next/navigation";

type ReturnRefundFormClientProps = {
  userId: string;
  storeId: string;
};

export default function ReturnRefundFormClient({
  userId,
  storeId,
}: ReturnRefundFormClientProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState<string>("");
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch orders when customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      fetchOrders();
    } else {
      setOrders([]);
      setSelectedOrder("");
    }
  }, [selectedCustomer]);

  // Update refund amount when order is selected
  useEffect(() => {
    if (selectedOrder) {
      const order = orders.find((o) => o.id === selectedOrder);
      if (order) {
        setRefundAmount(order.totalAmount.toString());
      }
    }
  }, [selectedOrder, orders]);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const result = await getCustomers();
      if (result.success && result.data) {
        setCustomers(result.data);
      } else {
        toast.error(result.error || "Failed to fetch customers");
      }
    } catch (error) {
      toast.error("An error occurred while fetching customers");
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      // Fetch orders by cashier (current user)
      const result = await getOrdersByCashier(userId);
      if (result.success && result.data) {
        // Filter orders for selected customer
        const customerOrders = result.data.filter((order) => {
          // Check if order has customer and matches selected customer
          if (!order.customer?.id) return false;
          return order.customer.id === selectedCustomer;
        });
        setOrders(customerOrders);

        if (customerOrders.length === 0) {
          toast.info("No orders found for this customer");
        }
      } else {
        toast.error(result.error || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error("An error occurred while fetching orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrder) {
      toast.error("Please select an order");
      return;
    }

    if (!refundReason.trim()) {
      toast.error("Please provide a reason for the refund");
      return;
    }

    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }

    const order = orders.find((o) => o.id === selectedOrder);
    if (order && amount > order.totalAmount) {
      toast.error("Refund amount cannot exceed order total");
      return;
    }

    const toastId = toast.loading("Processing refund...");
    setProcessing(true);

    try {
      const result = await createRefund({
        orderId: selectedOrder,
        amount,
        reason: refundReason,
      });

      if (result.success) {
        toast.update(toastId, {
          render: "Refund processed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Reset form
        setSelectedCustomer("");
        setSelectedOrder("");
        setRefundAmount("");
        setRefundReason("");

        // Redirect to refunds list
        setTimeout(() => {
          router.push("/store/cashier/refunds");
        }, 1500);
      } else {
        toast.update(toastId, {
          render: result.error || "Failed to process refund",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: "An error occurred while processing refund",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);
  const selectedOrderData = orders.find((o) => o.id === selectedOrder);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Process Return & Refund</h1>
          <p className="text-muted-foreground">
            Select customer and order to issue a refund
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCcw className="h-5 w-5" />
                Refund Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Customer Selection */}
                <div className="space-y-2">
                  <Label htmlFor="customer">
                    <User className="inline w-4 h-4 mr-2" />
                    Select Customer *
                  </Label>
                  <Popover open={openCustomer} onOpenChange={setOpenCustomer}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCustomer}
                        className="w-full justify-between"
                        disabled={loadingCustomers}
                      >
                        {selectedCustomer
                          ? selectedCustomerData?.fullName ||
                            "Select customer..."
                          : "Select customer..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search customer..." />
                        <CommandList>
                          <CommandEmpty>No customer found.</CommandEmpty>
                          <CommandGroup>
                            {customers.map((customer) => (
                              <CommandItem
                                key={customer.id}
                                value={customer.fullName}
                                onSelect={() => {
                                  setSelectedCustomer(customer.id);
                                  setOpenCustomer(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCustomer === customer.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {customer.fullName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.email} · {customer.phone}
                                  </p>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedCustomerData && (
                    <div className="text-sm text-muted-foreground">
                      Email: {selectedCustomerData.email} | Phone:{" "}
                      {selectedCustomerData.phone}
                    </div>
                  )}
                </div>

                {/* Order Selection */}
                <div className="space-y-2">
                  <Label htmlFor="order">
                    <Search className="inline w-4 h-4 mr-2" />
                    Select Order *
                  </Label>
                  <Popover open={openOrder} onOpenChange={setOpenOrder}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openOrder}
                        className="w-full justify-between"
                        disabled={!selectedCustomer || loadingOrders}
                      >
                        {selectedOrder
                          ? `Order #${
                              selectedOrderData?.orderNumber ||
                              selectedOrderData?.id.slice(0, 8)
                            } - ${formatPrice(
                              selectedOrderData?.totalAmount || 0
                            )}`
                          : selectedCustomer
                          ? "Select order..."
                          : "Select customer first..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search order..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingOrders
                              ? "Loading orders..."
                              : "No orders found for this customer."}
                          </CommandEmpty>
                          <CommandGroup>
                            {orders.map((order) => (
                              <CommandItem
                                key={order.id}
                                value={order.orderNumber || order.id}
                                onSelect={() => {
                                  setSelectedOrder(order.id);
                                  setOpenOrder(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedOrder === order.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <p className="font-medium">
                                      Order #
                                      {order.orderNumber ||
                                        order.id.slice(0, 8)}
                                    </p>
                                    <p className="font-semibold">
                                      {formatPrice(order.totalAmount)}
                                    </p>
                                  </div>
                                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                                    <span>{formatDate(order.createdAt)}</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {order.paymentType}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {order.items.length} items
                                    </Badge>
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

                {/* Order Details */}
                {selectedOrderData && (
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base">Order Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Order Number</p>
                          <p className="font-medium">
                            #
                            {selectedOrderData.orderNumber ||
                              selectedOrderData.id.slice(0, 8)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Order Date</p>
                          <p className="font-medium">
                            {formatDate(selectedOrderData.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Payment Method
                          </p>
                          <Badge variant="outline">
                            {selectedOrderData.paymentType}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge variant="outline">
                            {selectedOrderData.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Items
                        </p>
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">
                                  Qty
                                </TableHead>
                                <TableHead className="text-right">
                                  Price
                                </TableHead>
                                <TableHead className="text-right">
                                  Total
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedOrderData.items.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {item.productName || item.productId}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatPrice(item.price)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {formatPrice(item.price * item.quantity)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span className="font-medium">
                            {formatPrice(selectedOrderData.subtotal)}
                          </span>
                        </div>
                        {selectedOrderData.tax && selectedOrderData.tax > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax</span>
                            <span className="font-medium">
                              {formatPrice(selectedOrderData.tax)}
                            </span>
                          </div>
                        )}
                        {selectedOrderData.discount &&
                          selectedOrderData.discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Discount</span>
                              <span className="font-medium">
                                -{formatPrice(selectedOrderData.discount)}
                              </span>
                            </div>
                          )}
                        <div className="flex justify-between text-base font-bold border-t pt-2">
                          <span>Order Total</span>
                          <span>
                            {formatPrice(selectedOrderData.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Refund Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    <DollarSign className="inline w-4 h-4 mr-2" />
                    Refund Amount *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    disabled={!selectedOrder}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum refund amount:{" "}
                    {selectedOrderData
                      ? formatPrice(selectedOrderData.totalAmount)
                      : "$0.00"}
                  </p>
                </div>

                {/* Refund Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">
                    <AlertCircle className="inline w-4 h-4 mr-2" />
                    Refund Reason *
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter the reason for this refund..."
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    disabled={!selectedOrder}
                    rows={4}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Provide a clear explanation for the refund (e.g., damaged
                    product, wrong item, customer request)
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      !selectedOrder ||
                      !refundAmount ||
                      !refundReason.trim() ||
                      processing
                    }
                    className="flex-1"
                  >
                    {processing ? "Processing..." : "Process Refund"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedCustomer("");
                      setSelectedOrder("");
                      setRefundAmount("");
                      setRefundReason("");
                    }}
                    disabled={processing}
                  >
                    Clear Form
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
