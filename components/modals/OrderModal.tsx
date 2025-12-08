"use client";

import { FormEvent, useState } from "react";
import DialogModal from "@/components/common/DialogModal";
import FloatingInput from "@/components/common/FloatingInput";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createOrder } from "@/redux/thunks/orderThunks";

interface OrderModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const OrderModal = ({ isOpen, setIsOpen }: OrderModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.orders);

  // strict typed status
  const [status, setStatus] = useState<
    "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  >("pending");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      customerName,
      customerEmail,
      totalAmount: Number(amount),
      items: [],
      status,
    };

    const result = await dispatch(createOrder(payload));

    if (createOrder.fulfilled.match(result)) {
      setIsOpen(false);

      setCustomerName("");
      setCustomerEmail("");
      setAmount("");
      setStatus("pending");
    }
  };

  return (
    <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="Create Order" className="max-w-xl">
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <FloatingInput
          label="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <FloatingInput
          label="Customer Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />

        <FloatingInput
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* FIX: ensure status union type */}
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

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Order"}
          </Button>
        </div>
      </form>
    </DialogModal>
  );
};

export default OrderModal;
