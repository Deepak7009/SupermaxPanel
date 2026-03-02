import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  FetchEmployeesParams,
  FetchEmployeesResponse,
  FetchEmployeeByIdResponse,
  CreateEmployeePayload,
  CreateEmployeeResponse,
} from "../types/employee";

/* -------- FETCH ALL EMPLOYEES -------- */
export const fetchEmployees = createAsyncThunk<
  FetchEmployeesResponse,
  FetchEmployeesParams | undefined
>(
  "employee/fetchEmployees",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      if (params?.search) query.append("search", params.search);
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());

      const { data } = await axios.get<FetchEmployeesResponse>(
        `/admin/api/employees?${query.toString()}`
      );

      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch employees"
        );
      }
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
);

/* -------- FETCH EMPLOYEE BY ID -------- */
export const fetchEmployeeById = createAsyncThunk<
  FetchEmployeeByIdResponse,
  string
>(
  "employee/fetchEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<FetchEmployeeByIdResponse>(
        `/admin/api/employees?id=${id}`
      );
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to fetch employee"
        );
      }
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
);

/* -------- CREATE EMPLOYEE -------- */
export const createEmployee = createAsyncThunk<
  CreateEmployeeResponse,
  CreateEmployeePayload
>(
  "employee/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<CreateEmployeeResponse>(
        "/admin/api/employees",
        employeeData
      );
      return data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || "Failed to create employee"
        );
      }
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
);
