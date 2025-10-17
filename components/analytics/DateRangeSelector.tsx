"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useState } from "react";

interface DateRangeSelectorProps {
  onRangeChange?: (from: Date, to: Date) => void;
}

export function DateRangeSelector({ onRangeChange }: DateRangeSelectorProps) {
  const [activeRange, setActiveRange] = useState<string>("today");

  const getDateRange = (range: string): { from: Date; to: Date } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (range) {
      case "today":
        return { from: today, to: now };

      case "yesterday": {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        return { from: yesterday, to: yesterdayEnd };
      }

      case "week": {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { from: weekAgo, to: now };
      }

      case "month": {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return { from: monthAgo, to: now };
      }

      case "year": {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return { from: yearStart, to: now };
      }

      default:
        return { from: today, to: now };
    }
  };

  const handleRangeClick = (range: string) => {
    setActiveRange(range);
    const { from, to } = getDateRange(range);
    onRangeChange?.(from, to);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeRange === "today" ? "default" : "outline"}
          size="sm"
          onClick={() => handleRangeClick("today")}
        >
          Today
        </Button>
        <Button
          variant={activeRange === "yesterday" ? "default" : "outline"}
          size="sm"
          onClick={() => handleRangeClick("yesterday")}
        >
          Yesterday
        </Button>
        <Button
          variant={activeRange === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => handleRangeClick("week")}
        >
          Last 7 Days
        </Button>
        <Button
          variant={activeRange === "month" ? "default" : "outline"}
          size="sm"
          onClick={() => handleRangeClick("month")}
        >
          Last 30 Days
        </Button>
        <Button
          variant={activeRange === "year" ? "default" : "outline"}
          size="sm"
          onClick={() => handleRangeClick("year")}
        >
          This Year
        </Button>
      </div>
    </div>
  );
}
