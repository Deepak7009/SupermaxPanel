// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface Product {
//   _id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   category: { _id: string; name: string };
//   //   category: string;
//   price: number;
//   discount?: number;
//   finalPrice: number;
//   stock: number;
//   sku: string;
//   images?: string[];
//   brand?: string;
//   weight?: string;
//   dimensions?: { length?: number; width?: number; height?: number };
//   tags?: string[];
//   isFeatured: boolean;
//   isActive: boolean;
// }

// // ✅ Slice state
// interface ProductState {
//   products: Product[];
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ProductState = {
//   products: [],
//   loading: false,
//   error: null,
// };

// // ✅ Slice
// const productSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {
//     setProducts: (state, action: PayloadAction<Product[]>) => {
//       state.products = action.payload;
//     },
//     addProduct: (state, action: PayloadAction<Product>) => {
//       state.products.push(action.payload);
//     },
//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action: PayloadAction<string | null>) => {
//       state.error = action.payload;
//     },
//     editProduct: (state, action: PayloadAction<Product>) => {
//       const updated = action.payload;
//       const index = state.products.findIndex((p) => p._id === updated._id);
//       if (index !== -1) {
//         state.products[index] = updated;
//       }
//     },
//   },
// });

// export const { setProducts, addProduct, setLoading, setError, editProduct } =
//   productSlice.actions;
// export default productSlice.reducer;
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
}

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
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.products = action.payload;
    });
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
