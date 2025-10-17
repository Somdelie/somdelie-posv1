"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  SearchIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  CreditCardIcon,
  BanknoteIcon,
  SmartphoneIcon,
  PackageIcon,
  Loader2,
  CheckCircle2,
  XCircleIcon,
  UserPlusIcon,
  PrinterIcon,
  DownloadIcon,
} from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";
import { getStoreProducts, type Product } from "@/lib/actions/products";
import { createOrder, type CreateOrderData } from "@/lib/actions/orders";
import {
  getCustomers,
  createCustomer,
  type Customer,
  type CreateCustomerData,
} from "@/lib/actions/customers";
import { toast } from "react-toastify";
import {
  showLoading,
  showSuccess,
  showError,
} from "@/components/ui/loading-toast";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { SalesReceipt } from "./SalesReceipt";

type CartItem = {
  product: Product;
  quantity: number;
  subtotal: number;
};

type POSClientProps = {
  storeId: string;
  branchId?: string;
  userId: string;
};

export default function POSClient({
  storeId,
  branchId,
  userId,
}: POSClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("walk-in");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Print and PDF handlers
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt_${completedOrder?.orderNumber || "Order"}`,
    onAfterPrint: () => {
      toast.success("Receipt printed successfully!");
    },
  });

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) {
      toast.error("Receipt not ready. Please try again.");
      return;
    }

    try {
      toast.info("Generating PDF...");

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 200], // 80mm thermal receipt width
      });

      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Receipt_${completedOrder?.orderNumber || "Order"}.pdf`);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // New customer form state
  const [newCustomer, setNewCustomer] = useState<CreateCustomerData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const result = await getStoreProducts(storeId);

      if (result.success && result.products) {
        setProducts(result.products);
        setFilteredProducts(result.products);
      } else {
        toast.error(result.error || "Failed to load products");
      }
      setLoading(false);
    }

    fetchProducts();
  }, [storeId]);

  // Fetch customers
  useEffect(() => {
    async function fetchCustomers() {
      const result = await getCustomers();

      if (result.success && result.data) {
        setCustomers(result.data);
      } else {
        toast.error(result.error || "Failed to load customers");
      }
    }

    fetchCustomers();
  }, []);

  // Filter products by search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * product.sellingPrice,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product,
          quantity: 1,
          subtotal: product.sellingPrice,
        },
      ]);
    }
    toast.success(`${product.name} added to cart`);
  };

  // Update quantity
  const updateQuantity = (productId: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) return null;
            return {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * item.product.sellingPrice,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
    toast.info("Item removed from cart");
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setSelectedCustomer("walk-in");
    setCustomerName("");
    setPaymentMethod("CASH");
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.0; // Adjust tax rate as needed
  const discount = 0; // Can add discount logic
  const total = subtotal + tax - discount;

  // Handle customer creation
  const handleCreateCustomer = async () => {
    if (!newCustomer.fullName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (!newCustomer.email.trim()) {
      toast.error("Customer email is required");
      return;
    }
    if (!newCustomer.phone.trim()) {
      toast.error("Customer phone is required");
      return;
    }

    const toastId = showLoading("Creating customer...");
    setCreatingCustomer(true);

    try {
      const result = await createCustomer(newCustomer);

      if (result.success && result.data) {
        showSuccess(toastId, "Customer created successfully!");

        // Add new customer to list
        setCustomers([...customers, result.data]);

        // Select the new customer
        setSelectedCustomer(result.data.id);

        // Reset form and close dialog
        setNewCustomer({
          fullName: "",
          email: "",
          phone: "",
          address: "",
        });
        setShowCustomerDialog(false);
      } else {
        showError(toastId, result.error || "Failed to create customer");
      }
    } catch (error) {
      showError(toastId, "An error occurred while creating customer");
    } finally {
      setCreatingCustomer(false);
    }
  };

  const confirmCheckout = async () => {
    const toastId = showLoading("Processing order...");
    setProcessingOrder(true);

    try {
      // Get customer info
      const customer =
        selectedCustomer && selectedCustomer !== "walk-in"
          ? customers.find((c) => c.id === selectedCustomer)
          : null;

      const orderData: CreateOrderData = {
        storeId,
        branchId,
        customer: customer
          ? {
              id: customer.id,
              fullName: customer.fullName,
              email: customer.email,
              phone: customer.phone,
              address: customer.address,
            }
          : null,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        paymentType: paymentMethod, // Backend expects paymentType (CASH, CARD, UPI)
      };

      const result = await createOrder(orderData);

      if (result.success && result.data) {
        // Prepare receipt data
        const receiptData = {
          ...result.data,
          items: cart.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.sellingPrice,
            subtotal: item.subtotal,
          })),
          createdAt: new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          cashier: {
            id: userId,
            fullName: "Current Cashier", // You can fetch actual name from user context
          },
        };

        setCompletedOrder(receiptData);
        showSuccess(
          toastId,
          `Order #${
            result.data.orderNumber || result.data.id.slice(-8)
          } completed successfully!`
        );
        clearCart();
        setShowCheckoutDialog(false);
        setShowReceiptDialog(true); // Show receipt dialog
      } else {
        showError(toastId, result.error || "Failed to process order");
      }
    } catch (error) {
      showError(toastId, "An error occurred while processing the order");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center shadow-md">
              <ShoppingCartIcon className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                POS Terminal
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Point of Sale System
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 overflow-auto p-4">
          <Card>
            <CardHeader>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-500" />
                <Input
                  placeholder="Search products by name, SKU, or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-500 p-0"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-0">
                      <div className="">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <PackageIcon className="size-16 text-slate-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 p-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 truncate">
                            SKU: {product.sku}
                          </p>
                          {product.brand && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 truncate">
                              {product.brand}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                              {formatPrice(product.sellingPrice)}
                            </span>
                            {product.mrp > product.sellingPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatPrice(product.mrp)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <PackageIcon className="size-16 text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No products found
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {searchTerm
                      ? "Try adjusting your search"
                      : "No products available"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="w-96 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Shopping Cart
            </h2>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCartIcon className="size-16 text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  Cart is empty
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Add products to start
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatPrice(item.product.sellingPrice)} ×{" "}
                            {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                updateQuantity(item.product.id, -1)
                              }
                            >
                              <MinusIcon className="size-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => updateQuantity(item.product.id, 1)}
                            >
                              <PlusIcon className="size-3" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-6 w-full"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <TrashIcon className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Subtotal
                  </span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Tax
                    </span>
                    <span className="font-semibold">{formatPrice(tax)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Discount
                    </span>
                    <span className="font-semibold text-red-600">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="text-green-600 dark:text-green-400">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Dialog
                  open={showCheckoutDialog}
                  onOpenChange={setShowCheckoutDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="flex-1" disabled={cart.length === 0}>
                      <CheckCircle2 className="size-4 mr-2" />
                      Checkout
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Complete Order</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Select Customer</Label>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowCustomerDialog(true)}
                            className="h-8"
                          >
                            <UserPlusIcon className="size-4 mr-2" />
                            New Customer
                          </Button>
                        </div>
                        <Select
                          value={selectedCustomer}
                          onValueChange={setSelectedCustomer}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Walk-in Customer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="walk-in">
                              <span className="text-slate-500">
                                Walk-in Customer
                              </span>
                            </SelectItem>
                            {customers.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {customer.fullName}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {customer.phone} • {customer.email}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <Select
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CASH">
                              <div className="flex items-center gap-2">
                                <BanknoteIcon className="size-4" />
                                <span>Cash</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="CARD">
                              <div className="flex items-center gap-2">
                                <CreditCardIcon className="size-4" />
                                <span>Card</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="UPI">
                              <div className="flex items-center gap-2">
                                <SmartphoneIcon className="size-4" />
                                <span>UPI</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Items</span>
                          <span className="text-sm font-semibold">
                            {cart.length}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Amount</span>
                          <span className="text-green-600 dark:text-green-400">
                            {formatPrice(total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        variant="outline"
                        onClick={() => setShowCheckoutDialog(false)}
                        disabled={processingOrder}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={confirmCheckout}
                        disabled={processingOrder}
                      >
                        {processingOrder ? (
                          <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-4 mr-2" />
                            Complete Order
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Customer Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Thamie Moyo"
                value={newCustomer.fullName}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ndumiso@gmail.com"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="0603121981"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                placeholder="57 jolex road kew"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowCustomerDialog(false);
                setNewCustomer({
                  fullName: "",
                  email: "",
                  phone: "",
                  address: "",
                });
              }}
              disabled={creatingCustomer}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCustomer} disabled={creatingCustomer}>
              {creatingCustomer ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlusIcon className="size-4 mr-2" />
                  Create Customer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-6 text-green-600" />
              Order Completed Successfully!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-center">
                Order{" "}
                <span className="font-bold">
                  #
                  {completedOrder?.orderNumber || completedOrder?.id?.slice(-8)}
                </span>{" "}
                has been processed successfully.
              </p>
              <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
                Total:{" "}
                <span className="font-semibold">
                  {formatPrice(completedOrder?.totalAmount || 0)}
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handlePrint}
              >
                <PrinterIcon className="size-4" />
                Print Receipt
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleDownloadPDF}
              >
                <DownloadIcon className="size-4" />
                Download PDF
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={() => {
                setShowReceiptDialog(false);
                setCompletedOrder(null);
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden Receipt Component for Printing/PDF */}
      {completedOrder && (
        <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
          <SalesReceipt ref={receiptRef} order={completedOrder} />
        </div>
      )}
    </div>
  );
}
