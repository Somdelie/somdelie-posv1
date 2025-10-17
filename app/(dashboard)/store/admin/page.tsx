import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Package,
  ShoppingBasket,
  Users,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth";
import { getStoreById } from "@/lib/actions/store";
import { redirect } from "next/navigation";

export default async function StoreAdminPage() {
  // Get current user to extract storeId
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  if (!user.storeId) {
    redirect("/create-store");
  }

  // Fetch store data from backend
  const store = await getStoreById(user.storeId);

  if (!store) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Failed to load store information. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sample metrics with color schemes
  const cards = [
    {
      title: "Total Sales",
      value: "R12,345",
      change: "50",
      changePercent: "+12.5%",
      icon: DollarSign,
      trend: "up",
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      ring: "ring-emerald-100 dark:ring-emerald-900/50",
    },
    {
      title: "Total Branches",
      value: "5",
      change: "-10",
      changePercent: "-10%",
      icon: Building2,
      trend: "down",
      gradient: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      ring: "ring-blue-100 dark:ring-blue-900/50",
    },
    {
      title: "Total Products",
      value: "150",
      change: "20",
      changePercent: "+20%",
      icon: Package,
      trend: "up",
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      iconColor: "text-purple-600 dark:text-purple-400",
      ring: "ring-purple-100 dark:ring-purple-900/50",
    },
    {
      title: "Total Employees",
      value: "50",
      change: "5",
      changePercent: "+5%",
      icon: Users,
      trend: "up",
      gradient: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      iconColor: "text-orange-600 dark:text-orange-400",
      ring: "ring-orange-100 dark:ring-orange-900/50",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-6">
      <div className="space-y-6">
        {/* Store Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {store.brandName}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
                {store.description}
              </p>
            </div>
            <Badge className={`${getStatusColor(store.status)} border w-fit`}>
              {store.status}
            </Badge>
          </div>

          {/* Store Details - Info Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <div className="bg-blue-50 dark:bg-blue-950/50 p-2 rounded-lg">
                    <Store className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="text-sm font-medium">{store.storeType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Store ID
                  </span>
                  <span className="text-sm font-mono">
                    {store.id.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Created</span>
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(store.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <div className="bg-purple-50 dark:bg-purple-950/50 p-2 rounded-lg">
                    <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{store.contact.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {store.contact.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {store.contact.email}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <div className="bg-orange-50 dark:bg-orange-950/50 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  Store Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold">
                    {store.storeAdmin.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {store.storeAdmin.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {store.storeAdmin.phone}
                  </p>
                </div>
                {store.storeAdmin.lastLogin && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Last login:{" "}
                      {new Date(store.storeAdmin.lastLogin).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card"
            >
              {/* Decorative gradient background */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 dark:opacity-20 rounded-full -mr-16 -mt-16`}
              ></div>

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div
                  className={`${card.bgColor} p-3 rounded-xl ring-4 ${card.ring} transition-colors`}
                >
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-3xl font-bold tracking-tight">
                  {card.value}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    {card.trend === "up" ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                          {card.changePercent}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-100 dark:bg-rose-950/50 rounded-full border border-rose-200 dark:border-rose-800">
                        <TrendingDown className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                        <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                          {card.changePercent}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    this month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Recent Sales */}
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBasket className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Recent Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBasket className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-muted-foreground mb-1">
                  No sales data available
                </p>
                <p className="text-sm text-muted-foreground/70">
                  Sales data will appear here once you start making transactions
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/store/branches"
                  className="group flex items-center justify-between p-4 rounded-xl border-2 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 dark:bg-blue-950/50 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                      <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Manage Branches</p>
                      <p className="text-xs text-muted-foreground">
                        Add and manage store branches
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="/store/products"
                  className="group flex items-center justify-between p-4 rounded-xl border-2 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 dark:bg-purple-950/50 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                      <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Manage Products</p>
                      <p className="text-xs text-muted-foreground">
                        Add and manage inventory
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="/store/employees"
                  className="group flex items-center justify-between p-4 rounded-xl border-2 hover:border-orange-200 dark:hover:border-orange-800 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 dark:bg-orange-950/50 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Manage Employees</p>
                      <p className="text-xs text-muted-foreground">
                        Add employees and manage permissions
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
