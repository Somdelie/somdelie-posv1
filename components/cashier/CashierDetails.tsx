"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  BarcodeIcon,
  Check,
  ChevronsUpDown,
  CreditCard,
  NotebookText,
  Plus,
  SearchIcon,
  ShoppingBag,
  Tag,
  User,
  UserPlus,
  Minus,
  Pause,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/formatPrice";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { toast } from "react-toastify";
import { getProductsByStore } from "@/redux-toolkit/fetures/product/productThunk";
import { getCategoriesByStore } from "@/redux-toolkit/fetures/category/categoryThunk";
import { createOrder } from "@/redux-toolkit/fetures/order/orderThunk";
import {
  getCustomers,
  creatCustomer,
} from "@/redux-toolkit/fetures/customer/customerThunk";
import { Customer } from "@/redux-toolkit/fetures/customer/customerSlice";
import {
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  setSelectedCustomer as setCartCustomer,
  setNote as setCartNote,
  setDiscount as setCartDiscount,
  addHeldOrder,
  removeHeldOrder,
  restoreHeldOrder,
} from "@/redux-toolkit/fetures/cart/cartSlice";

interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  mrp: number;
  image: string;
  category: string;
  categoryName?: string;
  brand?: string;
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
  price: number; // Keep price for cart calculations (derived from sellingPrice)
}

