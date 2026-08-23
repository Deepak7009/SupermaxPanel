import { Order } from "./order";

export interface CustomerState {
  customers: CustomerList[];
  customer: CustomerDetail | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

/** Customer used in LIST page */
export interface CustomerList {
  _id: string;
  name: string;
  email: string;
  phone: string;
  orders: string[]; // ✅ only IDs
  createdAt: string;
  updatedAt: string;
  actions?:string;
}

/** Customer used in DETAIL page */
// export interface CustomerDetail {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   orders: Order[]; // ✅ populated
//   createdAt: string;
//   updatedAt: string;
//   actions?:string;
// }
/** Customer used in DETAIL page */
export interface OrdersPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
export interface CustomerDetail {
  _id: string;
  name: string;
  email: string;
  phone: string;

  orders: Order[]; // paginated orders
  ordersPagination: OrdersPagination; // ✅ ADD THIS

  createdAt: string;
  updatedAt: string;
}

export interface FetchCustomersParams {
  search?: string;
  page?: number;
  limit?: number;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
}
