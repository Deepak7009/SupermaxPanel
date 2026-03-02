"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/thunks/productThunks";
import { createOrder } from "@/redux/thunks/orderThunks";
import { RootState, AppDispatch } from "@/redux/store";
import { CreateOrderPayload } from "@/redux/types/order";
import { Product } from "@/redux/slices/productSlice";
import Button from "@/components/common/Button";
import OrderFormModal from "@/components/modals/OrderFormModal";

/* -------------------- TYPES -------------------- */
type CartItem = {
  product: string;
  name: string;
  price: number;
  quantity: number;
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
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [note, setNote] = useState("");

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
        if (exists.quantity + 1 > product.stock) {
          alert(`Only ${product.stock} left in stock`);
          return prev;
        }

        return prev.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      if (product.stock <= 0) {
        alert("Out of stock");
        return prev;
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
      prev.map((item) => {
        if (item.product === productId) {
          const product = products.find((p) => p._id === productId);
          if (!product) return item;

          if (item.quantity + 1 > product.stock) {
            alert(`Only ${product.stock} left in stock`);
            return item; // ❌ stop increment
          }

          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
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
      customerMobile,
      customerAddress,
      note,
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

      {/* ORDER FORM MODAL (moved to separate component) */}
      <OrderFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={submitHandler}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerEmail={customerEmail}
        setCustomerEmail={setCustomerEmail}
        customerMobile={customerMobile}
        setCustomerMobile={setCustomerMobile}
        customerAddress={customerAddress}
        setCustomerAddress={setCustomerAddress}
        note={note}
        setNote={setNote}
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
