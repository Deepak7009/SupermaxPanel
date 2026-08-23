import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchUsersResponse, CreateUserResponse, ToggleUserResponse } from "../types/user";

// FETCH ALL USERS
const fetchUsers = createAsyncThunk<FetchUsersResponse, void, { rejectValue: string }>(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || "Failed to fetch users");
      return data as FetchUsersResponse;
    } catch {
      return rejectWithValue("Network error");
    }
  },
);

// CREATE USER
const createUser = createAsyncThunk<
  CreateUserResponse,
  { name: string; email: string; password: string },
  { rejectValue: string }
>(
  "users/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || "Failed to create user");
      return data as CreateUserResponse;
    } catch {
      return rejectWithValue("Network error");
    }
  },
);

// TOGGLE ACTIVE
const toggleUserActive = createAsyncThunk<
  ToggleUserResponse,
  { id: string; isActive: boolean },
  { rejectValue: string }
>(
  "users/toggleActive",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || "Failed to update user");
      return data as ToggleUserResponse;
    } catch {
      return rejectWithValue("Network error");
    }
  },
);

export { fetchUsers, createUser, toggleUserActive };
