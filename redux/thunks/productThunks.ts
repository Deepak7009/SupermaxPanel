import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../slices/productSlice";

interface FetchProductsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

// Fetch all products with backend pagination & filters
export const fetchProducts = createAsyncThunk<
  { products: Product[]; total: number; page: number; limit: number },
  FetchProductsParams | undefined
>(
  "product/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      if (params?.search) query.append("search", params.search);
      if (params?.category) query.append("category", params.category);
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());

      const { data } = await axios.get(`/admin/api/products?${query.toString()}`);
      return data; // data = { products, total, page, limit }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Failed to fetch products");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

// Create new product
export const createProduct = createAsyncThunk<Product, Omit<Product, "_id" | "finalPrice">>(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<Product>("/admin/api/products", productData);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Failed to create product");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk<Product, { id: string; updatedData: Partial<Product> }>(
  "product/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put<Product>(`/admin/api/products/${id}`, updatedData);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Failed to update product");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);
