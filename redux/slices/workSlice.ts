import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  WorkEntry,
  FetchWorkEntriesResponse,
  CreateWorkEntryResponse,
} from "../types/work";
import { createWorkEntry, fetchWorkEntries } from "../thunks/workThunk";

/* -------- STATE TYPE -------- */
export interface WorkState {
  entries: WorkEntry[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

/* -------- INITIAL STATE -------- */
const initialState: WorkState = {
  entries: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 5,
};

/* -------- SLICE -------- */
const workSlice = createSlice({
  name: "work",
  initialState,
  reducers: {
    clearWorkEntries(state) {
      state.entries = [];
      state.total = 0;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* ================= FETCH WORK ENTRIES ================= */
    builder.addCase(fetchWorkEntries.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchWorkEntries.fulfilled,
      (state, action: PayloadAction<FetchWorkEntriesResponse>) => {
        state.loading = false;
        state.entries = action.payload.entries;
        state.total = action.payload.total ?? action.payload.entries.length;
      }
    );

    builder.addCase(fetchWorkEntries.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* ================= CREATE WORK ENTRY ================= */
    builder.addCase(createWorkEntry.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      createWorkEntry.fulfilled,
      (state, action: PayloadAction<CreateWorkEntryResponse>) => {
        state.loading = false;
        state.entries.unshift(action.payload.entry);
        state.total += 1;
      }
    );

    builder.addCase(createWorkEntry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

/* -------- EXPORTS -------- */
export const { clearWorkEntries, setPage, setLimit } = workSlice.actions;
export default workSlice.reducer;
