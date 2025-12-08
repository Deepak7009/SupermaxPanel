/* ---------------------- ORDER TYPES ---------------------- */

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

/* -------- RESPONSE TYPES -------- */

export interface FetchOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
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

/* -------- THUNK PAYLOAD TYPES -------- */

export interface FetchOrdersParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrderPayload {
  user: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status?: Order["status"];
}

export interface UpdateOrderPayload {
  id: string;
  updatedData: Partial<Order>;
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
}
