"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/formatPrice";
import OrderDetails from "@/components/cashier/order-history/OrderDetails";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SearchIcon,
  FilterIcon,
  EyeIcon,
  DownloadIcon,
  CalendarIcon,
  CreditCardIcon,
  BanknoteIcon,
  SmartphoneIcon,
  ReceiptIcon,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { getOrdersByCashier } from "@/redux-toolkit/fetures/order/orderThunk";
import { formatDate } from "@/lib/formatDate";
import { getUserProfile } from "@/redux-toolkit/fetures/user/userThunk";

const OrderHistoryTable = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state: any) => state.order);
  const { userProfile } = useAppSelector((state: any) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showOrderInvoiceDialog, setShowOrderInvoiceDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (userProfile?.id) {
      dispatch(getOrdersByCashier(userProfile.id));
    }
  }, [dispatch, userProfile?.id]);

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case "CASH":
        return <BanknoteIcon className="size-4 text-green-600" />;
      case "CARD":
        return <CreditCardIcon className="size-4 text-blue-600" />;
      case "UPI":
        return <SmartphoneIcon className="size-4 text-purple-600" />;
      default:
        return <CreditCardIcon className="size-4 text-gray-600" />;
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const totalOrders = filteredOrders.length;
  const totalAmount = filteredOrders.reduce(
    (sum: number, order: any) => sum + (order.totalAmount || 0),
    0
  );
  const completedOrders = filteredOrders.filter(
    (order: any) => order.status === "COMPLETED"
  ).length;

  const handlePrintInvoice = (order: any) => {
    // Implement print functionality here
    console.log("Printing invoice for order:", order);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center shadow-md">
              <ReceiptIcon className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Order History
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Complete order management and tracking
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="flex gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200/50 dark:border-blue-800/30">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalOrders}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Total Orders
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded border border-green-200/50 dark:border-green-800/30">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completedOrders}
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Completed
              </p>
            </div>
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded border border-emerald-200/50 dark:border-emerald-800/30">
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatPrice(totalAmount)}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Total Value
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mt-4 w-full">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-500" />
            <Input
              placeholder="Search by order number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <FilterIcon className="size-4 text-slate-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0">
        <div className="border border-slate-200 dark:border-slate-700 rounded mx-6 mb-6 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                  Order Details
                </TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                  Customer
                </TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                  Date & Time
                </TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                  Payment
                </TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-right">
                  Amount
                </TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <Loader2 className="size-5 animate-spin" />
                      <span>Loading orders...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order: any) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <TableCell>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {order.id?.substring(0, 8).toUpperCase() || "N/A"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {order.items?.length || 0} item
                          {(order.items?.length || 0) > 1 ? "s" : ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                      {order.customer?.fullName || "Walk-in Customer"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <CalendarIcon className="size-3" />
                        <div className="text-sm">
                          {order.createdAt
                            ? formatDate(order.createdAt)
                            : "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPaymentIcon(order.paymentType || "CASH")}
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {order.paymentType || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getBadgeVariant(
                          order.status || "PENDING"
                        )} font-semibold px-3 py-1`}
                      >
                        {order.status || "PENDING"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatPrice(order?.totalAmount ?? 0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-transparent"
                          title="View Details"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderInvoiceDialog(true);
                          }}
                        >
                          <EyeIcon className="size-3" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-transparent"
                          title="Print Invoice"
                          onClick={() => {
                            handlePrintInvoice(order);
                          }}
                        >
                          <Printer className="size-3" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-transparent"
                          title="Download Invoice"
                        >
                          <DownloadIcon className="size-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      No orders found.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <Dialog
        open={showOrderInvoiceDialog}
        onOpenChange={setShowOrderInvoiceDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-lg font-medium">
              Order - Invoice
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            {selectedOrder && <OrderDetails orderData={selectedOrder} />}
          </div>
          <DialogFooter className="px-6 pb-6">
            <Button className="mr-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <Printer className="mr-2 size-4" />
              Invoice
            </Button>
            <Button>
              <Download className=" size-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OrderHistoryTable;
