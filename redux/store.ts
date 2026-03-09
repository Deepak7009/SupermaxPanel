import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
// import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
import orderReducer from "./slices/orderSlice";
import customerReducer from "./slices/customerSlice";
import employeeReducer from "./slices/employeeSlice";
import workReducer from "./slices/workSlice";
import factoryExpenseReducer from "./slices/factoryExpenseSlice";
import rawMaterialReducer from "./slices/rawMaterialSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    // user: userReducer,
    product: productReducer,
    category: categoryReducer,
    orders: orderReducer,
    customers: customerReducer,
    employee: employeeReducer,
    work: workReducer,
    factoryExpense: factoryExpenseReducer,
    rawMaterial: rawMaterialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
