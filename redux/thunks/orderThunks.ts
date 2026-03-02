import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  FetchOrdersResponse,
  FetchOrderByIdResponse,
  CreateOrderResponse,
  UpdateOrderResponse,
  FetchOrdersParams,
  CreateOrderPayload,
  UpdateOrderPayload,
} from "../types/order";

/* -------- FETCH ALL ORDERS -------- */
export const fetchOrders = createAsyncThunk<
  FetchOrdersResponse,
  FetchOrdersParams | undefined
>(
  "orders/fetchOrders",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append("search", params.search);
      if (params?.status) query.append("status", params.status);
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());

      const { data } = await axios.get<FetchOrdersResponse>(`/admin/api/order?${query.toString()}`);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

/* -------- FETCH ORDER BY ID -------- */
export const fetchOrderById = createAsyncThunk<
  FetchOrderByIdResponse,
  string
>(
  "orders/fetchOrderById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<FetchOrderByIdResponse>(`/admin/api/order?id=${id}`);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch order");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

/* -------- CREATE ORDER -------- */
export const createOrder = createAsyncThunk<
  CreateOrderResponse,
  CreateOrderPayload
>(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<CreateOrderResponse>("/admin/api/order", orderData);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Failed to create order");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

/* -------- UPDATE ORDER -------- */
export const updateOrder = createAsyncThunk<
  UpdateOrderResponse,
  { id: string; updatedData: Partial<CreateOrderPayload> }
>(
  "orders/updateOrder",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put<UpdateOrderResponse>(`/admin/api/order/${id}`, updatedData);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Failed to update order");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);
