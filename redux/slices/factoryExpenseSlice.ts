import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FactoryExpense,
  FetchFactoryExpensesParams,
} from "../types/factoryExpense";
import {
  createFactoryExpense,
  fetchFactoryExpenseById,
  fetchFactoryExpenses,
} from "../thunks/factoryExpenseThunks";

export interface FactoryExpenseState {
  expenses: FactoryExpense[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  currentExpense: FactoryExpense | null;
}

const initialState: FactoryExpenseState = {
  expenses: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  currentExpense: null,
};

const factoryExpenseSlice = createSlice({
  name: "factoryExpense",
  initialState,
  reducers: {
    clearCurrentExpense(state) {
      state.currentExpense = null;
    },
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
        }>,
      ) => {
        state.loading = false;
        state.expenses = action.payload.expenses ?? [];
        state.total = action.payload.total ?? 0;
        state.page = action.payload.page ?? 1;
        state.limit = action.payload.limit ?? 10;
      },
    );

    builder.addCase(fetchFactoryExpenses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* ================= FETCH BY ID ================= */
    builder.addCase(fetchFactoryExpenseById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchFactoryExpenseById.fulfilled,
      (
        state,
        action: PayloadAction<{ success: boolean; expense: FactoryExpense }>,
      ) => {
        state.loading = false;
        state.currentExpense = action.payload.expense;
      },
    );

    builder.addCase(fetchFactoryExpenseById.rejected, (state, action) => {
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
      },
    );

    builder.addCase(createFactoryExpense.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentExpense, setPage, setLimit } =
  factoryExpenseSlice.actions;

export default factoryExpenseSlice.reducer;
