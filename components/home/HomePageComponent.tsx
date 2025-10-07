"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Store, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function HomePageComponent() {
  const { user, loading } = useAuth();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to POS System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive point-of-sale solution for modern businesses
          </p>
        </div>

        {/* User Status */}
        {loading ? (
          <div className="text-center">
            <p>Loading user information...</p>
          </div>
        ) : user ? (
          <div className="text-center space-y-4">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Welcome back, {user.email}!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Role: {user.role}
                </p>
                <Button asChild className="w-full">
                  <Link href="/store/admin">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please log in to access your dashboard
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Point of Sale
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Process sales transactions quickly and efficiently
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Store Management
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage multiple stores and locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Track sales performance and trends
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                User Management
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Manage staff and customer information
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="bg-muted rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">Ready to get started?</h2>
            <p className="text-muted-foreground">
              Join thousands of businesses using our POS system
            </p>
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Start Your Free Trial</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
