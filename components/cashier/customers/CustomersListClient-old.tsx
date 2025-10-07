"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  SearchIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  RefreshCcwIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import {
  getCustomers,
  creatCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/redux-toolkit/fetures/customer/customerThunk";
import { toast } from "react-toastify";

type Customer = {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  createdAt?: string;
};

export function CustomersListClient() {
  const dispatch = useAppDispatch();
  const { customers, loading } = useAppSelector((state: any) => state.customer);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer: Customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.fullName?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.toLowerCase().includes(searchLower) ||
      customer.city?.toLowerCase().includes(searchLower)
    );
  });

  const handleAddCustomer = async () => {
    if (!formData.fullName || !formData.phone) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      const result = await dispatch(creatCustomer(formData));
      if (creatCustomer.fulfilled.match(result)) {
        toast.success("Customer added successfully!");
        setShowAddDialog(false);
        resetForm();
        dispatch(getCustomers());
      } else {
        toast.error((result.payload as string) || "Failed to add customer");
      }
    } catch (error) {
      toast.error("Error adding customer");
    }
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer || !formData.fullName || !formData.phone) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      const result = await dispatch(
        updateCustomer({
          customerId: selectedCustomer.id,
          customerData: formData,
        })
      );
      if (updateCustomer.fulfilled.match(result)) {
        toast.success("Customer updated successfully!");
        setShowEditDialog(false);
        resetForm();
        setSelectedCustomer(null);
        dispatch(getCustomers());
      } else {
        toast.error((result.payload as string) || "Failed to update customer");
      }
    } catch (error) {
      toast.error("Error updating customer");
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const result = await dispatch(deleteCustomer(selectedCustomer.id));
      if (deleteCustomer.fulfilled.match(result)) {
        toast.success("Customer deleted successfully!");
        setShowDeleteDialog(false);
        setSelectedCustomer(null);
        dispatch(getCustomers());
      } else {
        toast.error((result.payload as string) || "Failed to delete customer");
      }
    } catch (error) {
      toast.error("Error deleting customer");
    }
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      fullName: customer.fullName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
    });
  };

  const totalCustomers = filteredCustomers.length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <UserIcon className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Customer Management
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Manage your customer database
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                        Total Customers
                      </p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {customers.length}
                      </p>
                    </div>
                    <UserIcon className="size-8 text-blue-600/50 dark:text-blue-400/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                        Active Search
                      </p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {totalCustomers}
                      </p>
                    </div>
                    <SearchIcon className="size-8 text-green-600/50 dark:text-green-400/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">
                        Quick Actions
                      </p>
                      <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                        Add • Edit • Delete
                      </p>
                    </div>
                    <PlusIcon className="size-8 text-purple-600/50 dark:text-purple-400/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, phone, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => dispatch(getCustomers())}
                >
                  <RefreshCcwIcon className="size-4" />
                  Refresh
                </Button>
                <Button
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    resetForm();
                    setShowAddDialog(true);
                  }}
                >
                  <PlusIcon className="size-4" />
                  Add Customer
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto p-0">
            <div className="border border-slate-200 dark:border-slate-700 rounded mx-6 mb-6 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 dark:bg-blue-950/20">
                    <TableHead className="font-semibold text-blue-700 dark:text-blue-300">
                      Customer Name
                    </TableHead>
                    <TableHead className="font-semibold text-blue-700 dark:text-blue-300">
                      Contact
                    </TableHead>
                    <TableHead className="font-semibold text-blue-700 dark:text-blue-300">
                      Location
                    </TableHead>
                    <TableHead className="font-semibold text-blue-700 dark:text-blue-300 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <RefreshCcwIcon className="size-6 animate-spin mx-auto text-slate-400" />
                        <p className="text-sm text-slate-500 mt-2">
                          Loading customers...
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <UserIcon className="size-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                        <p className="text-slate-500 dark:text-slate-400">
                          {searchTerm
                            ? "No customers found"
                            : "No customers yet"}
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                          {searchTerm
                            ? "Try a different search"
                            : "Add your first customer to get started"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer: Customer) => (
                      <TableRow
                        key={customer.id}
                        className="hover:bg-blue-50/50 dark:hover:bg-blue-950/10 transition-colors duration-200"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                              <UserIcon className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">
                                {customer.fullName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                ID: {customer.id.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <PhoneIcon className="size-3 text-slate-500" />
                              <span className="text-slate-700 dark:text-slate-300">
                                {customer.phone}
                              </span>
                            </div>
                            {customer.email && (
                              <div className="flex items-center gap-2 text-xs">
                                <MailIcon className="size-3 text-slate-500" />
                                <span className="text-slate-600 dark:text-slate-400">
                                  {customer.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="size-4 text-slate-500" />
                            <div>
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                {customer.city || "N/A"}
                              </p>
                              {customer.address && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                  {customer.address}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openEditDialog(customer)}
                            >
                              <EditIcon className="size-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openDeleteDialog(customer)}
                            >
                              <TrashIcon className="size-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomer}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-fullName">Full Name *</Label>
              <Input
                id="edit-fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input
                id="edit-phone"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-city">City</Label>
              <Input
                id="edit-city"
                placeholder="New York"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditDialog(false);
                resetForm();
                setSelectedCustomer(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditCustomer}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedCustomer?.fullName}
              </span>{" "}
              from your customer database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedCustomer(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
