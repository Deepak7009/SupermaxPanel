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
  FetchOrdersParams | undefined,
  { rejectValue: string }
>("orders/fetchOrders", async (params = {}, { rejectWithValue }) => {
  try {
    const { search = "", status = "", page = 1, limit = 10 } = params;

    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    query.set("page", String(page));
    query.set("limit", String(limit));

    const { data } = await axios.get<FetchOrdersResponse>(
      `/api/order?${query.toString()}`
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error"
    );
  }
});

/* -------- FETCH ORDER BY ID -------- */
export const fetchOrderById = createAsyncThunk<
  FetchOrderByIdResponse,
  string,
  { rejectValue: string }
>("orders/fetchOrderById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get<FetchOrderByIdResponse>(
      `/api/order?id=${id}`
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch order"
      );
    }
    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error"
    );
  }
});

/* -------- CREATE ORDER -------- */
export const createOrder = createAsyncThunk<
  CreateOrderResponse,
  CreateOrderPayload,
  { rejectValue: string }
>("orders/createOrder", async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<CreateOrderResponse>(
      "/api/order",
      orderData
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create order"
      );
    }
    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error"
    );
  }
});

/* -------- UPDATE ORDER -------- */
export const updateOrder = createAsyncThunk<
  UpdateOrderResponse,
  UpdateOrderPayload,
  { rejectValue: string }
>("orders/updateOrder", async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put<UpdateOrderResponse>(
      `/api/order/${id}`,
      updatedData
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update order"
      );
    }
    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error"
    );
  }
});
