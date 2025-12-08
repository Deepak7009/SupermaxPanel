"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchOrderById, updateOrder } from "@/redux/thunks/orderThunks";
import { clearCurrentOrder } from "@/redux/slices/orderSlice";
import { Order, OrderItem } from "@/redux/types/order";
import Button from "@/components/common/Button";
import Select from "@/components/common/Select";

interface OrderDetailsProps {
  params: { id: string };
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ params }) => {
  const { id } = params;
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder, loading } = useSelector((s: RootState) => s.orders);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchOrderById(id));
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id]);

  if (loading || !currentOrder) return <div className="p-4">Loading...</div>;

  const onStatusChange = async (newStatus: Order["status"]) => {
    await dispatch(updateOrder({ id, updatedData: { status: newStatus } }));
    dispatch(fetchOrderById(id)); // refresh currentOrder
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Order {currentOrder._id}</h1>
        <Button onClick={() => router.push("/admin/orders")}>
          Back to list
        </Button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <p>
          <strong>Name:</strong> {currentOrder.user}
        </p>
        <p>
          <strong>Email:</strong> {currentOrder.user}
        </p>
        <p>
          <strong>Total:</strong> ${currentOrder.totalAmount.toFixed(2)}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(currentOrder.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-medium mb-2">Items</h2>
        <ul className="space-y-2">
          {currentOrder.items.map((item: OrderItem, i: number) => (
            <li key={i} className="flex justify-between border p-2 rounded">
              <div>
                <div className="font-medium">{item.product}</div>
                <div className="text-sm">Qty: {item.quantity}</div>
              </div>
              <div className="text-right">${item.price.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={currentOrder.status}
          onChange={(value: string) => onStatusChange(value as Order["status"])} // cast here
          options={statusOptions}
          placeholder="Select status"
        />

        <Button
          onClick={() =>
            dispatch(updateOrder({ id, updatedData: currentOrder }))
          }
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default OrderDetails;
