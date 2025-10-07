"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Store,
  Building2,
  Phone,
  Mail,
  MapPin,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/utils/api";
import {
  logout,
  setUserStoreContext,
  replaceJwt,
} from "@/redux-toolkit/fetures/auth/authSlice";
import { elevateUserToStoreAdmin } from "@/redux-toolkit/fetures/user/userThunk";

// Schema aligned with backend DTO
const storeSchema = z.object({
  brandName: z.string().min(2, "Brand name required"),
  description: z.string().optional(),
  storeType: z.enum(["RETAIL", "WHOLESALE", "SERVICE"]),
  contact: z.object({
    address: z.string().min(3, "Address required"),
    phone: z.string().min(5, "Phone required"),
    email: z.string().email("Valid email required"),
  }),
});

type StoreFormValues = z.infer<typeof storeSchema>;

export default function CreateStore() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  type AuthUser = {
    profileImage?: string;
    fullName?: string;
    email?: string;
    role?: string;
    storeId?: string;
    phone?: string;
  };
  const authUser: AuthUser | undefined = useAppSelector(
    (s) => s.auth.user?.user
  );
  const [submitting, setSubmitting] = useState(false);
  const [createdStoreId, setCreatedStoreId] = useState<string | null>(null);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      brandName: "",
      description: "",
      storeType: "RETAIL",
      contact: {
        address: "",
        phone: authUser?.phone || "",
        email: authUser?.email || "",
      },
    },
  });

  // If user already has a storeId redirect to dashboard
  useEffect(() => {
    if (authUser?.storeId) {
      router.replace("/store/admin");
    }
  }, [authUser?.storeId, router]);

  const onSubmit: SubmitHandler<StoreFormValues> = async (values) => {
    setSubmitting(true);
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        toast.error("Session expired. Please login again.");
        dispatch(logout());
        router.push("/auth/login");
        return;
      }

      // Backend expects Authorization header with full token (already includes 'Bearer ' in middleware fetch?) -> we send Bearer prefix
      const response = await api.post("/api/stores", values, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const store = response.data; // expecting StoreDto (id, brandName, etc.)
      setCreatedStoreId(store.id);

      // Patch Redux auth with storeId and role elevation if needed
      dispatch(
        setUserStoreContext({
          storeId: store.id,
          role:
            authUser?.role === "ROLE_USER"
              ? "ROLE_STORE_ADMIN"
              : authUser?.role,
        })
      );

      // Persist role + storeId on backend (fire & forget)
      try {
        dispatch(
          elevateUserToStoreAdmin({
            storeId: store.id,
            role:
              authUser?.role === "ROLE_USER"
                ? "ROLE_STORE_ADMIN"
                : authUser?.role,
          })
        );
      } catch {}

      // Transitional cookie so middleware can recognize store until JWT updated by backend
      try {
        document.cookie = `storeCtx=${store.id}; path=/; max-age=3600; SameSite=Strict`;
      } catch {}

      // Optional: if backend returned a new JWT with storeId claim in headers or body
      const maybeJwt =
        (response.headers?.authorization as string) || response.data?.jwt;
      if (maybeJwt) {
        const token = maybeJwt.replace(/^Bearer\s+/i, "");
        dispatch(replaceJwt(token));
      }

      toast.success("Store created successfully! Redirecting...");

      // Try to refresh user profile silently (non-blocking)
      try {
        const refreshed = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        if (refreshed.data?.storeId) {
          dispatch(
            setUserStoreContext({
              storeId: refreshed.data.storeId,
              role: refreshed.data.role || authUser?.role,
            })
          );
        }
      } catch {
        // ignore
      }

      setTimeout(() => {
        router.replace("/store/admin");
      }, 900);
    } catch (error: any) {
      console.error("Create store error", error);
      toast.error(error.response?.data?.message || "Failed to create store");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Create Your Store
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Provide your store's basic profile. You can refine settings later.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(form.handleSubmit as any)(onSubmit)}
              className="space-y-8"
            >
              {/* Store Basics */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Store Profile
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Brand Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Cautie Shoppings"
                            {...field}
                          />
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Short description (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="storeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Type</FormLabel>
                        <FormControl>
                          <select
                            className="w-full border rounded-md px-3 py-2 bg-background"
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <option value="RETAIL">Retail</option>
                            <option value="WHOLESALE">Wholesale</option>
                            <option value="SERVICE">Service</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Contact */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Contact Details
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contact.address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address *</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
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
                </div>
              </section>

              <div className="flex items-center gap-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="min-w-[160px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Creating...
                    </>
                  ) : (
                    "Create Store"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>

              {createdStoreId && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Store ID: {createdStoreId}
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
