import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createProduct, fetchProducts, updateProduct } from "../thunks/productThunks";

// ---------------- Slice state ----------------
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category: { _id: string; name: string };
  price: number;
  discount?: number;
  finalPrice: number;
  stock: number;
  sku: string;
  images?: string[];
  brand?: string;
  weight?: string;
  dimensions?: { length?: number; width?: number; height?: number };
  tags?: string[];
  isFeatured: boolean;
  isActive: boolean;
  actions? :string;
}

interface ProductState {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

// ---------------- Slice ----------------
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (
        state,
        action: PayloadAction<{
          products: Product[];
          total: number;
          page: number;
          limit: number;
        }>
      ) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createProduct
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false;
      state.products.push(action.payload);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateProduct
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false;
      const index = state.products.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) state.products[index] = action.payload;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setError } = productSlice.actions;
export default productSlice.reducer;
