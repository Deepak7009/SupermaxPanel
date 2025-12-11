// types/customer.ts
export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  orders: string[]; // just store order IDs as string for frontend
  createdAt: string;
  updatedAt: string;
  actions?:string;
}

export interface FetchCustomersParams {
  search?: string;
  page?: number;
  limit?: number;
  sortKey?: keyof Customer;         // <-- add this
  sortDirection?: "asc" | "desc";   // <-- add this
}
