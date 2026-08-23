"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchCustomerDetailThunk } from "@/redux/thunks/customerThunks";
import { addPayment } from "@/redux/thunks/orderThunks";
import { Card } from "@/components/ui/card";
import Table, { Column } from "@/components/common/Table";
import { Mail, Phone, ShoppingBag, Eye, Loader2 } from "lucide-react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Select from "@/components/common/Select";
import Pagination from "@/components/common/Pagination";
import { Order, PaymentEntry } from "@/redux/types/order";

type PaymentType   = PaymentEntry["type"];
type PaymentMethod = PaymentEntry["method"];
type PaymentStatus = "unpaid" | "advance" | "partial" | "paid" | "overpaid";

const paymentStatusColors: Record<PaymentStatus, string> = {
  unpaid:   "bg-red-50 text-red-700 border-red-200",
  advance:  "bg-purple-50 text-purple-700 border-purple-200",
  partial:  "bg-orange-50 text-orange-700 border-orange-200",
  paid:     "bg-green-50 text-green-700 border-green-200",
  overpaid: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

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
  const dispatch = useDispatch<AppDispatch>();

  const [localOrder, setLocalOrder] = useState<Order | null>(null);
  const [showPayForm, setShowPayForm] = useState(false);
  const [payAmount, setPayAmount]     = useState("");
  const [payType, setPayType]         = useState<PaymentType>("partial");
  const [payMethod, setPayMethod]     = useState<PaymentMethod>("cash");
  const [payNote, setPayNote]         = useState("");
  const [payLoading, setPayLoading]   = useState(false);

  useEffect(() => {
    if (order) {
      setLocalOrder(order);
      setShowPayForm(false);
      setPayAmount("");
      setPayNote("");
    }
  }, [order]);

  if (!isOpen || !localOrder) return null;

  const paidAmount    = localOrder.paidAmount    ?? 0;
  const advanceAmount = localOrder.advanceAmount ?? 0;
  const dueAmount     = Math.max(0, localOrder.totalAmount - paidAmount);
  const paymentStatus = (localOrder.paymentStatus ?? "unpaid") as PaymentStatus;

  const handleAddPayment = async () => {
    const amt = Number(payAmount);
    if (!amt || amt <= 0) return alert("Enter a valid amount");
    setPayLoading(true);
    try {
      const result = await dispatch(
        addPayment({ orderId: localOrder._id, amount: amt, type: payType, method: payMethod, note: payNote })
      ).unwrap();
      setLocalOrder(result.order);
      setShowPayForm(false);
      setPayAmount("");
      setPayNote("");
    } catch (e) {
      console.error(e);
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>

        {/* Basic Info */}
        <div className="space-y-2 text-sm">
          <Row label="Order ID"     value={localOrder._id} />
          <Row label="Date"         value={new Date(localOrder.createdAt).toLocaleString()} />
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${statusColors[localOrder.status]}`}>
              {capitalizeFirstLetter(localOrder.status)}
            </span>
          </div>
        </div>

        <hr className="my-4" />

        {/* Customer Info */}
        <div className="space-y-2 text-sm mb-2">
          <h3 className="font-semibold mb-1">Customer Info</h3>
          <Row label="Name"    value={localOrder.customerName} />
          <Row label="Email"   value={localOrder.customerEmail} />
          <Row label="Mobile"  value={localOrder.customerMobile || "—"} />
          <Row label="Address" value={localOrder.customerAddress || "—"} />
          {localOrder.note && <Row label="Note" value={localOrder.note} />}
        </div>

        <hr className="my-4" />

        {/* Payment Summary */}
        <div className="rounded-xl border p-3 bg-muted/30 space-y-2 text-sm mb-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Payment Status</span>
            {localOrder.status === "cancelled" ? (
              <span className="text-muted-foreground text-xs">—</span>
            ) : (
              <span className={`px-2 py-0.5 rounded-md border text-xs font-semibold capitalize ${paymentStatusColors[paymentStatus]}`}>
                {paymentStatus}
              </span>
            )}
          </div>
          <Row label="Total Amount" value={`₹ ${localOrder.totalAmount.toFixed(2)}`} />
          {advanceAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Advance Paid</span>
              <span className="text-[var(--amount-advance)] font-medium">₹ {advanceAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Paid</span>
            <span className="text-[var(--amount-paid)] font-medium">₹ {paidAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold">Amount Due</span>
            <span className={`font-bold ${dueAmount > 0 ? "text-[var(--amount-due)]" : "text-[var(--amount-paid)]"}`}>
              ₹ {dueAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment History */}
        {localOrder.payments && localOrder.payments.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2">Payment History</h3>
            <div className="space-y-2">
              {localOrder.payments.map((p, i) => (
                <div key={p._id ?? i} className="flex justify-between items-center text-xs rounded-lg border px-3 py-2 bg-muted/20">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium capitalize">{p.type} — {p.method}</span>
                    {p.note && <span className="text-muted-foreground">{p.note}</span>}
                    <span className="text-muted-foreground">
                      {new Date(p.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <span className="font-bold text-[var(--amount-paid)]">₹ {p.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Payment */}
        {localOrder.status !== "cancelled" && paymentStatus !== "paid" && paymentStatus !== "overpaid" && (
          <div className="mb-4">
            {!showPayForm ? (
              <Button className="w-full" onClick={() => setShowPayForm(true)}>+ Add Payment</Button>
            ) : (
              <div className="border rounded-xl p-3 space-y-3 bg-muted/20">
                <p className="font-semibold text-sm">Record Payment</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm bg-background"
                  />
                  <div className="flex-1">
                    <Select
                      value={payType}
                      onChange={(v) => setPayType(v as PaymentType)}
                      options={[
                        { label: "Partial",     value: "partial"     },
                        { label: "Installment", value: "installment" },
                        { label: "Full",        value: "full"        },
                        { label: "Advance",     value: "advance"     },
                      ]}
                    />
                  </div>
                </div>
                <Select
                  value={payMethod}
                  onChange={(v) => setPayMethod(v as PaymentMethod)}
                  options={[
                    { label: "Cash",  value: "cash"  },
                    { label: "UPI",   value: "upi"   },
                    { label: "Bank",  value: "bank"  },
                    { label: "Other", value: "other" },
                  ]}
                />
                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
                />
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => setShowPayForm(false)}>Cancel</Button>
                  <Button onClick={handleAddPayment} disabled={payLoading}>
                    {payLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Payment"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div>
          <h3 className="font-semibold mb-2 text-sm">Items</h3>
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Qty</th>
                <th className="p-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {localOrder.items.map((item) => (
                <tr key={item.productId} className="border-t border-border">
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

// small helper
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right break-all max-w-[60%]">{value}</span>
    </div>
  );
}

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

  // All pagination and filtering is server-side; reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (!id) return;

    dispatch(
      fetchCustomerDetailThunk({
        id,
        orderPage: page,
        orderLimit: PAGE_SIZE,
        orderSearch: search,
        sortKey: "createdAt",
        sortDirection: "desc",
      })
    );
  }, [dispatch, id, page, search]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-[var(--text-error)]">{error}</div>;
  if (!customer) return <div className="p-6">Customer not found</div>;

  // Use server-provided pagination metadata
  const totalOrders = customer.ordersPagination?.totalItems ?? customer.orders.length;
  const totalPages = customer.ordersPagination?.totalPages ?? Math.ceil(totalOrders / PAGE_SIZE);

  const orderColumns: Column<Order>[] = [
    { key: "_id", label: "Order ID" },
    { key: "status", label: "Status" },
    { key: "totalAmount", label: "Amount" },
    { key: "createdAt", label: "Date" },
    { key: "actions" as keyof Order, label: "View" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
            <span className="font-semibold">{totalOrders}</span>
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
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs mb-4"
        />

        <Table
          columns={orderColumns}
          data={customer.orders}
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

        {customer.orders.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            No orders found
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalOrders}
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
