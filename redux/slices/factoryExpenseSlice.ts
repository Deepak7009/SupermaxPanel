import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FactoryExpense } from "../types/factoryExpense";
import {
  createFactoryExpense,
  fetchFactoryExpenses,
} from "../thunks/factoryExpenseThunks";

export interface FactoryExpenseState {
  expenses: FactoryExpense[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;

  // NEW FIELDS FOR TOTALS
  totalPendingAmount: number;
  totalPayedAmount: number;
  totalMonthAmount: number;
}

const initialState: FactoryExpenseState = {
  expenses: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,

  totalPendingAmount: 0,
  totalPayedAmount: 0,
  totalMonthAmount: 0,
};

const factoryExpenseSlice = createSlice({
  name: "factoryExpense",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    /* ================= FETCH EXPENSES ================= */
    builder.addCase(fetchFactoryExpenses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchFactoryExpenses.fulfilled,
      (
        state,
        action: PayloadAction<{
          success: boolean;
          expenses: FactoryExpense[];
          total: number;
          page: number;
          limit: number;
          totalPendingAmount?: number;
          totalPayedAmount?: number;
          totalMonthAmount?: number;
        }>,
      ) => {
        state.loading = false;
        state.expenses = action.payload.expenses ?? [];
        state.total = action.payload.total ?? 0;
        state.page = action.payload.page ?? 1;
        state.limit = action.payload.limit ?? 10;

        // update totals from backend
        state.totalPendingAmount = action.payload.totalPendingAmount ?? 0;
        state.totalPayedAmount = action.payload.totalPayedAmount ?? 0;
        state.totalMonthAmount = action.payload.totalMonthAmount ?? 0;
      },
    );

    builder.addCase(fetchFactoryExpenses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* ================= CREATE ================= */
    builder.addCase(createFactoryExpense.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      createFactoryExpense.fulfilled,
      (
        state,
        action: PayloadAction<{ success: boolean; expense: FactoryExpense }>,
      ) => {
        state.loading = false;
        state.expenses.unshift(action.payload.expense);
        state.total += 1;

        // Update totals locally for new expense
        if (action.payload.expense.status === "pending") {
          state.totalPendingAmount += action.payload.expense.amount;
        } else if (action.payload.expense.status === "approved") {
          state.totalPayedAmount += action.payload.expense.amount;
        }
        state.totalMonthAmount += action.payload.expense.amount;
      },
    );

    builder.addCase(createFactoryExpense.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setPage, setLimit } = factoryExpenseSlice.actions;

export default factoryExpenseSlice.reducer;
