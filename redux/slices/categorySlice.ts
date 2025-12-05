import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCategories, createCategory } from "../thunks/categoryThunks";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: { _id: string; name: string } | null;
  level: number;
  ancestors?: Array<{ _id: string; name: string; slug: string }>;
  isActive: boolean;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Optional manual setter
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  // ---------------- Extra Reducers (async) ----------------
  extraReducers: (builder) => {
    // fetchCategories
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
      state.loading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createCategory
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
      state.loading = false;
      state.categories.push(action.payload);
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setError } = categorySlice.actions;
export default categorySlice.reducer;
