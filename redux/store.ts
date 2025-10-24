import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
// import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice"
import categoryReducer from "./slices/categorySlice"

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    // user: userReducer,
    product: productReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
