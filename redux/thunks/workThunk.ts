import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  FetchWorkEntriesResponse,
  CreateWorkEntryPayload,
  CreateWorkEntryResponse,
} from "../types/work";

/* -------- FETCH WORK ENTRIES WITH PAGINATION -------- */
export const fetchWorkEntries = createAsyncThunk<
  FetchWorkEntriesResponse,
  { employeeId: string; page: number; limit: number }
>(
  "work/fetchWorkEntries",
  async ({ employeeId, page, limit }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<FetchWorkEntriesResponse>(
        `/admin/api/work?employeeId=${employeeId}&page=${page}&limit=${limit}`,
      );
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch work entries",
        );
      }
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error",
      );
    }
  },
);

/* -------- CREATE WORK ENTRY -------- */
export const createWorkEntry = createAsyncThunk<
  CreateWorkEntryResponse,
  CreateWorkEntryPayload
>("work/createWorkEntry", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axios.post<CreateWorkEntryResponse>(
      "/admin/api/work",
      payload,
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create work entry",
      );
    }
    return rejectWithValue(
      err instanceof Error ? err.message : "Unknown error",
    );
  }
});
