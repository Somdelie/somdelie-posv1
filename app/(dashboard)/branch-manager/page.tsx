import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function BranchManagerDashboard() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Branch Manager Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your branch management dashboard. Features coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}