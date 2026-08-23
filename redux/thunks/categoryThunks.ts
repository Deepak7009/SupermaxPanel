import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Category, FetchCategoriesResponse } from "../types/category";

// ============================
// Fetch Categories
// ============================
const fetchCategories = createAsyncThunk<
  FetchCategoriesResponse,
  | {
      search?: string;
      page?: number;
      limit?: number;
      parent?: string;
    }
  | undefined
>("category/fetchCategories", async (params, { rejectWithValue }) => {
  const { search = "", page = 1, limit = 10, parent = "" } = params ?? {};

  try {
    const { data } = await axios.get("/api/categories", {
      params: {
        search,
        page,
        limit,
        ...(parent ? { parent } : {}),
      },
    });

    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch categories",
      );
    }

    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error",
    );
  }
});

// ============================
// Create Category
// ============================
const createCategory = createAsyncThunk<
  Category,
  Omit<Category, "_id" | "ancestors" | "level">
>("category/createCategory", async (categoryData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<Category>(
      "/api/categories",
      categoryData,
    );

    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create category",
      );
    }

    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error",
    );
  }
});

// ============================
// Update Category
// ============================
const updateCategory = createAsyncThunk<
  Category,
  {
    id: string;
    data: Partial<Category>;
  }
>("category/updateCategory", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put<Category>(`/api/categories/${id}`, data);

    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update category",
      );
    }

    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error",
    );
  }
});

export { fetchCategories, createCategory, updateCategory };