const CashierDetails = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { branch } = useAppSelector((state) => state.branch);
  const { products } = useAppSelector((state) => state.product);
  const { customers } = useAppSelector((state) => state.customer);
  const { categories } = useAppSelector((state) => state.category);

  // Get cart state from Redux
  const cartState = useAppSelector((state) => state.cart);
  const cartItems = cartState.items;
  const selectedCustomer = cartState.selectedCustomer;
  const note = cartState.note;
  const discount = cartState.discount;
  const heldOrders = cartState.heldOrders;

  // Ensure customers is always an array
  const customerList = Array.isArray(customers) ? customers : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");

  // New Customer Dialog State
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isHeldOrdersOpen, setIsHeldOrdersOpen] = useState(false);
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleCustomerSelect = (customerId: string) => {
    const customer = customerList.find(
      (customer) => customer.id === customerId
    );
    dispatch(setCartCustomer(customer || null));
    setOpen(false);
  };

  // Handle adding new customer
  const handleAddNewCustomer = async () => {
    // Trim and validate fields
    const trimmedData = {
      fullName: newCustomer.fullName.trim(),
      email: newCustomer.email.trim(),
      phone: newCustomer.phone.trim(),
      address: newCustomer.address.trim(),
    };

    if (!trimmedData.fullName || !trimmedData.email || !trimmedData.phone) {
      toast.error("Please fill in all required fields (Name, Email, Phone)");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    console.log("Original data:", newCustomer);
    console.log("Trimmed data:", trimmedData);

    try {
      // Use camelCase format (backend will transform to snake_case)
      const customerData = {
        fullName: trimmedData.fullName,
        email: trimmedData.email,
        phone: trimmedData.phone,
        address: trimmedData.address || null,
      };

      const result = await dispatch(creatCustomer(customerData as any));
      console.log(customerData, "new customer data being sent");
      if (creatCustomer.fulfilled.match(result)) {
        toast.success("Customer added successfully!");
        // Select the newly created customer
        dispatch(setCartCustomer(result.payload));
        // Reset form
        setNewCustomer({ fullName: "", email: "", phone: "", address: "" });
        setIsAddCustomerOpen(false);
        setOpen(false);
      } else {
        console.error("Customer creation failed:", result.payload);
        toast.error((result.payload as string) || "Failed to add customer");
      }
    } catch (error) {
      console.error("Customer creation error:", error);
      toast.error("Error adding customer: " + (error as any).message);
    }
  };

  useEffect(() => {
    if (branch?.storeId) {
      dispatch(getProductsByStore(branch.storeId));
      dispatch(getCategoriesByStore(branch.storeId));
    }
  }, [branch]);

  // Add product to cart
  const addToCart = (product: Product) => {
    dispatch(addItem({ ...product, price: product.sellingPrice }));
  };

  // Increase quantity
  const handleIncreaseQuantity = (id: string) => {
    dispatch(increaseQuantity(id));
  };

  // Decrease quantity
  const handleDecreaseQuantity = (id: string) => {
    dispatch(decreaseQuantity(id));
  };

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  console.log(customerList, "customers list");

  // Remove item from cart
  const handleRemoveFromCart = (id: string) => {
    dispatch(removeItem({ id }));
  };

  // Filter products based on search term and category
  const filteredProducts = products
    .map((product: any) => ({
      id: product.id,
      name: product.name ?? "",
      sku: product.sku ?? "",
      sellingPrice: product.sellingPrice ?? 0,
      mrp: product.mrp ?? 0,
      image: product.image ?? "",
      category: product.categoryId ?? "",
      categoryName: product.categoryName ?? "",
      brand: product.brand ?? "",
      description: product.description ?? "",
    }))
    .filter((product: Product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  // Calculate summary
  const subtotal = cartItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax

  // Calculate discount amount
  const discountAmount =
    discount.type === "percentage"
      ? (subtotal * discount.value) / 100
      : discount.value;

  const total = subtotal + tax - discountAmount;

  // Debug logging
  console.log("Cart calculation debug:", {
    cartItems: cartItems.map((item: any) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      lineTotal: item.price * item.quantity,
    })),
    subtotal,
    tax,
    discountAmount,
    total,
  });

  // Process payment
  const processPayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    if (!selectedCustomer) {
      toast.error("Please select a customer!");
      return;
    }

    try {
      // Prepare order data to match backend structure
      const orderData = {
        customer: {
          id: selectedCustomer.id,
          fullName: selectedCustomer.fullName,
          email: selectedCustomer.email,
          phone: selectedCustomer.phone,
          address: selectedCustomer.address,
        },
        items: cartItems.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentType: paymentMethod.toUpperCase(), // CASH, CARD, UPI
      };

      console.log("Creating order:", orderData);

      // Create order via API
      const result = await dispatch(createOrder(orderData as any));

      if (createOrder.fulfilled.match(result)) {
        // Show success alert dialog
        setPaymentTotal(total);
        setIsPaymentSuccessOpen(true);

        // Reset cart using Redux
        dispatch(clearCart());

        toast.success("Order created successfully!");
      } else {
        console.error("Order creation failed:", result.payload);
        toast.error((result.payload as string) || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error("Error creating order: " + (error as any).message);
    }
  };

  // Hold order
  const holdOrder = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    const heldOrder = {
      id: Date.now(),
      customer: selectedCustomer,
      items: [...cartItems],
      discount,
      note,
      subtotal,
      tax,
      total,
      date: new Date().toISOString(),
    };

    dispatch(addHeldOrder(heldOrder));
    toast.success("Order held successfully!");

    // Reset cart using Redux
    dispatch(clearCart());
  };

  return (
    <div className="h-screen overflow-hidden bg-muted/30">
      <div className="h-full p-6 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Search and Actions Bar */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                      >
                        <ShoppingBag className="size-4" />
                        <span className="hidden sm:inline">Cart</span>
                        <span className="font-semibold">
                          ({cartItems.length})
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => setIsHeldOrdersOpen(true)}
                      >
                        <Pause className="size-4" />
                        <span className="hidden sm:inline">Held</span>
                        {heldOrders.length > 0 && (
                          <span className="font-semibold">
                            ({heldOrders.length})
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive bg-transparent"
                        onClick={() => {
                          if (cartItems.length === 0) {
                            toast.info("Cart is already empty!");
                            return;
                          }
                          if (
                            confirm("Are you sure you want to clear the cart?")
                          ) {
                            dispatch(clearCart());
                            toast.success("Cart cleared!");
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                        <span className="hidden sm:inline">Clear</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products Grid */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Products</h3>
                      <p className="text-sm text-muted-foreground">
                        {filteredProducts.length}{" "}
                        {filteredProducts.length === 1 ? "product" : "products"}{" "}
                        found
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 bg-transparent"
                    >
                      <BarcodeIcon className="size-4" />
                      Scan
                    </Button>
                  </div>

                  {/* Category Tabs */}
                  <div className="mt-4 relative">
                    <Tabs
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                        <TabsList className="inline-flex w-auto min-w-full justify-start h-auto p-1">
                          <TabsTrigger
                            value="all"
                            className="flex-shrink-0 whitespace-nowrap"
                          >
                            All
                          </TabsTrigger>
                          {categories.map((category: any) => (
                            <TabsTrigger
                              key={category.id}
                              value={category.id}
                              className="flex-shrink-0 whitespace-nowrap"
                            >
                              {category.name || category.id}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
                      {filteredProducts.map((product) => (
                        <div
                          key={product?.id}
                          className="group border rounded overflow-hidden bg-card hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-square relative bg-muted border-b">
                            <Image
                              fill
                              src={product?.image || "/placeholder.svg"}
                              alt={product?.name}
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3 space-y-2">
                            <div>
                              <h4 className="font-medium text-sm line-clamp-1">
                                {product?.name}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-1 ">
                                {product?.sku}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="font-semibold">
                                  {formatPrice(product?.sellingPrice)}
                                </p>
                                {product?.mrp > product?.sellingPrice && (
                                  <p className="text-xs text-muted-foreground line-through">
                                    {formatPrice(product?.mrp)}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="size-8"
                                onClick={() => addToCart(product)}
                              >
                                <Plus className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Image
                        src="/empty-cart.png"
                        alt="No products"
                        width={200}
                        height={100}
                      />
                      <p className="text-sm text-muted-foreground mt-4">
                        No products found
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cart Items */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg">Cart Items</h3>
                </CardHeader>
                <CardContent>
                  {cartItems?.length > 0 ? (
                    <div className="space-y-3">
                      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {cartItems?.map((product: any) => (
                          <div
                            key={product?.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                          >
                            <div className="size-16 relative rounded-md overflow-hidden bg-muted flex-shrink-0 border-b">
                              <Image
                                fill
                                src={product?.image || "/placeholder.svg"}
                                alt={product?.name}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-1">
                                {product?.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {formatPrice(product?.price)} ×{" "}
                                {product?.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-8 bg-transparent"
                                onClick={() =>
                                  handleDecreaseQuantity(product.id)
                                }
                              >
                                <Minus className="size-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {product.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="size-8 bg-transparent"
                                onClick={() =>
                                  handleIncreaseQuantity(product.id)
                                }
                              >
                                <Plus className="size-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span className="font-medium">
                            {formatPrice(subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Tax (10%)
                          </span>
                          <span className="font-medium">
                            {formatPrice(tax)}
                          </span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span className="font-medium">
                              -{formatPrice(discountAmount)}
                            </span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Image
                        src="/empty-cart.png"
                        alt="Empty cart"
                        width={200}
                        height={100}
                      />
                      <p className="text-lg font-semibold mt-4">
                        Your cart is empty
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Add products to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Customer Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="size-5" />
                    Customer
                  </h3>
                </CardHeader>
                <CardContent>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-transparent"
                      >
                        {selectedCustomer
                          ? selectedCustomer.fullName
                          : "Select a customer..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command className="md:min-w-[350px]">
                        <CommandInput placeholder="Search by customer name..." />
                        <CommandList>
                          <CommandEmpty>No customers found.</CommandEmpty>
                          <CommandGroup>
                            {customerList.map((customer) => (
                              <CommandItem
                                key={customer.id}
                                value={`${customer.fullName} ${customer.email}`}
                                onSelect={() =>
                                  handleCustomerSelect(customer.id)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCustomer?.id === customer.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {customer.fullName}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {customer.email}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                            <CommandItem
                              onSelect={() => {
                                setNewCustomer({
                                  fullName: "",
                                  email: "",
                                  phone: "",
                                  address: "",
                                });
                                setIsAddCustomerOpen(true);
                                setOpen(false);
                              }}
                              className="cursor-pointer border-t"
                            >
                              <UserPlus className="mr-2 h-4 w-4 text-blue-600" />
                              <span className="text-blue-600 font-medium">
                                Add New Customer
                              </span>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              {/* Add New Customer Dialog */}
              <Dialog
                open={isAddCustomerOpen}
                onOpenChange={setIsAddCustomerOpen}
              >
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Add New Customer
                    </DialogTitle>
                    <DialogDescription>
                      Enter the customer's information to add them to the
                      database.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fullName" className="text-right">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={newCustomer.fullName}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            fullName: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            email: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            phone: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Address
                      </Label>
                      <Input
                        id="address"
                        value={newCustomer.address}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            address: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="Enter address (optional)"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddCustomerOpen(false);
                        setNewCustomer({
                          fullName: "",
                          email: "",
                          phone: "",
                          address: "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleAddNewCustomer}>
                      Add Customer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Held Orders Dialog */}
              <Dialog
                open={isHeldOrdersOpen}
                onOpenChange={setIsHeldOrdersOpen}
              >
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Pause className="h-5 w-5" />
                      Held Orders ({heldOrders.length})
                    </DialogTitle>
                    <DialogDescription>
                      Click on an order to restore it to the cart.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-[400px] overflow-y-auto">
                    {heldOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No held orders
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {heldOrders.map((order: any) => (
                          <div
                            key={order.id}
                            className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => {
                              dispatch(restoreHeldOrder(order));
                              setIsHeldOrdersOpen(false);
                              toast.success("Order restored to cart!");
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">
                                  {order.customer?.fullName ||
                                    "Walk-in Customer"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.date).toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">
                                  {formatPrice(order.total)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {order.items.length} item(s)
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(restoreHeldOrder(order));
                                  setIsHeldOrdersOpen(false);
                                  toast.success("Order restored to cart!");
                                }}
                              >
                                Restore
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(removeHeldOrder(order.id));
                                  toast.success("Held order deleted!");
                                }}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsHeldOrdersOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Payment Success Alert Dialog */}
              <AlertDialog
                open={isPaymentSuccessOpen}
                onOpenChange={setIsPaymentSuccessOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-green-600">
                      <CreditCard className="h-5 w-5" />
                      Payment Processed Successfully!
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-lg pt-2">
                      Total:{" "}
                      <span className="font-bold text-foreground">
                        {formatPrice(paymentTotal)}
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      onClick={() => setIsPaymentSuccessOpen(false)}
                    >
                      OK
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Discount */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Tag className="size-5" />
                    Discount
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="0"
                    type="number"
                    value={discount.value}
                    onChange={(e) =>
                      dispatch(
                        setCartDiscount({
                          type: discount.type,
                          value: Number(e.target.value),
                        })
                      )
                    }
                    min="0"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() =>
                        dispatch(
                          setCartDiscount({
                            type: "percentage",
                            value: discount.value,
                          })
                        )
                      }
                      variant={
                        discount.type === "percentage" ? "default" : "outline"
                      }
                      size="sm"
                    >
                      %
                    </Button>
                    <Button
                      onClick={() =>
                        dispatch(
                          setCartDiscount({
                            type: "amount",
                            value: discount.value,
                          })
                        )
                      }
                      variant={
                        discount.type === "amount" ? "default" : "outline"
                      }
                      size="sm"
                    >
                      $
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Note */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <NotebookText className="size-5" />
                    Note
                  </h3>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Type your message here."
                    className="resize-none min-h-[100px]"
                    value={note}
                    onChange={(e) => dispatch(setCartNote(e.target.value))}
                  />
                </CardContent>
              </Card>

              {/* Payment Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg">Payment Actions</h3>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {/* Payment Method Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Payment Method
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={
                          paymentMethod === "cash" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPaymentMethod("cash")}
                        className="w-full"
                      >
                        💵 Cash
                      </Button>
                      <Button
                        type="button"
                        variant={
                          paymentMethod === "card" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPaymentMethod("card")}
                        className="w-full"
                      >
                        💳 Card
                      </Button>
                      <Button
                        type="button"
                        variant={
                          paymentMethod === "upi" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPaymentMethod("upi")}
                        className="w-full"
                      >
                        📱 UPI
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <Button className="w-full" size="lg" onClick={processPayment}>
                    <CreditCard className="size-5 mr-2" />
                    Process Payment
                  </Button>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    size="lg"
                    onClick={holdOrder}
                  >
                    <Pause className="size-4 mr-2" />
                    Hold Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierDetails;
