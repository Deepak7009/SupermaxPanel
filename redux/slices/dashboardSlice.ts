import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboard } from "../thunks/dashboardThunks";
import {
  DashboardStats,
  LatestCategory,
  LowStockProduct,
  RecentOrder,
} from "../types/dashboard";

interface DashboardState {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  latestCategories: LatestCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  },
  recentOrders: [],
  lowStockProducts: [],
  latestCategories: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboard.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchDashboard.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload.stats;
      state.recentOrders = action.payload.recentOrders;
      state.lowStockProducts = action.payload.lowStockProducts;
      state.latestCategories = action.payload.latestCategories;
    });

    builder.addCase(fetchDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch dashboard";
    });
  },
});

export default dashboardSlice.reducer;
