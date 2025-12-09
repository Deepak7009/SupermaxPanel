"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchOrders } from "@/redux/thunks/orderThunks";
import { Eye } from "lucide-react";

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
} from "@/components/ui/pagination";

import OrderViewModal from "@/components/modals/OrderViewModal";
import { Order } from "@/redux/types/order";
import { useRouter } from "next/navigation";

type OrderTableRow = Order & {
  email: string;
  actions: string;
};

const OrdersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { orders, total, limit } = useSelector((s: RootState) => s.orders);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof OrderTableRow;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

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
    { key: "customerName", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "totalAmount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const displayedOrders: OrderTableRow[] = orders.map((o) => ({
    ...o,
    email: o.customerEmail,
    actions: "view",
  }));

  const handleView = (order: Order) => {
    setViewOrder(order);
    setIsViewOpen(true);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Orders</h1>

        {/* Navigate to create page */}
        <Button onClick={() => router.push("/admin/orders/create")}>
          Create Order
        </Button>
      </div>

      {/* View Order Modal */}
      <OrderViewModal
        isOpen={isViewOpen}
        setIsOpen={setIsViewOpen}
        order={viewOrder}
      />

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

            case "actions":
              return (
                <Button onClick={() => handleView(order)}>
                  <Eye className="w-5 h-5" />
                </Button>
              );

            default:
              return order[key] ? String(order[key]) : "";
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
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
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

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
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
