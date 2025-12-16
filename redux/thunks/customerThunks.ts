import { createAsyncThunk } from "@reduxjs/toolkit";
import { CustomerDetail, CustomerList, FetchCustomersParams } from "../types/customer";

interface RawCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  orders: Array<{ _id: string } | string>;
  createdAt: string;
  updatedAt: string;
}

interface FetchCustomersResponse {
  customers: CustomerList[];
  total: number;
}


interface FetchCustomerResponse {
  success: boolean;
  customer: CustomerDetail;
}

export const fetchCustomersThunk = createAsyncThunk<
  FetchCustomersResponse,
  FetchCustomersParams
>(
  "customers/fetchCustomers",
  async ({ search, page, limit, sortKey, sortDirection }) => {
    const params = new URLSearchParams({
      search: search || "",
      page: String(page || 1),
      limit: String(limit || 10),
      ...(sortKey ? { sortKey } : {}),
      ...(sortDirection ? { sortDirection } : {}),
    });

    const res = await fetch(`/admin/api/customers?${params.toString()}`, {
      cache: "no-store",
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch customers");
    }

    const customers: CustomerList[] = (data.customers as RawCustomer[]).map(
      (c) => ({
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        orders: c.orders.map((o) =>
          typeof o === "string" ? o : o._id
        ),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })
    );

    return { customers, total: data.total };
  }
);

export const fetchCustomerDetailThunk = createAsyncThunk<CustomerDetail, string>(
  "customerDetail/fetchCustomerDetail",
  async (id) => {
    const res = await fetch(`/admin/api/customers?id=${id}`, { cache: "no-store" });
    const data: FetchCustomerResponse = await res.json();

    if (!data.success) throw new Error("Failed to fetch customer");

    return data.customer;
  }
);

