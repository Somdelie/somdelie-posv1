"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loginAction } from "@/lib/actions/auth";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Logging in...
        </span>
      ) : (
        "Login"
      )}
    </Button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, { success: true });
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  // Handle client-side redirect after successful login
  useEffect(() => {
    // Prevent multiple redirects
    if (isRedirecting) return;

    if (state.success && state.redirectPath && !isRedirecting) {
      setIsRedirecting(true);
      toast.success("Login successful! Redirecting...");

      const handleRedirect = async () => {
        try {
          console.log("Attempting redirect to:", state.redirectPath);

          // Refresh user data first
          await refreshUser();

          // Use window.location.href for more reliable redirect in production
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.href = state.redirectPath!;
            } else {
              router.push(state.redirectPath!);
            }
          }, 500);
        } catch (error) {
          console.error("Redirect error:", error);
          setIsRedirecting(false);

          // Fallback redirect to dashboard
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.href = "/dashboard";
            } else {
              router.push("/dashboard");
            }
          }, 500);
        }
      };

      handleRedirect();
    } else if (!state.success && state.error) {
      toast.error(state.error);
      setIsRedirecting(false);
    }
  }, [
    state.success,
    state.redirectPath,
    state.error,
    router,
    refreshUser,
    isRedirecting,
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto grid w-[450px] gap-6 border-b-4 border-green-900">
        <CardHeader>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center text-rose-600">
              <Lock className="mr-2" /> Login
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials below to login to your account
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {!state.success && state.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username or email"
                required
                disabled={isRedirecting}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/reset-password"
                  className="text-sm underline text-muted-foreground"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  disabled={isRedirecting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                  disabled={isRedirecting}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <SubmitButton />

            {isRedirecting && (
              <div className="text-center text-sm text-green-600 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting to dashboard...
              </div>
            )}
          </form>
        </CardContent>

        <div className="mt-4 text-center text-sm pb-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="underline font-medium">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
