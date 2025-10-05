import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/formatDate";
import { UserIcon, ClockIcon, PlayCircleIcon, TimerIcon } from "lucide-react";
import React from "react";

const shiftData = {
  cashier: {
    fullName: "John Doe",
    shiftStart: "Sep 28, 2025 08:00 AM",
    shiftEnd: null, // Ongoing shift
    duration: "8 hours",
  },
};

const ShiftInformationCard = () => {
  const isOngoing = !shiftData.cashier.shiftEnd;

  return (
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
              {shiftData.cashier.fullName}
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
              {formatDate(new Date(shiftData.cashier.shiftStart))}
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
              {shiftData.cashier.shiftEnd
                ? formatDate(new Date(shiftData.cashier.shiftEnd))
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
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              {shiftData.cashier.duration}
            </span>
          </div>
        </div>

        {/* Subtle bottom accent */}
        <div className="mt-4 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
      </CardContent>
    </Card>
  );
};

export default ShiftInformationCard;
