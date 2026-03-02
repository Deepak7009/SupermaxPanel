import { createSlice } from "@reduxjs/toolkit";
import { fetchCustomersThunk, fetchCustomerDetailThunk } from "../thunks/customerThunks";
import { CustomerDetail, CustomerList } from "../types/customer";

interface CustomerState {
  customers: CustomerList[];
  customer: CustomerDetail | null; // <-- make nullable
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: CustomerState = {
  customers: [],
  customer: null, // initially no customer detail
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
      // Fetch customers list
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
      })

      // Fetch single customer detail
      .addCase(fetchCustomerDetailThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchCustomerDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { setPage } = customerSlice.actions;
export default customerSlice.reducer;
