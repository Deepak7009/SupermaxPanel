"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCustomerDetailThunk } from "@/redux/thunks/customerThunks";
import { Card } from "@/components/ui/card";
import Table, { Column } from "@/components/common/Table";
import { Mail, Phone, ShoppingBag, Eye } from "lucide-react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import { Order } from "@/redux/types/order";

// ---------------------- Helper ----------------------
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// ---------------------- Status Colors ----------------------
const statusColors: Record<Order["status"], string> = {
  pending:
    "bg-[color:var(--color-status-pending-bg)] text-[color:var(--color-status-pending-text)] border-[color:var(--color-status-pending-border)]",
  processing:
    "bg-[color:var(--color-status-processing-bg)] text-[color:var(--color-status-processing-text)] border-[color:var(--color-status-processing-border)]",
  shipped:
    "bg-[color:var(--color-status-shipped-bg)] text-[color:var(--color-status-shipped-text)] border-[color:var(--color-status-shipped-border)]",
  delivered:
    "bg-[color:var(--color-status-delivered-bg)] text-[color:var(--color-status-delivered-text)] border-[color:var(--color-status-delivered-border)]",
  cancelled:
    "bg-[color:var(--color-status-cancelled-bg)] text-[color:var(--color-status-cancelled-text)] border-[color:var(--color-status-cancelled-border)]",
};

// ---------------------- Order Modal ----------------------
const OrderModal = ({
  order,
  isOpen,
  onClose,
}: {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>

        {/* Basic Info */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-medium">{order._id}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span
              className={`px-3 py-1 rounded-md text-sm font-medium border ${
                statusColors[order.status]
              }`}
            >
              {capitalizeFirstLetter(order.status)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-semibold">₹{order.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <hr className="my-4" />

        {/* Customer Info */}
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold">Customer Info</h3>
          <div className="flex justify-between">
            <span>Name:</span>
            <span>{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span>{order.customerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span>Mobile:</span>
            <span>{order.customerMobile}</span>
          </div>
          <div className="flex justify-between">
            <span>Address:</span>
            <span>{order.customerAddress}</span>
          </div>
          {order.note && (
            <div className="flex justify-between">
              <span>Note:</span>
              <span>{order.note}</span>
            </div>
          )}
        </div>

        <hr className="my-4" />

        {/* Items */}
        <div>
          <h3 className="font-semibold mb-2">Items</h3>
          <table className="w-full text-sm border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-2 text-left">Product Name</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr
                  key={item.productId}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

// ---------------------- Customer Detail Page ----------------------
const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { customer, loading, error } = useSelector(
    (state: RootState) => state.customers
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const PAGE_SIZE = 5;

  useEffect(() => {
    if (id) dispatch(fetchCustomerDetailThunk(id));
  }, [dispatch, id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!customer) return <div className="p-6">Customer not found</div>;

  const filteredOrders = customer.orders.filter(
    (o) =>
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const orderColumns: Column<Order>[] = [
    { key: "_id", label: "Order ID" },
    { key: "status", label: "Status" },
    { key: "totalAmount", label: "Amount" },
    { key: "createdAt", label: "Date" },
    { key: "actions" as keyof Order, label: "View" },
  ];

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* LEFT PROFILE */}
      <Card className="p-5 rounded-xl">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold">
            {customer.name[0]}
          </div>
          <h2 className="text-lg font-semibold">{customer.name}</h2>
          <div className="text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" /> {customer.email}
          </div>
          <div className="text-sm flex items-center gap-2">
            <Phone className="w-4 h-4" /> {customer.phone}
          </div>
          <div className="w-full mt-4 flex justify-between text-sm">
            <span>Total Orders</span>
            <span className="font-semibold">{customer.orders.length}</span>
          </div>
          <div className="w-full flex justify-between text-sm">
            <span>Joined</span>
            <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>

      {/* RIGHT ORDERS */}
      <Card className="lg:col-span-3 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Orders</h3>
        </div>

        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs mb-4"
        />

        <Table
          columns={orderColumns}
          data={paginatedOrders}
          renderCell={(order, key) => {
            switch (key) {
              case "createdAt":
                return new Date(order.createdAt).toLocaleDateString();
              case "totalAmount":
                return `₹${order.totalAmount}`;
              case "status":
                return (
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-medium border ${
                      statusColors[order.status]
                    }`}
                  >
                    {capitalizeFirstLetter(order.status)}
                  </span>
                );
              case "actions":
                return (
                  <Button
                    className="p-2 rounded-md hover:bg-muted"
                    onClick={() => {
                      setSelectedOrder(order);
                      setModalOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                );
              default:
                return String(order[key] ?? "");
            }
          }}
        />

        {filteredOrders.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No orders found
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          onPageChange={setPage}
        />
      </Card>

      {/* ORDER MODAL */}
      <OrderModal
        order={selectedOrder}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default CustomerDetailPage;
