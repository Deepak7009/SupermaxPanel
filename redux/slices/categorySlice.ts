import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createCategory,
  fetchCategories,
  updateCategory,
} from "../thunks/categoryThunks";
import { Category, CategoryState, FetchCategoriesResponse } from "../types/category";

const initialState: CategoryState = {
  categories: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (state, action: PayloadAction<FetchCategoriesResponse>) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      },
    );
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Category
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createCategory.fulfilled,
      (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categories.unshift(action.payload);
        state.total += 1;
      },
    );
    builder.addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Category
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateCategory.fulfilled,
      (state, action: PayloadAction<Category>) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      },
    );
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setError } = categorySlice.actions;
export default categorySlice.reducer;
