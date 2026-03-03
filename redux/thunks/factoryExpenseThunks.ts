import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  FactoryExpense,
  FetchFactoryExpensesParams,
  CreateFactoryExpensePayload,
} from "../types/factoryExpense";

/* ================= FETCH ALL EXPENSES ================= */
export const fetchFactoryExpenses = createAsyncThunk<
  {
    success: boolean;
    expenses: FactoryExpense[];
    total: number;
    page: number;
    limit: number;
  },
  FetchFactoryExpensesParams | undefined,
  { rejectValue: string }
>(
  "factoryExpense/fetchFactoryExpenses",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      if (params?.search) query.append("search", params.search);
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.status) query.append("status", params.status);
      if (params?.month) query.append("month", params.month.toString());
      if (params?.year) query.append("year", params.year.toString());

      const { data } = await axios.get(
        `/admin/api/factoryExpense?${query.toString()}`,
      );
      return {
        success: data.success,
        expenses: data.expenses ?? [],
        total: data.total ?? 0,
        page: data.page ?? 1,
        limit: data.limit ?? 10,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch factory expenses",
        );
      }
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error",
      );
    }
  },
);

/* ================= CREATE EXPENSE ================= */
export const createFactoryExpense = createAsyncThunk<
  { success: boolean; expense: FactoryExpense },
  CreateFactoryExpensePayload,
  { rejectValue: string }
>(
  "factoryExpense/createFactoryExpense",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/admin/api/factoryExpense`, payload);
      return { success: true, expense: data.expense };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to create factory expense",
        );
      }
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error",
      );
    }
  },
);
