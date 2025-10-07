"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux-toolkit/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  Store,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import api from "@/utils/api";
import { useAppDispatch } from "@/redux-toolkit/hooks";
import {
  setUserStoreContext,
  replaceJwt,
} from "@/redux-toolkit/fetures/auth/authSlice";

const storeFormSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province/State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  ownerName: z.string().min(2, "Owner name is required"),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

export default function OnboardingPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      storeName: "",
      description: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      country: "South Africa",
      phone: "",
      email: user?.email || "",
      ownerName: user?.fullName || "",
    },
  });

  const onSubmit = async (values: StoreFormValues) => {
    setIsSubmitting(true);
    try {
      const jwt = localStorage.getItem("jwt");

      // Create store via unified API shape
      const response = await api.post(
        "/api/stores",
        {
          brandName: values.storeName,
          description: values.description,
          storeType: "RETAIL",
          contact: {
            address: values.address,
            phone: values.phone,
            email: values.email,
          },
        },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      const store = response.data;

      // Transitional cookie & local role elevation
      try {
        document.cookie = `storeCtx=${store.id}; path=/; max-age=3600; SameSite=Strict`;
      } catch {}
      dispatch(
        setUserStoreContext({
          storeId: store.id,
          role:
            user?.user?.role === "ROLE_USER"
              ? "ROLE_STORE_ADMIN"
              : user?.user?.role,
        })
      );

      // Optional updated JWT support
      const maybeJwt =
        (response.headers?.authorization as string) || response.data?.jwt;
      if (maybeJwt) {
        const token = maybeJwt.replace(/^Bearer\s+/i, "");
        dispatch(replaceJwt(token));
      }

      toast.success("Store created successfully!");
      setStep(3);
      setTimeout(() => {
        router.push("/store/admin");
        router.refresh();
      }, 1200);
    } catch (error: any) {
      console.error("Store creation error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create store. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <Store className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">
              Welcome to Your POS System!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Let&apos;s get your store set up in just a few steps
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What you&apos;ll need:
              </h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Store name and description
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Business address and contact information
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  About 2-3 minutes of your time
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">
                As a Store Owner, you&apos;ll be able to:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                  <Building2 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">
                      Manage Multiple Branches
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Create and oversee all your store locations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                  <User className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Add Employees</p>
                    <p className="text-xs text-muted-foreground">
                      Invite managers, cashiers, and staff
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                  <Store className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Manage Inventory</p>
                    <p className="text-xs text-muted-foreground">
                      Track products across all branches
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">View Analytics</p>
                    <p className="text-xs text-muted-foreground">
                      Track sales and performance metrics
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full" size="lg">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Store Creation Form
  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="max-w-3xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Store className="w-6 h-6" />
              Create Your Store
            </CardTitle>
            <p className="text-muted-foreground">
              Fill in your store details to get started
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Store Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Store Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="storeName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Store Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="My Awesome Store" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your store..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <Input placeholder="Johannesburg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province/State *</FormLabel>
                          <FormControl>
                            <Input placeholder="Gauteng" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code *</FormLabel>
                          <FormControl>
                            <Input placeholder="2000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country *</FormLabel>
                          <FormControl>
                            <Input placeholder="South Africa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="+27 12 345 6789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="store@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Owner Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Store...
                      </>
                    ) : (
                      "Create Store"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Success
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Store Created Successfully!</h2>
          <p className="text-muted-foreground">
            Your store has been set up. Redirecting to your dashboard...
          </p>
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
