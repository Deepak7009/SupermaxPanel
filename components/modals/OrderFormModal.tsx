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
  // advance payment (optional)
  advanceAmount: string;
  setAdvanceAmount: (v: string) => void;
  advanceMethod: "cash" | "upi" | "bank" | "other";
  setAdvanceMethod: (v: OrderFormModalProps["advanceMethod"]) => void;
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
  advanceAmount,
  setAdvanceAmount,
  advanceMethod,
  setAdvanceMethod,
}) => {
  if (!isOpen) return null;

  const orderTotal = Number(amount) || totalAmount;
  const advance    = Number(advanceAmount) || 0;
  const due        = Math.max(0, orderTotal - advance);

  const paymentMethodOptions = [
    { label: "Cash", value: "cash" },
    { label: "UPI",  value: "upi"  },
    { label: "Bank", value: "bank" },
    { label: "Other",value: "other"},
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

        <div className="flex gap-3">
          <FloatingInput
            label="Amount (Override)"
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
              setStatus(value as OrderFormModalProps["status"])
            }
            options={[
              { label: "Pending",    value: "pending"    },
              { label: "Processing", value: "processing" },
              { label: "Shipped",    value: "shipped"    },
              { label: "Delivered",  value: "delivered"  },
              { label: "Cancelled",  value: "cancelled"  },
            ]}
          />
        </div>

        {/* ---- Advance Payment (optional) ---- */}
        <div className="mt-4 p-4 rounded-xl border border-dashed border-border bg-muted/30">
          <p className="text-sm font-semibold mb-2 text-muted-foreground">
            Advance Payment <span className="font-normal">(optional)</span>
          </p>
          <div className="flex gap-3">
            <FloatingInput
              label="Advance Amount"
              value={advanceAmount}
              type="number"
              onChange={(e) => setAdvanceAmount(e.target.value)}
            />
            <div className="flex-1">
              <Select
                value={advanceMethod}
                onChange={(v) => setAdvanceMethod(v as OrderFormModalProps["advanceMethod"])}
                options={paymentMethodOptions}
                placeholder="Method"
              />
            </div>
          </div>
        </div>

        {/* ---- Order Summary ---- */}
        <div className="mt-6 border-t pt-4 space-y-2">
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          {cart.map((item) => (
            <div key={item.product} className="flex justify-between py-1 text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-base pt-3 mt-2 border-t">
            <span>Total</span>
            <span>₹{orderTotal}</span>
          </div>
          {advance > 0 && (
            <>
              <div className="flex justify-between text-sm text-[var(--amount-paid)]">
                <span>Advance Paid</span>
                <span>− ₹{advance}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm text-[var(--amount-due)]">
                <span>Amount Due</span>
                <span>₹{due}</span>
              </div>
            </>
          )}
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
