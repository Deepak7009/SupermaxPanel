"use client";

import { useEffect } from "react";
import {
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  IndianRupee,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";

import { RootState, AppDispatch } from "@/redux/store";
import { fetchDashboard } from "@/redux/thunks/dashboardThunks";

import Table, { Column } from "@/components/common/Table";
import { Card } from "@/components/ui/card";
import { LowStockProduct, RecentOrder } from "@/redux/types/dashboard";



const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const {
    stats,
    recentOrders,
    lowStockProducts,
    latestCategories,
    loading,
  } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const cards = [
    {
      title: "Products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: FolderTree,
    },
    {
      title: "Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
    },
    {
      title: "Revenue",
      value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: IndianRupee,
    },
  ];

  const orderColumns: Column<RecentOrder>[] = [
    {
      key: "_id",
      label: "Order ID",
    },
    {
      key: "customerName",
      label: "Customer",
    },
    {
      key: "totalAmount",
      label: "Amount",
    },
  ];

  const lowStockColumns: Column<LowStockProduct>[] = [
    {
      key: "name",
      label: "Product",
    },
    {
      key: "stock",
      label: "Stock",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Dashboard
        </h1>

        <p className="text-muted-foreground mt-1">
          Welcome back, {session?.user.name ?? "Admin"}
          {session?.user.role === "superadmin" && (
            <span className="ml-2 text-xs font-semibold text-[var(--badge-superadmin-text)] dark:text-[var(--badge-superadmin-text)]">
              (Super Admin)
            </span>
          )}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    {card.title}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold">
                    {card.value}
                  </h3>
                </div>

                <div className="bg-muted rounded-lg p-3">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Recent Orders — full width on mobile, 2/3 on lg */}
        <Card className="p-4 lg:col-span-2 min-w-0">
          <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>

          {/* Truncate Order ID to first 8 chars on mobile */}
          <Table
            columns={orderColumns}
            data={recentOrders}
            loading={loading}
            renderCell={(order, key) => {
              switch (key) {
                case "_id":
                  return (
                    <span className="font-mono text-xs">
                      <span className="hidden sm:inline">{order._id}</span>
                      <span className="sm:hidden">{order._id.slice(0, 8)}…</span>
                    </span>
                  );
                case "totalAmount":
                  return (
                    <span className="font-semibold whitespace-nowrap">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  );
                default:
                  const value = order[key];
                  return typeof value === "string" || typeof value === "number"
                    ? value
                    : "";
              }
            }}
          />
        </Card>

        {/* Right column — stacks below on mobile, sidebar on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">

          {/* Low Stock Products */}
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Low Stock Products</h2>

            <Table
              columns={lowStockColumns}
              data={lowStockProducts}
              loading={loading}
              renderCell={(product, key) => {
                switch (key) {
                  case "stock":
                    return (
                      <span className="bg-destructive/15 text-destructive rounded-md px-2 py-1 text-xs font-medium">
                        {product.stock}
                      </span>
                    );
                  default:
                    const value = product[key];
                    return typeof value === "string" || typeof value === "number"
                      ? value
                      : "";
                }
              }}
            />
          </Card>

          {/* Latest Categories */}
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">Latest Categories</h2>

            {latestCategories.length > 0 ? (
              <div className="space-y-2">
                {latestCategories.map((category) => (
                  <div
                    key={category._id}
                    className="bg-muted rounded-lg border px-3 py-2"
                  >
                    <span className="font-medium text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                No categories found
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;