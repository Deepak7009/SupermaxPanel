import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  User,
  FetchUsersResponse,
  CreateUserResponse,
  ToggleUserResponse,
} from "../types/user";
import { fetchUsers, createUser, toggleUserActive } from "../thunks/userThunks";

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // FETCH USERS
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<FetchUsersResponse>) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.users.length;
      },
    );
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // CREATE USER
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createUser.fulfilled,
      (state, action: PayloadAction<CreateUserResponse>) => {
        state.loading = false;
        state.users.unshift(action.payload.user);
        state.total += 1;
      },
    );
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // TOGGLE ACTIVE
    builder.addCase(
      toggleUserActive.fulfilled,
      (state, action: PayloadAction<ToggleUserResponse>) => {
        const updated = action.payload.user;
        const idx = state.users.findIndex((u) => u._id === updated._id);
        if (idx !== -1) state.users[idx] = updated;
        if (state.currentUser?._id === updated._id) state.currentUser = updated;
      },
    );
  },
});

export const { setPage, setCurrentUser } = userSlice.actions;
export default userSlice.reducer;
