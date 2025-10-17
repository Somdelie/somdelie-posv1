import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Clock,
  Users as UsersIcon,
  UserSquare2,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth";
import { getBranchDetails } from "@/lib/actions/branches";
import { getBranchEmployees, Employee } from "@/lib/actions/employees";
import { notFound } from "next/navigation";
import { BranchAnalytics } from "@/components/analytics/BranchAnalytics";

function formatTime(t?: string | null) {
  if (!t) return "—";
  // Expecting HH:mm or HH:mm:ss
  const [h, m] = t.split(":");
  const hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${ampm}`;
}

function formatWorkingDays(days?: string[]) {
  if (!days || days.length === 0) return "—";
  // Backend uses enum-like names e.g. MONDAY; show short labels
  const map: Record<string, string> = {
    MONDAY: "Mon",
    TUESDAY: "Tue",
    WEDNESDAY: "Wed",
    THURSDAY: "Thu",
    FRIDAY: "Fri",
    SATURDAY: "Sat",
    SUNDAY: "Sun",
  };
  return days.map((d) => map[d] || d.slice(0, 3)).join(" · ");
}

export default async function BranchManagerDashboard() {
  const user = await getCurrentUser();
  if (!user) return notFound();

  // Branch Manager should have a branchId
  const branchId = user.branchId as string | undefined;
  if (!branchId) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Branch Manager Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No branch assigned to your account yet. Please contact your store
              admin.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const branchRes = await getBranchDetails(branchId);
  if (!branchRes.success || !branchRes.branch) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Branch Manager Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Failed to load branch details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const employeesRes = await getBranchEmployees(branchId);
  const employees: Employee[] = employeesRes.success
    ? employeesRes.employees
    : [];
  const totalStaff = employees.length;
  const cashiers = employees.filter(
    (e) => e.role === "ROLE_BRANCH_CASHIER"
  ).length;
  const manager = employees.find((e) => e.role === "ROLE_BRANCH_MANAGER");

  const branch = branchRes.branch;

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Building2 className="h-7 w-7" />
          <div>
            <h1 className="text-xl font-semibold leading-tight">
              {branch.name}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {branch.address}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {branch.phone ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> {branch.phone}
            </Badge>
          ) : null}
          {branch.email ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {branch.email}
            </Badge>
          ) : null}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UsersIcon className="h-5 w-5" /> Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {cashiers} cashiers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UserSquare2 className="h-5 w-5" /> Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {manager?.fullName || "—"}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {manager?.email || ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-5 w-5" /> Working Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {formatWorkingDays(branch.workingDays)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-5 w-5" /> Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {formatTime(branch.openingTime)} –{" "}
              {formatTime(branch.closingTime)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UsersIcon className="h-5 w-5" /> Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No employees assigned to this branch.
            </p>
          ) : (
            <div className="divide-y">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{emp.fullName}</div>
                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                      <span className="truncate">{emp.email}</span>
                      <span>{emp.phone}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="whitespace-nowrap">
                    {emp.role.replace("ROLE_", "").replaceAll("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Branch Analytics</h2>
        <BranchAnalytics branchId={branchId} />
      </div>
    </div>
  );
}
