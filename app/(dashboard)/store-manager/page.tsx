import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
// import { StoreAnalytics } from "@/components/analytics/StoreAnalytics";

export default async function StoreManagerDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.storeId) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">
              No store assigned. Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Store Manager Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor store performance and analytics
        </p>
      </div>
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">
            Analytics modules are temporarily disabled.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
