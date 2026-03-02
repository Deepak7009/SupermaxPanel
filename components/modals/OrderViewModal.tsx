"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateOrder } from "@/redux/thunks/orderThunks";

import DialogModal from "@/components/common/DialogModal";
import Button from "@/components/common/Button";

import Select from "@/components/common/Select";

import { Loader2 } from "lucide-react";
import { Order } from "@/redux/types/order";

// Define a literal type for status
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderViewModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  order: Order | null;
}

export default function OrderViewModal({
  isOpen,
  setIsOpen,
  order,
}: OrderViewModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  // Type-safe state
  const [status, setStatus] = useState<OrderStatus>("pending");

  useEffect(() => {
    if (order) {
      setStatus(order.status as OrderStatus || "pending");
    }
  }, [order]);

  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateOrder({
          id: order._id,
          updatedData: { status }, // ✅ Now type-safe
        })
      ).unwrap();
      setIsOpen(false);
    } catch (error) {
      console.error("update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Status colors from theme
  const statusColors: Record<OrderStatus, string> = {
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

  return (
    <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="Order Details">
      <div className="flex flex-col gap-4 p-2">
        {/* Order Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Order ID" value={order._id} />
          <Info label="Customer" value={order.customerName} />
          <Info label="Email" value={order.customerEmail} />
          <Info label="Mobile" value={order.customerMobile || "-"} />
          <Info label="Address" value={order.customerAddress || "-"} />
          <Info label="Note" value={order.note || "-"} />
          <Info label="Amount" value={`$${order.totalAmount.toFixed(2)}`} />
        </div>

        {/* Items */}
        <div>
          <h3 className="font-semibold mb-1 text-sm">Items</h3>
          <ul className="ml-4 space-y-1 text-sm list-disc">
            {order.items?.map((item) => (
              <li key={item.productId}>
                <span className="font-medium">{item.name}</span> — Qty: {item.quantity} — ${item.price}
              </li>
            ))}
          </ul>
        </div>

        {/* Status Dropdown */}
        <div className="border-t pt-4">
          <label className="font-semibold text-sm mb-1 block">Status</label>

          <Select
            value={status}
            onChange={(value) => setStatus(value as OrderStatus)}
            options={statusOptions}
            className={`w-full capitalize rounded-md py-2 ${statusColors[status]}`}
            placeholder="Select status"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={() => setIsOpen(false)}>Close</Button>

          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Status"}
          </Button>
        </div>
      </div>
    </DialogModal>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-sm text-muted-foreground">{label}</span>
      <span className="text-[15px]">{value}</span>
    </div>
  );
}
