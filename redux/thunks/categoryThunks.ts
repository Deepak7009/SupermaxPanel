import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Category } from "../slices/categorySlice";

// ============================
// Fetch All Categories
// ============================
export const fetchCategories = createAsyncThunk<Category[]>(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Category[]>("/admin/api/categories");
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Failed to fetch categories");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);

// ============================
// Create New Category
// ============================
export const createCategory = createAsyncThunk<
  Category,
  Omit<Category, "_id" | "ancestors" | "level">
>(
  "category/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<Category>("/admin/api/categories", categoryData);
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Failed to create category");
      }
      return rejectWithValue(err instanceof Error ? err.message : "Unknown error");
    }
  }
);
