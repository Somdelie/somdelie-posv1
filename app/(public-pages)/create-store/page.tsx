"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { createStore } from "@/lib/actions/store";
import { toast } from "react-toastify";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating Store...
        </span>
      ) : (
        "Create Store"
      )}
    </Button>
  );
}

export default function CreateStorePage() {
  const [state, formAction] = useActionState(createStore, { success: true });

  // Handle toast notifications for store creation results
  useEffect(() => {
    if (state.success && state.store) {
      toast.success("Store created successfully! Welcome to your dashboard!");
    } else if (!state.success && state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-8 w-8 text-blue-600" />
              Create Your Store
            </CardTitle>
            <p className="text-muted-foreground">
              Set up your store to start managing inventory and sales.
            </p>
          </CardHeader>
          <CardContent>
            {state.success && state.store ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Store Created Successfully! 🎉
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your store "{state.store?.brandName ?? "Unnamed Store"}" has
                    been created.
                  </p>
                  <p className="text-green-600 font-medium">
                    ✅ Redirecting to dashboard...
                  </p>
                </div>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                {!state.success && state.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {state.error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Store Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter store name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your store (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Store address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Contact email"
                    />
                  </div>
                </div>

                <SubmitButton />
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
