import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function StoreManagerDashboard() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Store Manager Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your store management dashboard. Features coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}