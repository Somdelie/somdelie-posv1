import { getCurrentUser } from "@/lib/actions/auth";
import { getStoreEmployees, type Employee } from "@/lib/actions/employees";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users, Mail, Phone, Building2 } from "lucide-react";

const getRoleDisplay = (role: string) => {
  const roleMap: Record<string, { label: string; color: string }> = {
    ROLE_STORE_ADMIN: {
      label: "Store Admin",
      color: "bg-red-100 text-red-800",
    },
    ROLE_STORE_MANAGER: {
      label: "Store Manager",
      color: "bg-purple-100 text-purple-800",
    },
    ROLE_BRANCH_MANAGER: {
      label: "Branch Manager",
      color: "bg-blue-100 text-blue-800",
    },
    ROLE_BRANCH_CASHIER: {
      label: "Branch Cashier",
      color: "bg-green-100 text-green-800",
    },
  };

  return roleMap[role] || { label: role, color: "bg-gray-100 text-gray-800" };
};

export default async function EmployeesPage() {
  // Get current user to extract storeId
  const user = await getCurrentUser();

  console.log("Fetching employees for user:", user);

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.storeId) {
    console.error("No storeId found for user:", user);
    redirect("/create-store");
  }

  // Debug logging
  console.log("User object:", {
    id: user.id,
    email: user.email,
    role: user.role,
    storeId: user.storeId,
  });

  // Fetch employees for the store
  let employees: Employee[] = [];
  let errorMessage: string | null = null;

  try {
    const employeesResult = await getStoreEmployees(user.storeId);
    if (employeesResult.success) {
      employees = employeesResult.employees;
    } else {
      errorMessage = employeesResult.error || "Failed to fetch employees";
      console.error("Error fetching employees:", employeesResult.error);
    }
  } catch (error) {
    errorMessage = "An unexpected error occurred while fetching employees";
    console.error("Unexpected error:", error);
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Store Employees</h1>
            <p className="text-muted-foreground">
              Manage your store team members and their roles
            </p>
          </div>
          <Link href="/store/employees/create">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </Link>
        </div>

        {/* Error Display */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="text-red-600">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">
                  Error Loading Employees
                </h3>
                <p className="text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Cashiers</p>
                  <p className="text-2xl font-bold">
                    {
                      employees.filter(
                        (emp) => emp.role === "ROLE_BRANCH_CASHIER"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Managers</p>
                  <p className="text-2xl font-bold">
                    {
                      employees.filter((emp) => emp.role.includes("MANAGER"))
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold">
                    {
                      employees.filter((emp) => emp.role.includes("ADMIN"))
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employees List */}
        {employees.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => {
              const roleInfo = getRoleDisplay(employee.role);
              return (
                <Card
                  key={employee.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {employee.fullName}
                        </CardTitle>
                        <Badge className={roleInfo.color}>
                          {roleInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{employee.phone}</span>
                    </div>
                    {employee.branchId && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>Branch: {employee.branchId.slice(0, 8)}...</span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Created:{" "}
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No employees yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your team by adding your first employee.
              </p>
              <Link href="/store/employees/create">
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add First Employee
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
