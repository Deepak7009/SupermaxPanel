import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
    category: { _id: string; name: string };
//   category: string;
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
}

// ✅ Slice state
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// ✅ Slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, addProduct, setLoading, setError } =
  productSlice.actions;
export default productSlice.reducer;
