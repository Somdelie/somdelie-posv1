"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import { createEmployee, type Branch } from "@/lib/actions/employees";
import { toast } from "react-toastify";

interface CreateEmployeeFormProps {
  storeId: string;
  branches: Branch[];
}

const USER_ROLES = [
  { value: "ROLE_STORE_ADMIN", label: "Store Admin" },
  { value: "ROLE_BRANCH_CASHIER", label: "Branch Cashier" },
  { value: "ROLE_BRANCH_MANAGER", label: "Branch Manager" },
  { value: "ROLE_STORE_MANAGER", label: "Store Manager" },
] as const;

// Roles that require branch assignment
const BRANCH_REQUIRED_ROLES = ["ROLE_BRANCH_CASHIER", "ROLE_BRANCH_MANAGER"];

export default function CreateEmployeeForm({
  storeId,
  branches,
}: CreateEmployeeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    role: "",
    password: "",
    branchId: "",
  });

  const selectedRole = formData.role;
  const requiresBranch = BRANCH_REQUIRED_ROLES.includes(selectedRole as any);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validation
      if (
        !formData.email ||
        !formData.fullName ||
        !formData.phone ||
        !formData.role ||
        !formData.password
      ) {
        const errorMessage = "All fields are required";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      if (
        requiresBranch &&
        (!formData.branchId || formData.branchId.trim() === "")
      ) {
        const errorMessage = "Branch selection is required for this role";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        const errorMessage = "Please enter a valid email address";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Phone validation (basic)
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        const errorMessage =
          "Please enter a valid phone number (minimum 10 digits)";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Password validation
      if (formData.password.length < 6) {
        const errorMessage = "Password must be at least 6 characters long";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const employeeData: any = {
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
      };

      // Only include branchId if the role requires it AND a valid branchId is selected
      if (
        requiresBranch &&
        formData.branchId &&
        formData.branchId.trim() !== ""
      ) {
        employeeData.branchId = formData.branchId;
      }

      console.log("Submitting employee data:", employeeData);

      const result = await createEmployee(storeId, employeeData);

      if (result.success) {
        toast.success(`Employee ${formData.fullName} created successfully!`);
        // Redirect to employees list
        router.push("/store/employees");
        router.refresh();
      } else {
        const errorMessage = result.error || "Failed to create employee";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Employee creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Clear branch selection if role doesn't require it
      ...(field === "role" &&
        !BRANCH_REQUIRED_ROLES.includes(value as any) && { branchId: "" }),
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create New Employee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee role" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Branch Selection - Only show if role requires it */}
            {requiresBranch && (
              <div className="space-y-2">
                <Label htmlFor="branch">
                  Branch * (Required for{" "}
                  {USER_ROLES.find((r) => r.value === selectedRole)?.label})
                </Label>
                {branches.length > 0 ? (
                  <Select
                    value={formData.branchId}
                    onValueChange={(value) =>
                      handleInputChange("branchId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} - {branch.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No branches available. Please create a branch first before
                      assigning cashiers or branch managers.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>

          {/* Role Information */}
          {selectedRole && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {BRANCH_REQUIRED_ROLES.includes(selectedRole as any)
                  ? `${
                      USER_ROLES.find((r) => r.value === selectedRole)?.label
                    } requires branch assignment and will have branch-level access.`
                  : `${
                      USER_ROLES.find((r) => r.value === selectedRole)?.label
                    } will have store-level access and does not require branch assignment.`}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (requiresBranch && branches.length === 0)}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Employee
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
