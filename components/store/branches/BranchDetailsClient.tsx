"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  UserPlus,
  User,
} from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";
import { toast } from "react-toastify";
import {
  showLoading,
  showSuccess,
  showError,
} from "@/components/ui/loading-toast";
import { updateBranch } from "@/lib/actions/branches";
import Link from "next/link";
import { updateEmployee, setBranchManager } from "@/lib/actions/employees";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  workingDays: string[];
  openingTime: string | null;
  closingTime: string | null;
  manager?: { id: string; name: string; email?: string } | null;
};

type Employee = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
};

export default function BranchDetailsClient({
  branch: initialBranch,
  employees,
}: {
  branch: Branch;
  employees: Employee[];
  storeId: string;
}) {
  const [branch, setBranch] = useState(initialBranch);
  const [openEdit, setOpenEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: branch.name || "",
    address: branch.address || "",
    phone: branch.phone || "",
    email: branch.email || "",
    workingDays: [...(branch.workingDays || [])],
    openingTime: branch.openingTime || "",
    closingTime: branch.closingTime || "",
  });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayToEnum: Record<string, string> = {
    Mon: "MONDAY",
    Tue: "TUESDAY",
    Wed: "WEDNESDAY",
    Thu: "THURSDAY",
    Fri: "FRIDAY",
    Sat: "SATURDAY",
    Sun: "SUNDAY",
  };
  const enumToShort: Record<string, string> = {
    MONDAY: "Mon",
    TUESDAY: "Tue",
    WEDNESDAY: "Wed",
    THURSDAY: "Thu",
    FRIDAY: "Fri",
    SATURDAY: "Sat",
    SUNDAY: "Sun",
  };

  const toggleDay = (d: string) => {
    setForm((prev) => {
      const enumVal = dayToEnum[d] ?? d;
      const hasShort = prev.workingDays.includes(d);
      const hasEnum = prev.workingDays.includes(enumVal);
      const isActive = hasShort || hasEnum;
      // Remove both representations first
      const trimmed = prev.workingDays.filter((x) => x !== d && x !== enumVal);
      const next = isActive ? trimmed : [...trimmed, d];
      return { ...prev, workingDays: Array.from(new Set(next)) };
    });
  };

  const save = async () => {
    try {
      setSaving(true);
      setError(null);
      const payload = {
        name: form.name.trim() || undefined,
        address: form.address.trim() || undefined,
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        // Map to backend enums and dedupe
        workingDays: Array.from(
          new Set(form.workingDays.map((d) => dayToEnum[d] ?? d))
        ),
        openingTime: form.openingTime || undefined,
        closingTime: form.closingTime || undefined,
      };
      const res = await updateBranch(branch.id, payload);
      if (res.success && res.branch) {
        setBranch({
          ...res.branch,
          // ensure display uses enum from API
          workingDays: res.branch.workingDays,
        });
        // Keep the edit form in sync (use short labels)
        setForm((prev) => ({
          ...prev,
          name: res.branch.name ?? prev.name,
          address: res.branch.address ?? prev.address,
          phone: (res.branch.phone as string) || "",
          email: (res.branch.email as string) || "",
          workingDays: (res.branch.workingDays || []).map(
            (d: string) => enumToShort[d] || d
          ),
          openingTime: res.branch.openingTime || "",
          closingTime: res.branch.closingTime || "",
        }));
        setOpenEdit(false);
        toast.success("Branch updated");
      } else {
        setError(res.error || "Failed to update branch");
        toast.error(res.error || "Failed to update branch");
      }
    } catch (e) {
      setError("Unexpected error updating branch");
      toast.error("Unexpected error updating branch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{branch.name}</h1>
          <p className="text-muted-foreground text-sm">Branch details</p>
        </div>
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogTrigger asChild>
            <Button>
              <Edit className="mr-2" size={16} /> Edit Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Branch</DialogTitle>
            </DialogHeader>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded p-3 flex items-start gap-2 text-sm">
                <AlertCircle className="text-destructive mt-0.5" size={16} />
                <span className="text-destructive">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone, UserPlus,
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Opening Time
                  </label>
                  <TimePicker
                    value={form.openingTime}
                    onChangeAction={(t) => setForm({ ...form, openingTime: t })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Closing Time
                  </label>
                  <TimePicker
                    value={form.closingTime}
                    onChangeAction={(t) => setForm({ ...form, closingTime: t })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Working Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map((d) => {
                    const active =
                      form.workingDays.includes(d) ||
                      form.workingDays.includes(dayToEnum[d]);
                    return (
                      <Button
                        key={d}
                        type="button"
                        size="sm"
                        variant={active ? "default" : "outline"}
                        onClick={() => toggleDay(d)}
                      >
                        {d}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setOpenEdit(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <Building2 className="text-muted-foreground" size={20} />
              <span className="text-sm text-muted-foreground font-medium">
                Address
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="mt-0.5" />
              {branch.address}
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <Clock className="text-muted-foreground" size={20} />
              <span className="text-sm text-muted-foreground font-medium">
                Hours
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {branch.openingTime && branch.closingTime
                ? `${branch.openingTime} - ${branch.closingTime}`
                : "Not set"}
            </div>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <Calendar className="text-muted-foreground" size={20} />
              <span className="text-sm text-muted-foreground font-medium">
                Working Days
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(branch.workingDays || []).map((d) => (
                <span
                  key={d}
                  className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded border border-border"
                >
                  {enumToShort[d] || d}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manager */}
      {branch.manager && (
        <Card className="p-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <User className="text-muted-foreground" size={20} />
              <span className="text-sm text-muted-foreground font-medium">
                Manager
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User size={16} /> {branch.manager.name}
              </div>
              {branch.manager.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} /> {branch.manager.email}
                </div>
              )}
              {branch.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} /> {branch.phone}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employees */}
      <Card className="p-0">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <User className="text-muted-foreground" size={20} />
              <span className="text-sm text-muted-foreground font-medium">
                Employees
              </span>
            </div>
            <Link href="/store/employees/create">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </Link>
          </div>
          {employees.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No employees assigned to this branch.
            </div>
          ) : (
            <div className="divide-y">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground font-medium truncate">
                      {emp.fullName}
                    </div>
                    <div className="text-muted-foreground text-xs flex items-center gap-3">
                      <span className="truncate">{emp.email}</span>
                      <span>{emp.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={emp.role}
                      onValueChange={async (newRole) => {
                        try {
                          if (newRole === emp.role) return;
                          const tid = showLoading(
                            newRole === "ROLE_BRANCH_MANAGER"
                              ? "Setting branch manager..."
                              : "Updating role..."
                          );
                          // If promoting to branch manager, use helper to ensure single manager
                          if (newRole === "ROLE_BRANCH_MANAGER") {
                            const res = await setBranchManager(
                              branch.id,
                              emp.id
                            );
                            if (res.success) {
                              showSuccess(tid, "Branch manager updated");
                            } else {
                              showError(
                                tid,
                                (res as any).error ||
                                  "Failed to set branch manager"
                              );
                            }
                          } else {
                            const res = await updateEmployee(emp.id, {
                              email: emp.email,
                              fullName: emp.fullName,
                              phone: emp.phone,
                              role: newRole,
                              // keep employee tied to this branch if it's a branch role
                              branchId: newRole.startsWith("ROLE_BRANCH_")
                                ? branch.id
                                : null,
                            });
                            if (res.success) {
                              showSuccess(tid, "Employee role updated");
                            } else {
                              const msg =
                                (res as any).error || "Failed to update role";
                              showError(tid, msg);
                            }
                          }
                        } catch (e) {
                          toast.dismiss();
                          toast.error("Unexpected error updating role");
                        }
                      }}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ROLE_BRANCH_CASHIER">
                          Branch Cashier
                        </SelectItem>
                        <SelectItem value="ROLE_BRANCH_MANAGER">
                          Branch Manager
                        </SelectItem>
                        <SelectItem value="ROLE_STORE_MANAGER">
                          Store Manager
                        </SelectItem>
                        <SelectItem value="ROLE_STORE_ADMIN">
                          Store Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
