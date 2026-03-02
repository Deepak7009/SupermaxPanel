import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ---------------- LOGIN ADMIN ----------------
export const loginAdmin = createAsyncThunk<
  { email: string; token: string },              // return type
  { email: string; password: string },           // argument type
  { rejectValue: string }                        // error string
>(
  "admin/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/admin/api/login", { email, password });

      // keep your logic exactly the same
      localStorage.setItem("token", data.token);

      return { email, token: data.token };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Network error");
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

// ---------------- REGISTER ADMIN ----------------
export const registerAdmin = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: string }
>(
  "admin/registerAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await axios.post("/admin/api/register", { email, password });

      // you said: don't auto-login → so I keep it the same
      // no setAdmin call here
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.error || "Network error");
      }
      return rejectWithValue("Unexpected error");
    }
  }
);
  
