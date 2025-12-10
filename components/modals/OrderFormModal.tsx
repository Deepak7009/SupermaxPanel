"use client";

import React from "react";
import FloatingInput from "@/components/common/FloatingInput";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";

type CartItem = {
  product: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  customerMobile: string;
  setCustomerMobile: (mobile: string) => void;
  customerAddress: string;
  setCustomerAddress: (address: string) => void;
  note: string;
  setNote: (note: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  setStatus: (status: OrderFormModalProps["status"]) => void;
  orderLoading: boolean;
  cart: CartItem[];
  totalAmount: number;
};

const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerMobile,
  setCustomerMobile,
  customerAddress,
  setCustomerAddress,
  note,
  setNote,
  amount,
  setAmount,
  status,
  setStatus,
  orderLoading,
  cart,
  totalAmount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

        <div className="flex gap-3">
          <FloatingInput
            label="Amount (Manual)"
            value={amount}
            type="number"
            onChange={(e) => setAmount(e.target.value)}
          />
          <FloatingInput
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <FloatingInput
          label="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />

        <FloatingInput
          label="Mobile"
          value={customerMobile}
          onChange={(e) => setCustomerMobile(e.target.value)}
        />

        <FloatingInput
          label="Address"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
        />

        <FloatingInput
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="mt-3">
          <Select
            value={status}
            onChange={(value) =>
              setStatus(
                value as
                  | "pending"
                  | "processing"
                  | "shipped"
                  | "delivered"
                  | "cancelled"
              )
            }
            options={[
              { label: "Pending", value: "pending" },
              { label: "Processing", value: "processing" },
              { label: "Shipped", value: "shipped" },
              { label: "Delivered", value: "delivered" },
              { label: "Cancelled", value: "cancelled" },
            ]}
          />
        </div>

        <div className="mt-6 border-t pt-4 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          {cart.map((item) => (
            <div key={item.product} className="flex justify-between py-1">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg pt-3 mt-3 border-t">
            <span>Total</span>
            <span>₹{Number(amount) || totalAmount}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} disabled={orderLoading}>
            {orderLoading ? "Saving..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderFormModal;
