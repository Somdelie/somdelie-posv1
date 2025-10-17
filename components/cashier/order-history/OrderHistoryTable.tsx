"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  X,
  Receipt,
  PrinterIcon,
  DownloadIcon,
} from "lucide-react";
import {
  getOrdersByCashier,
  getOrdersByDateRange,
  type Order,
} from "@/lib/actions/orders";
import { toast } from "react-toastify";
import { formatPrice } from "@/lib/formatPrice";
import { formatDate } from "@/lib/formatDate";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SalesReceipt } from "@/components/cashier/SalesReceipt";

type OrderHistoryTableProps = {
  userId: string;
};

export default function OrderHistoryTable({ userId }: OrderHistoryTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getOrdersByCashier(userId);
      if (result.success && result.data) {
        setOrders(result.data);
      } else {
        toast.error(result.error || "Failed to fetch orders");
      }
    } catch (error) {
      toast.error("An error occurred while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeFilter = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    setLoading(true);
    try {
      const result = await getOrdersByDateRange(userId, startDate, endDate);
      if (result.success && result.data) {
        setOrders(result.data);
        toast.success(`Found ${result.data.length} orders`);
      } else {
        toast.error(result.error || "Failed to filter orders");
      }
    } catch (error) {
      toast.error("An error occurred while filtering orders");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    fetchOrders();
  };

  // Print receipt function
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${
      selectedOrder?.orderNumber || selectedOrder?.id?.slice(-8)
    }`,
    onAfterPrint: () => {
      toast.success("Receipt printed successfully!");
    },
  });

  // Download PDF function
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
        `receipt-${
          selectedOrder.orderNumber || selectedOrder.id?.slice(-8)
        }.pdf`
      );

      toast.success("Receipt downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-muted rounded w-64"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.orderNumber?.toLowerCase().includes(query) ||
      order.customer?.fullName.toLowerCase().includes(query) ||
      order.status?.toLowerCase().includes(query) ||
      order.paymentType?.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    }
  };

  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrders = orders.filter(
    (o) => o.status.toLowerCase() === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">
              Order History
            </h1>
            <p className="text-muted-foreground text-sm">
              Track and manage all your transactions
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-emerald-500/10 rounded-lg">
                    <DollarSign
                      className="text-emerald-600 dark:text-emerald-400"
                      size={22}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    Total Sales
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {formatPrice(totalSales)}
                </p>
              </CardContent>
            </Card>

            <Card className="p-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg">
                    <Receipt
                      className="text-blue-600 dark:text-blue-400"
                      size={22}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    Total Orders
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {orders.length}
                </p>
              </CardContent>
            </Card>

            <Card className="p-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-purple-500/10 rounded-lg">
                    <TrendingUp
                      className="text-purple-600 dark:text-purple-400"
                      size={22}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    Completed
                  </span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {completedOrders}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Orders Table Card */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary" />
                Orders
                <span className="text-sm font-normal text-muted-foreground">
                  ({filteredOrders.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                {/* Search and Filter Bar */}
                <div className="flex gap-3 flex-wrap">
                  <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by order #, customer, status..."
                      className="pl-10 h-11 bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    variant={showFilters ? "default" : "outline"}
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-11"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  {(startDate || endDate || searchQuery) && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="h-11"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Date Range Filter */}
                {showFilters && (
                  <Card className="p-5 bg-gradient-to-br from-muted/50 to-muted/30 border-border">
                    <div className="flex gap-4 flex-wrap items-end">
                      <div className="flex-1 min-w-[180px]">
                        <label className="text-sm font-medium mb-2 block text-foreground">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <label className="text-sm font-medium mb-2 block text-foreground">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <Button onClick={handleDateRangeFilter} className="h-10">
                        <Calendar className="w-4 h-4 mr-2" />
                        Apply Filter
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Orders Table */}
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No orders found
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {orders.length === 0
                        ? "You haven't completed any orders yet"
                        : "No orders match your search criteria"}
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="font-semibold">
                            Order #
                          </TableHead>
                          <TableHead className="font-semibold">
                            Customer
                          </TableHead>
                          <TableHead className="font-semibold">Items</TableHead>
                          <TableHead className="font-semibold">Total</TableHead>
                          <TableHead className="font-semibold">
                            Payment
                          </TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="text-right font-semibold">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow
                            key={order.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-mono font-semibold text-primary">
                              {order.orderNumber || `#${order.id.slice(0, 8)}`}
                            </TableCell>
                            <TableCell className="font-medium">
                              {order.customer?.fullName || "Walk-in Customer"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-blue-500/10 rounded">
                                  <ShoppingCart
                                    size={14}
                                    className="text-blue-600 dark:text-blue-400"
                                  />
                                </div>
                                <span className="text-sm">
                                  {order.items.length}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">
                              {formatPrice(order.totalAmount)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-medium">
                                {order.paymentType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                    className="hover:bg-primary/10 hover:text-primary"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                                      <Receipt
                                        size={20}
                                        className="text-primary"
                                      />
                                      Order Details
                                    </DialogTitle>
                                  </DialogHeader>
                                  {selectedOrder && (
                                    <div className="space-y-6 py-4">
                                      {/* Order Info Grid */}
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                          <p className="text-xs text-muted-foreground mb-1 font-medium">
                                            Order Number
                                          </p>
                                          <p className="font-bold text-primary font-mono">
                                            {selectedOrder.orderNumber ||
                                              `#${selectedOrder.id.slice(
                                                0,
                                                8
                                              )}`}
                                          </p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                          <p className="text-xs text-muted-foreground mb-1 font-medium">
                                            Customer
                                          </p>
                                          <p className="font-semibold">
                                            {selectedOrder.customer?.fullName ||
                                              "Walk-in Customer"}
                                          </p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                          <p className="text-xs text-muted-foreground mb-1 font-medium">
                                            Date & Time
                                          </p>
                                          <p className="font-semibold">
                                            {formatDate(
                                              selectedOrder.createdAt
                                            )}
                                          </p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border">
                                          <p className="text-xs text-muted-foreground mb-1 font-medium">
                                            Payment Method
                                          </p>
                                          <p className="font-semibold">
                                            {selectedOrder.paymentType}
                                          </p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-lg border border-border col-span-2">
                                          <p className="text-xs text-muted-foreground mb-2 font-medium">
                                            Status
                                          </p>
                                          <Badge
                                            className={getStatusColor(
                                              selectedOrder.status
                                            )}
                                          >
                                            {selectedOrder.status}
                                          </Badge>
                                        </div>
                                      </div>

                                      {/* Items Table */}
                                      <div>
                                        <h4 className="font-semibold mb-3 text-base flex items-center gap-2">
                                          <ShoppingCart
                                            size={18}
                                            className="text-primary"
                                          />
                                          Order Items
                                        </h4>
                                        <div className="border rounded-lg overflow-hidden">
                                          <Table>
                                            <TableHeader>
                                              <TableRow className="bg-muted/50">
                                                <TableHead className="font-semibold">
                                                  Product
                                                </TableHead>
                                                <TableHead className="font-semibold">
                                                  Quantity
                                                </TableHead>
                                                <TableHead className="font-semibold">
                                                  Price
                                                </TableHead>
                                                <TableHead className="text-right font-semibold">
                                                  Subtotal
                                                </TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {selectedOrder.items.map(
                                                (item, index) => (
                                                  <TableRow key={index}>
                                                    <TableCell className="font-medium">
                                                      {item.productName ||
                                                        item.productId}
                                                    </TableCell>
                                                    <TableCell>
                                                      <Badge
                                                        variant="outline"
                                                        className="font-mono"
                                                      >
                                                        {item.quantity}
                                                      </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-semibold">
                                                      {formatPrice(item.price)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                                                      {formatPrice(
                                                        item.price *
                                                          item.quantity
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )}
                                            </TableBody>
                                          </Table>
                                        </div>
                                      </div>

                                      {/* Totals */}
                                      <div className="border-t pt-6">
                                        <div className="space-y-3 max-w-md ml-auto">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground font-medium">
                                              Subtotal
                                            </span>
                                            <span className="font-semibold">
                                              {formatPrice(
                                                selectedOrder.subtotal
                                              )}
                                            </span>
                                          </div>
                                          {selectedOrder.tax &&
                                            selectedOrder.tax > 0 && (
                                              <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground font-medium">
                                                  Tax
                                                </span>
                                                <span className="font-semibold">
                                                  {formatPrice(
                                                    selectedOrder.tax
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          {selectedOrder.discount &&
                                            selectedOrder.discount > 0 && (
                                              <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                                                <span className="font-medium">
                                                  Discount
                                                </span>
                                                <span className="font-semibold">
                                                  -
                                                  {formatPrice(
                                                    selectedOrder.discount
                                                  )}
                                                </span>
                                              </div>
                                            )}
                                          <div className="flex justify-between text-lg font-bold border-t pt-3">
                                            <span>Total Amount</span>
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                              {formatPrice(
                                                selectedOrder.totalAmount
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Print and Download Actions */}
                                      <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                          variant="outline"
                                          className="flex-1 gap-2"
                                          onClick={handlePrint}
                                        >
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
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden Receipt Component for Printing/PDF */}
      {selectedOrder && (
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
      )}
    </div>
  );
}
