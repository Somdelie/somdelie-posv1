"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/formatPrice";
import {
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  BanknoteIcon,
  SmartphoneIcon,
  PackageIcon,
  RefreshCcwIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ReceiptIcon,
  PrinterIcon,
  Mail,
  Map,
  DownloadIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { RefundReceipt } from "./RefundReceipt";

interface RefundDetailsProps {
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
    refund: {
      id: string;
      amount: number;
      reason: string;
      refundMethod: string;
      createdAt: string;
      cashier?: string;
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

const RefundDetails = ({ order }: RefundDetailsProps) => {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Refund_Receipt_${order.orderNumber}_${order.refund.id.slice(
      0,
      8
    )}`,
    onAfterPrint: () => {
      toast.success("Receipt printed successfully!");
    },
  });

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) {
      toast.error("Receipt not ready. Please try again.");
      return;
    }

    try {
      toast.info("Generating PDF...");

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 794, // A4 width in pixels at 96 DPI
        windowHeight: 1123, // A4 height in pixels at 96 DPI
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `Refund_Receipt_${order.orderNumber}_${order.refund.id.slice(0, 8)}.pdf`
      );

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  const getPaymentIcon = (type: string) => {
    switch (type.toUpperCase()) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircleIcon className="size-4 text-green-600" />;
      case "PENDING":
        return (
          <RefreshCcwIcon className="size-4 text-yellow-600 animate-spin" />
        );
      case "FAILED":
        return <AlertTriangleIcon className="size-4 text-red-600" />;
      default:
        return <RefreshCcwIcon className="size-4 text-gray-600" />;
    }
  };

  return (
    <>
      {/* Hidden Receipt Component for Printing - positioned off-screen instead of display:none */}
      <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
        <RefundReceipt ref={receiptRef} order={order} />
      </div>

      <div className="h-full flex flex-col max-w-[97%] mx-auto py-4">
        <div className="flex items-center mb-4 justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Refund Details
          </h2>
          <div className="flex gap-2 flex-wrap">
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
              className="gap-2 flex-1 sm:flex-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent"
              onClick={handlePrint}
            >
              <PrinterIcon className="size-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              variant="outline"
              className="gap-2 flex-1 sm:flex-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-transparent"
              onClick={handleDownloadPDF}
            >
              <DownloadIcon className="size-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Refund Information - Primary Card */}
          <Card className="">
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <RefreshCcwIcon className="size-5 sm:size-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                    Refund Information
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Refund ID: {order.refund.id}
                  </p>
                </div>
                {order.refund.status && (
                  <Badge className={getStatusBadge(order.refund.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.refund.status)}
                      {order.refund.status}
                    </span>
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 border-b pb-4">
                <div className="p-3 sm:p-4 bg-red-100 dark:bg-slate-800/40 rounded">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Refund Amount
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">
                    {formatPrice(order.refund.amount)}
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-green-100 dark:bg-slate-800/40 rounded">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-2">
                    <CalendarIcon className="size-3" />
                    Refund Date
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                    {order.refund.createdAt}
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-yellow-100 dark:bg-slate-800/40 rounded">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Refund Method
                  </p>
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(order.refund.refundMethod)}
                    <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                      {order.refund.refundMethod}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-red-100 dark:bg-slate-800/40 rounded">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Items Returned
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                    {order.refund.itemsReturned.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{" "}
                    items
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 sm:p-4 bg-white/60 dark:bg-slate-800/40 rounded">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Refund Reason
                </p>
                <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200">
                  {order.refund.reason}
                </p>
              </div>

              {order.refund.cashier && (
                <div className="mt-4 p-3 sm:p-4 bg-white/60 dark:bg-slate-800/40 rounded">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Processed By
                  </p>
                  <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200">
                    {order.refund.cashier}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Original Order Information */}
          <Card className="">
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ReceiptIcon className="size-5 sm:size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                    Original Order
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {order.orderNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <div className="p-3 sm:p-4 bg-white/60 dark:bg-slate-800/40 rounded border">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-2">
                    <CalendarIcon className="size-3" />
                    Order Date
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                    {order.createdAt}
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-white/60 dark:bg-slate-800/40 rounded border">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Payment Method
                  </p>
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(order.paymentMethod)}
                    <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-white/60 dark:bg-slate-800/40 rounded border">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Order Total
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                    {formatPrice(order.orderTotal)}
                  </p>
                </div>

                <div className="p-3 sm:p-4 bg-white/60 dark:bg-slate-800/40 rounded border">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Total Items
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                    {order.totalItems} items
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Items Returned Card */}
          <Card className="border shadow bg-white dark:bg-slate-900 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <PackageIcon className="size-5 sm:size-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                  Items Returned
                </h2>
              </div>

              {/* Mobile View - Cards */}
              <div className="block sm:hidden space-y-3">
                {order.refund.itemsReturned.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 flex-1 pr-2">
                        {item.name}
                      </p>
                      <p className="font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                        {formatPrice(item.refundAmount)}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden sm:block border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableHead className="font-semibold">Item Name</TableHead>
                      <TableHead className="text-center font-semibold">
                        Qty Returned
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Refund Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.refund.itemsReturned.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      >
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-rose-600 dark:text-rose-400">
                          {formatPrice(item.refundAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="">
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserIcon className="size-5 sm:size-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                  Customer Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-3 sm:p-4 dark:bg-slate-800/40 rounded border bg-accent/05">
                  <div className="flex items-center gap-1">
                    <UserIcon className="size-4 sm:size-5 text-slate-400 mb-2" />
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Customer Name
                    </p>
                  </div>
                  <p className="text-sm sm:text-base truncate line-clamp-1 font-semibold text-slate-800 dark:text-slate-200">
                    {order.customer.fullName}
                  </p>
                </div>
                <div className="p-3 sm:p-4 dark:bg-slate-800/40 rounded border bg-accent/10">
                  <div className="flex items-center gap-1">
                    <SmartphoneIcon className="size-4 sm:size-5 text-slate-400 mb-2" />
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Phone Number
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                    {order.customer.phone}
                  </p>
                </div>
                <div className="p-3 sm:p-4 dark:bg-slate-800/40 rounded border bg-orange-300">
                  <div className="flex items-center gap-1">
                    <Mail className="size-4 sm:size-5 text-slate-400 mb-2" />
                    <p className="text-xs sm:text-sm truncate line-clamp-1 text-slate-600 dark:text-slate-400 mb-1">
                      Email Address
                    </p>
                  </div>
                  <p className="text-sm sm:text-base line-clamp-1 truncate font-semibold text-slate-800 dark:text-slate-200">
                    {order.customer.email}
                  </p>
                </div>
                <div className="p-3 sm:p-4 dark:bg-slate-800/40 rounded border bg-accent/05">
                  <div className="flex items-center gap-1">
                    <Map className="size-4 sm:size-5 text-slate-400" />
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Customer Address
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 truncate line-clamp-1">
                    {order.customer.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RefundDetails;
