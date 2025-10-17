"use client";

import { useState } from "react";
import {
  Plus,
  MapPin,
  Phone,
  Clock,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Building2,
  AlertCircle,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createBranch, deleteBranch } from "@/lib/actions/branches";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { TimePicker } from "@/components/ui/time-picker";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  workingDays: string[];
  openingTime: string | null;
  closingTime: string | null;
  createdAt: string;
  updatedAt: string;
  store: any;
  storeId: string;
  manager: any;
}

interface NewBranch {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  workingDays: string[];
  openingTime?: string;
  closingTime?: string;
}

interface BranchesClientProps {
  initialBranches: Branch[];
  storeId: string;
  errorMessage?: string | null;
}

export default function BranchesClient({
  initialBranches,
  storeId,
  errorMessage: initialError,
}: BranchesClientProps) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [newBranch, setNewBranch] = useState<NewBranch>({
    name: "",
    address: "",
    phone: "",
    email: "",
    workingDays: [],
    openingTime: "",
    closingTime: "",
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

  const handleAddBranch = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const branchData = {
        name: newBranch.name,
        address: newBranch.address,
        workingDays: newBranch.workingDays.map((d) => dayToEnum[d] ?? d),
        phone: newBranch.phone || undefined,
        email: newBranch.email || undefined,
        openingTime: newBranch.openingTime || undefined,
        closingTime: newBranch.closingTime || undefined,
      };

      console.log("Creating branch with data:", branchData);

      const result = await createBranch(storeId, branchData);

      if (result.success && result.branch) {
        setBranches((prev) => [...prev, result.branch]);
        setShowAddForm(false);
        setNewBranch({
          name: "",
          address: "",
          phone: "",
          email: "",
          workingDays: [],
          openingTime: "",
          closingTime: "",
        });
        console.log("Branch created successfully:", result.branch);
        toast.success("Branch created successfully");
      } else {
        console.error("Failed to create branch:", result.error);
        setError(result.error || "Failed to create branch");
        toast.error(result.error || "Failed to create branch");
      }
    } catch (error) {
      console.error("Error adding branch:", error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Unexpected error while creating branch");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBranch = (id: string) => {
    setPendingDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBranch = async () => {
    if (!pendingDeleteId) return;
    try {
      setError(null);
      console.log("Deleting branch with ID:", pendingDeleteId);

      const result = await deleteBranch(pendingDeleteId);

      if (result.success) {
        setBranches((prev) => prev.filter((b) => b.id !== pendingDeleteId));
        console.log("Branch deleted successfully");
        toast.success("Branch deleted");
      } else {
        console.error("Failed to delete branch:", result.error);
        setError(result.error || "Failed to delete branch");
        toast.error(result.error || "Failed to delete branch");
      }
    } catch (error) {
      console.error("Error deleting branch:", error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Unexpected error while deleting branch");
    } finally {
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleWorkingDayToggle = (day: string) => {
    setNewBranch((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const formatOpeningHours = (branch: Branch) => {
    if (branch.openingTime && branch.closingTime) {
      return `${branch.openingTime} - ${branch.closingTime}`;
    }
    return "Hours not set";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">
              Branches
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your store locations and branch information
            </p>
          </div>
          {/* dialog to add a new branch */}
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={18} />
                Add Branch
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[90vh] bg-card border-border overflow-hidden flex flex-col">
              <DialogHeader className="pb-4 border-b border-border">
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Add New Branch
                </DialogTitle>
              </DialogHeader>

              <div className="overflow-y-auto flex-1 py-6 px-1 -mx-1">
                <div className="space-y-5 pr-2">
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded p-4 flex items-start gap-3">
                      <AlertCircle
                        className="text-destructive flex-shrink-0 mt-0.5"
                        size={18}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setError(null)}
                        className="text-destructive hover:text-destructive/80"
                        aria-label="Dismiss error"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Branch Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={newBranch.name}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground text-sm placeholder:text-muted-foreground"
                      placeholder="Downtown Branch"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={newBranch.address}
                      onChange={(e) =>
                        setNewBranch({ ...newBranch, address: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground text-sm placeholder:text-muted-foreground"
                      placeholder="123 Main Street, City"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={newBranch.phone}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground text-sm placeholder:text-muted-foreground"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={newBranch.email}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, email: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground text-sm placeholder:text-muted-foreground"
                        placeholder="branch@store.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Opening Time
                      </label>
                      <TimePicker
                        value={newBranch.openingTime || ""}
                        onChangeAction={(t) =>
                          setNewBranch({ ...newBranch, openingTime: t })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Closing Time
                      </label>
                      <TimePicker
                        value={newBranch.closingTime || ""}
                        onChangeAction={(t) =>
                          setNewBranch({ ...newBranch, closingTime: t })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Working Days <span className="text-destructive">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map((day) => {
                        const active = newBranch.workingDays.includes(day);
                        return (
                          <Button
                            key={day}
                            type="button"
                            size="sm"
                            variant={active ? "default" : "outline"}
                            onClick={() => handleWorkingDayToggle(day)}
                          >
                            {day}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-border gap-3 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setError(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddBranch}
                  disabled={
                    submitting ||
                    !newBranch.name ||
                    !newBranch.address ||
                    newBranch.workingDays.length === 0
                  }
                >
                  {submitting ? "Adding..." : "Add Branch"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Display */}
        {error && !showAddForm && (
          <div className="mb-8 bg-destructive/10 border border-destructive/20 rounded p-4 flex items-start gap-3">
            <AlertCircle
              className="text-destructive flex-shrink-0 mt-0.5"
              size={18}
            />
            <div className="flex-1">
              <p className="text-sm text-destructive">{error}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setError(null)}
              className="text-destructive hover:text-destructive/80"
              aria-label="Dismiss error"
            >
              <X size={16} />
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-1">
                <Building2 className="text-muted-foreground" size={20} />
                <span className="text-sm text-muted-foreground font-medium">
                  Total Branches
                </span>
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {branches.length}
              </p>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground font-medium">
                  Active
                </span>
              </div>
              <p className="text-3xl font-semibold text-foreground">
                {branches.length}
              </p>
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
              <p className="text-3xl font-semibold text-foreground">
                {branches.reduce(
                  (total, branch) => total + branch.workingDays.length,
                  0
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Branches List */}
        {branches.length === 0 && !error ? (
          <Card className="text-center py-20">
            <Building2
              className="mx-auto text-muted-foreground mb-4"
              size={48}
            />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No branches yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Get started by adding your first branch
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {branches.map((branch) => (
              <Card
                key={branch.id}
                className="p-6 hover:shadow grid md:grid-cols-2 hover:border-primary/30 transition-all duration-200 group bg-gradient-to-br from-card to-card/50"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left: Branch Info */}
                  <div className="flex-1 min-w-0">
                    {/* Header with actions */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="text-primary" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-foreground mb-1 truncate">
                              {branch.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wide">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/store/branches/${branch.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 hover:text-primary"
                            aria-label="Edit branch"
                          >
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBranch(branch.id)}
                          className="hover:text-destructive hover:bg-destructive/10"
                          aria-label="Delete branch"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                        <div className="p-1.5 bg-blue-500/10 rounded">
                          <MapPin
                            className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                            size={16}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-0.5 font-medium">
                            Location
                          </p>
                          <p className="text-sm text-foreground line-clamp-2">
                            {branch.address}
                          </p>
                        </div>
                      </div>

                      {branch.phone && (
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <div className="p-1.5 bg-green-500/10 rounded">
                            <Phone
                              className="text-green-600 dark:text-green-400 flex-shrink-0"
                              size={16}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5 font-medium">
                              Phone
                            </p>
                            <p className="text-sm text-foreground">
                              {branch.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {branch.email && (
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border/50 sm:col-span-2">
                          <div className="p-1.5 bg-purple-500/10 rounded">
                            <Mail
                              className="text-purple-600 dark:text-purple-400 flex-shrink-0"
                              size={16}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground mb-0.5 font-medium">
                              Email
                            </p>
                            <p className="text-sm text-foreground truncate">
                              {branch.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Right: Working Days */}
                <div className="lg:border-l lg:border-border lg:pl-6 lg:min-w-[200px] flex flex-col justify-between">
                  <div className="">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="text-primary" size={18} />
                      <h4 className="text-sm font-semibold text-foreground">
                        Working Days
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {branch.workingDays.map((day) => {
                        const label = enumToShort[day] || day;
                        return (
                          <span
                            key={day}
                            className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-md border border-primary/20 hover:bg-primary/20 transition-colors"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {/* Opening hours */}{" "}
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                    <div className="p-1.5 bg-amber-500/20 rounded">
                      <Clock
                        className="text-amber-600 dark:text-amber-400"
                        size={16}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mb-0.5">
                        Opening Hours
                      </p>
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        {formatOpeningHours(branch)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manager Info */}
                {branch.manager && (
                  <div className="mt-5 pt-5 border-t border-border flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Building2
                        className="text-indigo-600 dark:text-indigo-400"
                        size={16}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">
                        Branch Manager
                      </p>
                      <p className="text-sm text-foreground font-semibold">
                        {branch.manager.name}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete branch?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              branch and remove its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded"
              onClick={confirmDeleteBranch}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
