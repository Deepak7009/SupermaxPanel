"use client";

import DialogModal from "@/components/common/DialogModal";
import { Order } from "@/redux/types/order";
import Button from "@/components/common/Button";

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
  if (!order) return null;

  return (
    <DialogModal isOpen={isOpen} setIsOpen={setIsOpen} title="Order Details">
      <div className="flex flex-col gap-2">

        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Email:</strong> {order.customerEmail}</p>
        <p><strong>Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
        <p><strong>Status:</strong> {order.status}</p>

        <p><strong>Items:</strong></p>
        <ul className="ml-4 list-disc">
          {order.items?.map((item) => (
            <li key={item._id}>
              {item.productName} — Qty: {item.quantity} — ${item.price}
            </li>
          ))}
        </ul>

        <p><strong>Address:</strong> {order.shippingAddress}</p>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </div>
    </DialogModal>
  );
}
