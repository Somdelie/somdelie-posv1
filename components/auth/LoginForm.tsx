"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { login } from "@/redux-toolkit/fetures/auth/authThunk";
import { getUserProfile } from "@/redux-toolkit/fetures/user/userThunk";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const roleRedirectMap: Record<string, string> = {
    ROLE_USER: "/user/profile",
    ROLE_SUPER_ADMIN: "/admin/dashboard",
    ROLE_STORE_ADMIN: "/store/admin",
    ROLE_BRANCH_CASHIER: "/cashier/dashboard",
    ROLE_BRANCH_MANAGER: "/branch-manager",
    ROLE_STORE_MANAGER: "/store-manager",
  };

  useEffect(() => {
    // Check if JWT exists in localStorage
    const jwt = localStorage.getItem("jwt");

    if (jwt) {
      // If JWT exists, redirect to home or fetch user profile
      // You might want to validate the JWT or fetch user profile here
      if (user?.role && roleRedirectMap[user.role]) {
        router.push(roleRedirectMap[user.role]);
      } else {
        router.push("/");
      }
    }

    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    // If user is already logged in (from Redux state), redirect them to their dashboard
    if (user && user.role) {
      const targetRoute = roleRedirectMap[user.role];
      router.push(targetRoute);
    }
  }, [user, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      toast.success("Login successful!");
      const user = result.payload.user;
      console.log("Logged in user:", user);
      router.push(roleRedirectMap[user.role] || "/");
      // Fetch user profile after successful login
      dispatch(getUserProfile(result.payload.jwt));
    } else {
      toast.error("Login failed. Invalid credentials!.");
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleLogin(values);
  }

  // Show loading state while checking authentication
  if (isCheckingAuth || (user && user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="mx-auto grid w-[450px] gap-6 border-b-4 border-green-900">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">
                {isCheckingAuth
                  ? "Checking authentication..."
                  : "Redirecting to dashboard..."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto grid w-[450px] gap-6 border-b-4 border-green-900">
        <CardHeader>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center text-rose-600">
              <Lock className="mr-2" /> Login
            </h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/auth/reset-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
