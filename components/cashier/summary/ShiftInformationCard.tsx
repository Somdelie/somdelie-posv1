"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { formatDate } from "@/lib/formatDate";
import {
  UserIcon,
  ClockIcon,
  PlayCircleIcon,
  TimerIcon,
  StopCircle,
  LogOut,
  RefreshCw,
} from "lucide-react";
import {
  startShift,
  endShift,
  getCurrentShift,
  type ShiftReport,
} from "@/lib/actions/shift";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { clearJWT } from "@/lib/auth/jwt-utils";

interface ShiftInformationCardProps {
  onShiftStarted?: () => void;
}

const ShiftInformationCard = ({
  onShiftStarted,
}: ShiftInformationCardProps) => {
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
        // Notify parent component that shift has started
        if (onShiftStarted) {
          onShiftStarted();
        }
      } else {
        // Check for specific error message about shift already started today
        const errorMessage = result.error || "Failed to start shift";
        if (errorMessage.includes("already started for today")) {
          toast.error(
            "Shift limit reached: Only one shift per day is allowed. Your shift for today has been completed. You can start a new shift tomorrow.",
            { autoClose: 7000 }
          );
        } else {
          toast.error(errorMessage);
        }
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

  const isOngoing = currentShift && !currentShift.shiftEnd;

  if (loading) {
    return (
      <Card className="relative overflow-hidden border-0 shadow bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="size-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // No active shift
  if (!currentShift) {
    return (
      <Card className="relative overflow-hidden border-0 shadow bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        <CardContent className="relative z-10">
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-muted rounded-full">
                <ClockIcon className="size-8 text-muted-foreground" />
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
                  Starting...
                </>
              ) : (
                <>
                  <PlayCircleIcon className="size-4" />
                  Start Shift
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="relative overflow-hidden border-0 shadow bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 hover:shadow transition-all duration-300 group">
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>

        <CardContent className="relative z-10">
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center shadow-md">
                  <TimerIcon className="size-4 text-white" />
                </div>
                {isOngoing && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                Shift Information
              </h2>
            </div>
            {isOngoing && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-semibold shadow-sm">
                <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                LIVE
              </div>
            )}
          </div>

          {/* Compact Information Grid */}
          <div className="space-y-1">
            <div className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200 group/item">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200">
                  <UserIcon className="size-3 text-white" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Cashier:
                </span>
              </div>
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {currentShift.cashier.fullName}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200 group/item">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200">
                  <PlayCircleIcon className="size-3 text-white" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Shift Start:
                </span>
              </div>
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {parseShiftStartTime(
                  currentShift.shiftStart
                ).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200 group/item">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200 ${
                    isOngoing
                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                      : "bg-gradient-to-br from-red-400 to-pink-500"
                  }`}
                >
                  <ClockIcon className="size-3 text-white" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Shift End:
                </span>
              </div>
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                {currentShift.shiftEnd
                  ? parseShiftStartTime(
                      currentShift.shiftEnd
                    ).toLocaleTimeString()
                  : "Ongoing"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/60 transition-all duration-200 group/item">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-violet-500 rounded-md flex items-center justify-center shadow-sm group-hover/item:scale-110 transition-transform duration-200">
                  <TimerIcon className="size-3 text-white" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Duration:
                </span>
              </div>
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 font-mono">
                {shiftDuration || "00:00:00"}
              </span>
            </div>
          </div>

          {/* End Shift Button */}
          {isOngoing && (
            <Button
              onClick={() => setShowEndShiftDialog(true)}
              disabled={actionLoading}
              variant="destructive"
              size="sm"
              className="w-full gap-2 mt-3"
            >
              <StopCircle className="size-4" />
              End Shift & Logout
            </Button>
          )}

          {/* Subtle bottom accent */}
          <div className="mt-4 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
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

              <div className="mt-4 p-3 bg-muted rounded-lg space-y-1 text-sm border">
                <p className="font-semibold mb-2 text-foreground">
                  Shift Summary:
                </p>
                <p>
                  <span className="font-medium">Shift Duration:</span>{" "}
                  {shiftDuration}
                </p>
                <p>
                  <span className="font-medium">Total Orders:</span>{" "}
                  {currentShift.totalOrders || 0}
                </p>
              </div>
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
};

export default ShiftInformationCard;
