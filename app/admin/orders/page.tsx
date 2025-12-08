"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchOrders } from "@/redux/thunks/orderThunks";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Order } from "@/redux/types/order";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Table, { Column } from "@/components/common/Table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// Extend Order for table UI-only columns
type OrderTableRow = Order & { email: string; actions: string };

const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, total, limit, loading } = useSelector(
    (s: RootState) => s.orders
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof OrderTableRow;
    direction: "asc" | "desc";
  } | null>(null);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  // Fetch orders
  useEffect(() => {
    dispatch(
      fetchOrders({
        search,
        status: status === "all" ? "" : status,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, search, status, currentPage, limit]);

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const handleSort = (key: keyof OrderTableRow) => {
    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const columns: Column<OrderTableRow>[] = [
    { key: "_id", label: "#" },
    { key: "user", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "totalAmount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const displayedOrders: OrderTableRow[] = orders.map((o) => ({
    ...o,
    email: o.user, // adjust if API returns actual email
    actions: "view",
  }));

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Orders</h1>
        <Link href="/admin/orders/create">
          <Button>Create Order</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={status}
          onChange={setStatus}
          options={statusOptions}
          placeholder="Select status"
        />
      </div>

      {/* Table */}
      <Table<OrderTableRow>
        columns={columns}
        data={displayedOrders}
        onSort={handleSort}
        sortConfig={sortConfig}
        renderCell={(order, key, index) => {
          switch (key) {
            case "_id":
              return <span>{index + 1 + (currentPage - 1) * limit}</span>;
            case "totalAmount":
              return `$${order.totalAmount.toFixed(2)}`;
            case "status":
              return <span className="capitalize">{order.status}</span>;
            case "actions":
              return (
                <Link href={`/admin/orders/${order._id}`}>
                  <Eye className="w-5 h-5 cursor-pointer" />
                </Link>
              );
            default:
              const value = order[key as keyof OrderTableRow];
              return typeof value === "string" || typeof value === "number"
                ? value
                : "";
          }
        }}
      />

      {/* Pagination */}
      <div className="flex flex-col items-center mt-4 gap-2">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} | Total Orders: {total}
        </span>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setCurrentPage(Math.max(currentPage - 1, 1))
                }
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  className={
                    currentPage === i + 1
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                  }
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default OrdersPage;
