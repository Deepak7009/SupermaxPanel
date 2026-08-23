/* ---------------------- ORDER TYPES ---------------------- */

export interface OrderItem {
  _id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface PaymentEntry {
  _id?: string;
  amount: number;
  type: "advance" | "partial" | "installment" | "full";
  method: "cash" | "upi" | "bank" | "other";
  note?: string;
  date: string;
}

export interface Order {
  _id: string;
  user?: string | null;

  customerName: string;
  customerEmail: string;
  customerMobile: string;
  customerAddress: string;
  note: string;

  items: OrderItem[];
  totalAmount: number;

  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  // Payment tracking
  paidAmount: number;
  advanceAmount: number;
  paymentStatus: "unpaid" | "advance" | "partial" | "paid" | "overpaid";
  payments: PaymentEntry[];

  createdAt: string;
  updatedAt: string;
  actions?: string;
}

/* -------- RESPONSE TYPES -------- */

export interface FetchOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalOrderAmount: number;
  totalReceivedAmount: number;
  totalPendingAmount: number;
}

export interface FetchOrderByIdResponse {
  order: Order;
}

export interface CreateOrderResponse {
  order: Order;
}

export interface UpdateOrderResponse {
  order: Order;
}

export interface AddPaymentResponse {
  order: Order;
}

/* -------- THUNK PAYLOAD TYPES -------- */

export interface FetchOrdersParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrderPayload {
  user?: string | null;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  customerAddress: string;
  note: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status?: Order["status"];
  // optional advance payment at order creation
  advanceAmount?: number;
  advanceMethod?: "cash" | "upi" | "bank" | "other";
}

export interface UpdateOrderPayload {
  id: string;
  updatedData: Partial<Order>;
}

export interface AddPaymentPayload {
  orderId: string;
  amount: number;
  type: PaymentEntry["type"];
  method: PaymentEntry["method"];
  note?: string;
}

/* -------- SLICE STATE TYPE -------- */

export interface OrderState {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  currentOrder: Order | null;
  totalOrderAmount: number;
  totalReceivedAmount: number;
  totalPendingAmount: number;
}
