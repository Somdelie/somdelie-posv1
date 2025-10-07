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
import { useEffect, useState, useRef } from "react";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { login } from "@/redux-toolkit/fetures/auth/authThunk";
import { getUserProfile } from "@/redux-toolkit/fetures/user/userThunk";
import { fetchCurrentUserStore } from "@/redux-toolkit/fetures/store/storeThunk";
import { useRouter, usePathname } from "next/navigation";

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
  const [redirecting, setRedirecting] = useState(false);
  const redirectAttemptedRef = useRef(false);
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  const roleRedirectMap: Record<string, string> = {
    ROLE_USER: "/user/profile",
    ROLE_SUPER_ADMIN: "/admin/dashboard",
    ROLE_STORE_ADMIN: "/store/admin",
    ROLE_BRANCH_CASHIER: "/cashier/dashboard",
    ROLE_BRANCH_MANAGER: "/branch-manager",
    ROLE_STORE_MANAGER: "/store-manager",
  };

  const getEffectiveRole = (u: any): string | undefined =>
    u?.role || u?.user?.role;

  // Initial auth check
  useEffect(() => {
    const jwt =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (jwt) {
      const effectiveRole = getEffectiveRole(user);
      const target = effectiveRole ? roleRedirectMap[effectiveRole] : undefined;
      if (target && pathname !== target && !redirectAttemptedRef.current) {
        redirectAttemptedRef.current = true;
        setRedirecting(true);
        router.push(target);
      }
    }
    setIsCheckingAuth(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to user state changes
  useEffect(() => {
    if (!user) return;
    const effectiveRole = getEffectiveRole(user);
    const target = effectiveRole ? roleRedirectMap[effectiveRole] : undefined;
    if (target && pathname !== target && !redirectAttemptedRef.current) {
      redirectAttemptedRef.current = true;
      setRedirecting(true);
      router.push(target);
    } else if (target && pathname === target) {
      setRedirecting(false);
    } else if (!target) {
      setRedirecting(false);
    }
  }, [user, pathname, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setRedirecting(true);
    const result = await dispatch(login(values));
    if (!login.fulfilled.match(result)) {
      toast.error("Login failed. Invalid credentials!.");
      setRedirecting(false);
      return;
    }
    toast.success("Login successful!");
    const payloadUser = result.payload.user;
    const effectiveRole = getEffectiveRole(payloadUser);
    dispatch(getUserProfile(result.payload.jwt));
    dispatch(fetchCurrentUserStore());
    const target = effectiveRole ? roleRedirectMap[effectiveRole] : undefined;
    if (target) {
      redirectAttemptedRef.current = true;
      router.push(target);
      // safety timeout
      setTimeout(() => {
        if (pathname === "/auth/login") setRedirecting(false);
      }, 2500);
    } else {
      router.push("/");
      setRedirecting(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleLogin(values);
  }

  // Show loading state while checking authentication
  const effectiveRole = getEffectiveRole(user);
  if (isCheckingAuth || redirecting) {
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
              {!isCheckingAuth && !effectiveRole && (
                <p className="text-xs text-yellow-600 text-center">
                  Still here? Role not resolved yet. You can refresh or log out.
                </p>
              )}
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
