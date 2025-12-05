import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../slices/productSlice";

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[]>(
  "product/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Product[]>("/admin/api/products");
      return data;
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
      console.log("id",id)
      const { data } = await axios.put<Product>(`/admin/api/products/${id}`, updatedData);
      console.log("data ",data)
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Failed to update product");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);
