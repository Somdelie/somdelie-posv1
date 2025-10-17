"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CashierAnalytics } from "@/components/analytics/CashierAnalytics";
import { getCurrentUser } from "@/lib/actions/auth";
import { BarChart3 } from "lucide-react";
import { User } from "@/lib/auth/permissions";

export default function CashierPerformancePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser();
      console.log("👤 Current User for Analytics:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !user.id) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">
              Unable to load user information
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          My Performance
        </h1>
        <p className="text-muted-foreground mt-1">
          View your sales performance and analytics
        </p>
      </div>

      {/* Analytics */}
      <CashierAnalytics cashierId={user.id} />
    </div>
  );
}
