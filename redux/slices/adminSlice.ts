import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  token: null,
  email: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logoutAdmin: (state) => {
      state.token = null;
      state.email = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAdmin, logoutAdmin, setLoading, setError } = adminSlice.actions;
export default adminSlice.reducer;
