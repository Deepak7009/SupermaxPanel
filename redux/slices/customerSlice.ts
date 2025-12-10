import { createSlice } from "@reduxjs/toolkit";
import { fetchCustomersThunk } from "../thunks/customerThunks";
import { Customer } from "../types/customer";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setPage: (state, action: { payload: number }) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.total = action.payload.total;
      })
      .addCase(fetchCustomersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setPage } = customerSlice.actions;
export default customerSlice.reducer;
