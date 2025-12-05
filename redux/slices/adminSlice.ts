import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginAdmin, registerAdmin } from "../thunks/adminThunks";

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
      localStorage.removeItem("token");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  // Only added — no code changed
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // REGISTER
    builder.addCase(registerAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerAdmin.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setAdmin, logoutAdmin, setLoading, setError } =
  adminSlice.actions;

export default adminSlice.reducer;
