"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Clock,
  PlayCircle,
  StopCircle,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  RefreshCw,
  LogOut,
} from "lucide-react";
import {
  startShift,
  endShift,
  getCurrentShift,
  type ShiftReport,
} from "@/lib/actions/shift";
import { toast } from "react-toastify";
import { formatPrice } from "@/lib/formatPrice";
import { useRouter } from "next/navigation";
import { clearJWT } from "@/lib/auth/jwt-utils";

export default function ShiftManager() {
  const router = useRouter();
  const [currentShift, setCurrentShift] = useState<ShiftReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showEndShiftDialog, setShowEndShiftDialog] = useState(false);
  const [shiftDuration, setShiftDuration] = useState<string>("00:00:00");

  useEffect(() => {
    fetchCurrentShift();
  }, []);

  // Helper function to parse shift start time
  const parseShiftStartTime = (timeString: string): Date => {
    // If it's just a time string like "22:06:03.1440087", convert to today's date
    if (timeString && !timeString.includes("T") && !timeString.includes(" ")) {
      const today = new Date();
      const [hours, minutes, seconds] = timeString.split(":");
      today.setHours(
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds.split(".")[0])
      );
      return today;
    }
    // Otherwise, parse as normal datetime
    return new Date(timeString);
  };

  // Calculate shift duration
  useEffect(() => {
    if (!currentShift?.shiftStart) return;

    const interval = setInterval(() => {
      const start = parseShiftStartTime(currentShift.shiftStart);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setShiftDuration(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [currentShift]);

  const fetchCurrentShift = async () => {
    setLoading(true);
    try {
      const result = await getCurrentShift();
      if (result.success && result.data) {
        setCurrentShift(result.data);
      } else {
        setCurrentShift(null);
      }
    } catch (error) {
      console.error("Error fetching shift:", error);
      toast.error("Failed to fetch shift data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartShift = async () => {
    setActionLoading(true);
    try {
      const result = await startShift();
      if (result.success && result.data) {
        setCurrentShift(result.data);
        toast.success("Shift started successfully!");
      } else {
        toast.error(result.error || "Failed to start shift");
      }
    } catch (error) {
      console.error("Error starting shift:", error);
      toast.error("An error occurred while starting shift");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndShift = async () => {
    setActionLoading(true);
    try {
      const result = await endShift();
      if (result.success && result.data) {
        toast.success("Shift ended successfully! Logging out...");

        // Clear JWT and logout
        await clearJWT();

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        toast.error(result.error || "Failed to end shift");
        setActionLoading(false);
      }
    } catch (error) {
      console.error("Error ending shift:", error);
      toast.error("An error occurred while ending shift");
      setActionLoading(false);
    } finally {
      setShowEndShiftDialog(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Shift Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="size-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Shift Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Shift Status */}
          {currentShift ? (
            <>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Shift Active
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Started at{" "}
                    {new Date(currentShift.shiftStart).toLocaleTimeString()}
                  </p>
                </div>
                <Badge className="bg-green-600 text-white">
                  {shiftDuration}
                </Badge>
              </div>

              {/* Shift Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="size-4 text-primary" />
                    <p className="text-xs font-medium text-muted-foreground">
                      Total Sales
                    </p>
                  </div>
                  <p className="text-xl font-bold">
                    {formatPrice(currentShift.totalSales || 0)}
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="size-4 text-primary" />
                    <p className="text-xs font-medium text-muted-foreground">
                      Total Orders
                    </p>
                  </div>
                  <p className="text-xl font-bold">
                    {currentShift.totalOrders || 0}
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="size-4 text-primary" />
                    <p className="text-xs font-medium text-muted-foreground">
                      Net Sales
                    </p>
                  </div>
                  <p className="text-xl font-bold">
                    {formatPrice(currentShift.netSale || 0)}
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="size-4 text-primary" />
                    <p className="text-xs font-medium text-muted-foreground">
                      Refunds
                    </p>
                  </div>
                  <p className="text-xl font-bold">
                    {formatPrice(currentShift.totalRefunds || 0)}
                  </p>
                </div>
              </div>

              {/* End Shift Button */}
              <Button
                onClick={() => setShowEndShiftDialog(true)}
                disabled={actionLoading}
                variant="destructive"
                className="w-full gap-2"
              >
                {actionLoading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    Ending Shift...
                  </>
                ) : (
                  <>
                    <StopCircle className="size-4" />
                    End Shift & Logout
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              {/* No Active Shift */}
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 bg-muted rounded-full">
                    <Clock className="size-8 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-lg">No Active Shift</p>
                  <p className="text-sm text-muted-foreground">
                    Start your shift to begin taking orders
                  </p>
                </div>
                <Button
                  onClick={handleStartShift}
                  disabled={actionLoading}
                  className="gap-2"
                  size="lg"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" />
                      Starting Shift...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="size-4" />
                      Start Shift
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* End Shift Confirmation Dialog */}
      <AlertDialog
        open={showEndShiftDialog}
        onOpenChange={setShowEndShiftDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="size-5 text-destructive" />
              End Shift & Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p className="text-base">
                Are you sure you want to end your shift?
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-destructive font-bold mt-0.5">⚠️</span>
                  <p className="font-semibold text-destructive">
                    You will be logged out immediately after ending your shift.
                  </p>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <span className="text-amber-600 font-bold mt-0.5">ℹ️</span>
                  <p className="font-medium text-amber-700 dark:text-amber-500">
                    Only one shift per day is allowed. You cannot start another
                    shift until tomorrow.
                  </p>
                </div>
              </div>

              {currentShift && (
                <div className="mt-4 p-3 bg-muted rounded-lg space-y-1 text-sm border">
                  <p className="font-semibold mb-2 text-foreground">
                    Shift Summary:
                  </p>
                  <p>
                    <span className="font-medium">Shift Duration:</span>{" "}
                    {shiftDuration}
                  </p>
                  <p>
                    <span className="font-medium">Total Sales:</span>{" "}
                    {formatPrice(currentShift.totalSales || 0)}
                  </p>
                  <p>
                    <span className="font-medium">Total Orders:</span>{" "}
                    {currentShift.totalOrders || 0}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEndShift}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? (
                <>
                  <RefreshCw className="size-4 animate-spin mr-2" />
                  Ending Shift...
                </>
              ) : (
                <>
                  <LogOut className="size-4 mr-2" />
                  Yes, End Shift & Logout
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
