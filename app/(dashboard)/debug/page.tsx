import { getCurrentUser } from "@/lib/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DebugPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Debug User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>

          <div className="mt-4 space-y-2">
            <p>
              <strong>User exists:</strong> {user ? "Yes" : "No"}
            </p>
            <p>
              <strong>Store ID:</strong> {user?.storeId || "Not found"}
            </p>
            <p>
              <strong>Role:</strong> {user?.role || "Not found"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "Not found"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
