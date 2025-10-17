"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/formatPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SearchIcon,
  RefreshCcwIcon,
  CalendarIcon,
  BanknoteIcon,
  AlertTriangleIcon,
  XCircleIcon,
  FileTextIcon,
  UserIcon,
  PackageIcon,
  PlusIcon,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getRefundsByCashier, type Refund } from "@/lib/actions/refunds";
import { toast } from "react-toastify";

type RefundsListClientProps = {
  userId: string;
};

export default function RefundsListClient({ userId }: RefundsListClientProps) {
  const router = useRouter();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch refunds on mount
  useEffect(() => {
    async function fetchRefunds() {
      if (!userId) return;

      setLoading(true);
      const result = await getRefundsByCashier(userId);

      if (result.success && result.data) {
        setRefunds(result.data);
      } else {
        toast.error(result.error || "Failed to load refunds");
      }
      setLoading(false);
    }

    fetchRefunds();
  }, [userId]);

  const handleViewRefund = (refundId: string) => {
    router.push(`/store/cashier/refunds/${refundId}`);
  };

  // Generate a nice refund reference
  const getRefundReference = (refund: Refund) => {
    const customerName =
      refund.customerName ||
      refund.order?.customer?.fullName ||
      refund.order?.customer?.name ||
      "Customer";

    // Get first name or first word
    const firstName = customerName.split(" ")[0];

    // Get last 6 characters of refund ID
    const refundCode = refund.id.slice(-6).toUpperCase();

    return `${firstName}-${refundCode}`;
  };

  // Format date and time nicely
  const formatRefundDateTime = (dateString: string) => {
    if (!dateString) return { date: "N/A", time: "" };

    try {
      const date = new Date(dateString);

      // Format date as "Oct 5, 2025"
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Format time as "2:30 PM"
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      // Fallback for non-standard date formats
      const parts = dateString.split(" ");
      return { date: parts[0] || "N/A", time: parts.slice(1).join(" ") || "" };
    }
  };

  // Filter refunds based on search term
  const filteredRefunds = refunds.filter((refund) => {
    const refundReference = getRefundReference(refund).toLowerCase();
    const orderId = refund.orderId || refund.order?.id || "";
    const cashierName = refund.cashierName || refund.cashier?.fullName || "";
    const reason = refund.reason || "";

    const matchesSearch =
      refundReference.includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reason.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getReasonIcon = (reason: string) => {
    if (
      reason.toLowerCase().includes("damaged") ||
      reason.toLowerCase().includes("defective") ||
      reason.toLowerCase().includes("quality")
    ) {
      return <AlertTriangleIcon className="size-4 text-red-600" />;
    }
    return <XCircleIcon className="size-4 text-orange-600" />;
  };

  const getReasonBadge = (reason: string) => {
    if (
      reason.toLowerCase().includes("damaged") ||
      reason.toLowerCase().includes("defective") ||
      reason.toLowerCase().includes("quality")
    ) {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
    return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
  };

  const totalRefunds = filteredRefunds.length;
  const totalAmount: number = filteredRefunds.reduce(
    (sum, refund) => sum + refund.amount,
    0
  );
  const avgRefundAmount = totalRefunds > 0 ? totalAmount / totalRefunds : 0;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-red-600" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Loading refunds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded flex items-center justify-center shadow-md">
                  <RefreshCcwIcon className="size-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Refunds Management
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Track and manage all refund transactions
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200/50 dark:border-red-800/30">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {totalRefunds}
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    Total Refunds
                  </p>
                </div>
                <div className="text-center p-3 bg-rose-50 dark:bg-rose-950/20 rounded border border-rose-200/50 dark:border-rose-800/30">
                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    {formatPrice(totalAmount)}
                  </p>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    Total Amount
                  </p>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200/50 dark:border-orange-800/30">
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {formatPrice(avgRefundAmount)}
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">
                    Avg Refund
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-500" />
                <Input
                  placeholder="Search by order, cashier, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Link href="/store/cashier/refunds/new">
                <Button>
                  <PlusIcon className="size-4" />
                  New Refund
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto p-0">
            <div className="border border-slate-200 dark:border-slate-700 rounded mx-6 mb-6 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-red-50 dark:bg-red-950/20">
                    <TableHead className="font-semibold text-red-700 dark:text-red-300">
                      Order Reference
                    </TableHead>
                    <TableHead className="font-semibold text-red-700 dark:text-red-300">
                      Date & Time
                    </TableHead>
                    <TableHead className="font-semibold text-red-700 dark:text-red-300">
                      Cashier
                    </TableHead>
                    <TableHead className="font-semibold text-red-700 dark:text-red-300">
                      Reason
                    </TableHead>
                    <TableHead className="font-semibold text-red-700 dark:text-red-300">
                      Payment
                    </TableHead>
                    <TableHead className="font-semibold text-red-700 dark:text-red-300 text-right">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold text-red-700 dark:text-red-300 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRefunds.map((refund: Refund) => (
                    <TableRow
                      key={refund.id}
                      className="hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors duration-200"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PackageIcon className="size-4 text-slate-500" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {getRefundReference(refund)}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ID: {refund.id.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <CalendarIcon className="size-4 text-slate-500" />
                          <div className="text-sm">
                            <p className="font-medium text-slate-700 dark:text-slate-300">
                              {formatRefundDateTime(refund.createdAt).date}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {formatRefundDateTime(refund.createdAt).time}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserIcon className="size-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {refund.cashierName ||
                              refund.cashier?.fullName ||
                              "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getReasonIcon(refund.reason || "")}
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full max-w-32 truncate ${getReasonBadge(
                              refund.reason || ""
                            )}`}
                            title={refund.reason || ""}
                          >
                            {refund.reason || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BanknoteIcon className="size-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            CASH
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-red-600 dark:text-red-400">
                          -{formatPrice(refund.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 bg-transparent"
                            title="View Details"
                            onClick={() => handleViewRefund(refund.id)}
                          >
                            <FileTextIcon className="size-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRefunds.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <RefreshCcwIcon className="size-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  No refunds found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "No refunds have been processed yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
