import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { DashboardResponse } from "../types/dashboard";

export const fetchDashboard = createAsyncThunk<
  DashboardResponse,
  void,
  { rejectValue: string }
>(
  "dashboard/fetchDashboard",

  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<DashboardResponse>("/api/dashboard");

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to fetch dashboard",
        );
      }

      return rejectWithValue("Failed to fetch dashboard");
    }
  },
);
