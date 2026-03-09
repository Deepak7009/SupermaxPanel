import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  RawMaterial,
  FetchRawMaterialsParams,
  CreateRawMaterialPayload,
} from "../types/rawMaterial";

/* ================= FETCH MATERIALS ================= */

export const fetchRawMaterials = createAsyncThunk<
  {
    success: boolean;
    materials: RawMaterial[];
    total: number;
    page: number;
    limit: number;
    totalAmount: number;
    pendingAmount: number;
    paidAmount: number;
  },
  FetchRawMaterialsParams | undefined,
  { rejectValue: string }
>(
  "rawMaterial/fetchRawMaterials",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      if (params?.search) query.append("search", params.search);
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.status) query.append("status", params.status);
      if (params?.month) query.append("month", params.month.toString());
      if (params?.year) query.append("year", params.year.toString());

      const { data } = await axios.get(
        `/admin/api/rawMaterial?${query.toString()}`
      );

      return {
        success: data.success,
        materials: data.materials ?? [],
        total: data.total ?? 0,
        page: data.page ?? 1,
        limit: data.limit ?? 10,
        totalAmount: data.totalAmount ?? 0,
        pendingAmount: data.pendingAmount ?? 0,
        paidAmount: data.paidAmount ?? 0,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch materials"
        );
      }

      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
);

/* ================= CREATE MATERIAL ================= */

export const createRawMaterial = createAsyncThunk<
  { success: boolean; material: RawMaterial },
  CreateRawMaterialPayload,
  { rejectValue: string }
>(
  "rawMaterial/createRawMaterial",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/admin/api/rawMaterial`, payload);

      return {
        success: true,
        material: data.material,
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to create raw material"
        );
      }

      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
);