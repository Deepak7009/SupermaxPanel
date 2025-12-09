"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/thunks/productThunks";
import { createOrder } from "@/redux/thunks/orderThunks";
import { RootState, AppDispatch } from "@/redux/store";

import FloatingInput from "@/components/common/FloatingInput";
import Select from "@/components/common/Select";
import { CreateOrderPayload } from "@/redux/types/order";
import { Product } from "@/redux/slices/productSlice";
import Button from "@/components/common/Button";

/* -------------------- TYPES -------------------- */
type CartItem = {
  product: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  setStatus: (status: OrderFormModalProps["status"]) => void;
  orderLoading: boolean;
  cart: CartItem[];
  totalAmount: number;
};

/* -------------------- MODAL COMPONENT -------------------- */
const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

        <div className="flex">
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

/* -------------------- MAIN PAGE -------------------- */
const CreateOrderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading: productLoading } = useSelector(
    (s: RootState) => s.product
  );
  const { loading: orderLoading } = useSelector((s: RootState) => s.orders);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<
    "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  >("pending");

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 100 }));
  }, [dispatch]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product === product._id);
      if (exists) {
        return prev.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          price: product.finalPrice,
          quantity: 1,
        },
      ];
    });
  };

  const incrementQuantity = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const submitHandler = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    const payload: CreateOrderPayload = {
      customerName,
      customerEmail,
      totalAmount: Number(amount) || totalAmount,
      items: cart.map((c) => ({
        productId: c.product,
        name: c.name,
        quantity: c.quantity,
        price: c.price,
      })),
      status,
    };

    const result = await dispatch(createOrder(payload));
    if (createOrder.fulfilled.match(result)) {
      alert("Order Created Successfully!");
      window.location.href = "/admin/orders";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Order</h1>

      {/* PRODUCTS LIST */}
      <h2 className="text-lg font-semibold mb-3">Select Products</h2>
      {productLoading && <p>Loading products...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const cartItem = cart.find((c) => c.product === p._id);
          return (
            <div
              key={p._id}
              className="bg-card rounded-2xl shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Stock: {p.stock}
                </p>
                <p className="text-base font-medium mt-2">₹{p.finalPrice}</p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {cartItem ? (
                  <div className="flex items-center gap-2">
                    <Button onClick={() => decrementQuantity(p._id)}>-</Button>
                    <span>{cartItem.quantity}</span>
                    <Button onClick={() => incrementQuantity(p._id)}>+</Button>
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => addToCart(p)}>
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CART SUMMARY */}
      {cart.length > 0 && (
        <div className="mt-8 p-4 rounded-2xl bg-card shadow space-y-3">
          <h3 className="text-lg font-semibold">Cart Summary</h3>
          {cart.map((item) => (
            <div
              key={item.product}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <span>{item.name}</span>
                <div className="flex items-center gap-1 ml-4">
                  <Button onClick={() => decrementQuantity(item.product)}>
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button onClick={() => incrementQuantity(item.product)}>
                    +
                  </Button>
                </div>
              </div>
              <span className="font-semibold">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>₹{Number(amount) || totalAmount}</span>
          </div>

          <Button className="w-full mt-4" onClick={() => setShowModal(true)}>
            Checkout
          </Button>
        </div>
      )}

      {/* ORDER FORM MODAL */}
      <OrderFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={submitHandler}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerEmail={customerEmail}
        setCustomerEmail={setCustomerEmail}
        amount={amount}
        setAmount={setAmount}
        status={status}
        setStatus={setStatus}
        orderLoading={orderLoading}
        cart={cart}
        totalAmount={totalAmount}
      />
    </div>
  );
};

export default CreateOrderPage;
