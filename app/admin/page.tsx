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

import { RootState, AppDispatch } from "@/redux/store";
import { fetchDashboard } from "@/redux/thunks/dashboardThunks";

import Table, { Column } from "@/components/common/Table";
import { Card } from "@/components/ui/card";
import { LowStockProduct, RecentOrder } from "@/redux/types/dashboard";



const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

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
      value: `₹${stats.totalRevenue.toLocaleString()}`,
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
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground mt-1">
          Welcome back Admin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent Orders */}
        <Card className="p-4 xl:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">
            Recent Orders
          </h2>

          <Table
            columns={orderColumns}
            data={recentOrders}
            loading={loading}
            renderCell={(order, key) => {
              switch (key) {
                case "totalAmount":
                  return (
                    <span className="font-semibold">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  );

                default:
                  const value = order[key];

                  return typeof value === "string" ||
                    typeof value === "number"
                    ? value
                    : "";
              }
            }}
          />
        </Card>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Low Stock Products */}
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">
              Low Stock Products
            </h2>

            <Table
              columns={lowStockColumns}
              data={lowStockProducts}
              loading={loading}
              renderCell={(product, key) => {
                switch (key) {
                  case "stock":
                    return (
                      <span className="bg-error text-error-foreground rounded-md px-2 py-1 text-xs font-medium">
                        {product.stock}
                      </span>
                    );

                  default:
                    const value = product[key];

                    return typeof value === "string" ||
                      typeof value === "number"
                      ? value
                      : "";
                }
              }}
            />
          </Card>

          {/* Latest Categories */}
          <Card className="p-4">
            <h2 className="mb-4 text-lg font-semibold">
              Latest Categories
            </h2>

            {latestCategories.length > 0 ? (
              <div className="space-y-2">
                {latestCategories.map((category) => (
                  <div
                    key={category._id}
                    className="bg-muted rounded-lg border px-3 py-2"
                  >
                    <span className="font-medium">
                      {category.name}
                    </span>
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