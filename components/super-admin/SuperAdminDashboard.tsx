"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Users, TrendingUp, BarChart3 } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import Link from "next/link";
import { getStores } from "@/redux-toolkit/fetures/store/storeThunk";
import { getAllUsers } from "@/redux-toolkit/fetures/user/userThunk";

export function SuperAdminDashboard() {
  const dispatch = useAppDispatch();
  const {
    userProfile,
    users,
    loading: usersLoading,
  } = useAppSelector((state: any) => state.user);
  const {
    stores,
    loading: storesLoading,
    error: storesError,
  } = useAppSelector((state: any) => state.store);
  const { token } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    // Get token from localStorage since Redux doesn't persist auth state
    const jwtToken = localStorage.getItem("jwt") || token;

    console.log("Token from Redux:", token);
    console.log("Token from localStorage:", jwtToken);

    // Fetch stores and users on mount
    if (jwtToken) {
      console.log("Dispatching getStores and getAllUsers...");
      dispatch(getStores());
      dispatch(getAllUsers(jwtToken));
    } else {
      console.warn("No token available, skipping data fetch");
    }
  }, [dispatch, token]);

  // Log stores data when it changes
  useEffect(() => {
    console.log(stores, "stores data");
    console.log(users, "users data");
    console.log("storesLoading:", storesLoading);
    console.log("usersLoading:", usersLoading);
    console.log("storesError:", storesError);
  }, [stores, users, storesLoading, usersLoading, storesError]);

  // Calculate totals from real data
  const totalStores = stores?.length || 0;
  const totalUsers = users?.length || 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Super Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Welcome back, {userProfile?.fullName || "Admin"}! Here's your system
            overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Total Stores */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">+8%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Total Stores
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {totalStores}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Across all locations
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">+5%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">
                  {totalUsers}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  System-wide employees
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Stores & Top Branches */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Recent Stores */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  All Stores
                </h3>
                <Link href="/super-admin/stores">
                  <Button variant="outline" size="sm">
                    Manage Stores
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {storesLoading || usersLoading ? (
                <div className="text-center py-8 text-slate-500">
                  Loading stores...
                </div>
              ) : storesError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading stores: {JSON.stringify(storesError)}
                </div>
              ) : stores && stores.length > 0 ? (
                <div className="space-y-4">
                  {stores.slice(0, 5).map((store: any) => (
                    <div
                      key={store.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                          <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {store.name || "Unnamed Store"}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {store.branches?.length || 0} branches •{" "}
                            {store.status || "Active"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">
                          {store.location || "Location N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No stores found
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/super-admin/stores/new">
                <Button className="w-full h-24 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                  <Store className="h-6 w-6" />
                  <span>Add New Store</span>
                </Button>
              </Link>
              <Link href="/super-admin/users">
                <Button className="w-full h-24 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                  <Users className="h-6 w-6" />
                  <span>Manage Users</span>
                </Button>
              </Link>
              <Link href="/super-admin/reports">
                <Button className="w-full h-24 flex flex-col gap-2 bg-orange-600 hover:bg-orange-700">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Reports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
