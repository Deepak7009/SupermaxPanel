import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  _id: string; // always string in slice
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: { _id: string; name: string } | null;
  level: number;
  ancestors?: Array<{ _id: string; name: string; slug: string }>;
  isActive: boolean;
}

// ✅ Slice state
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

// ✅ Slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCategories, addCategory, setLoading, setError } = categorySlice.actions;
export default categorySlice.reducer;
