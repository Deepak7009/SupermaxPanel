import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Employee,
  FetchEmployeesResponse,
  FetchEmployeeByIdResponse,
  CreateEmployeeResponse,
} from "../types/employee";
import { createEmployee, fetchEmployeeById, fetchEmployees } from "../thunks/employeeThunk";


/* -------- STATE TYPE -------- */
export interface EmployeeState {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  currentEmployee: Employee | null;
}

/* -------- INITIAL STATE -------- */
const initialState: EmployeeState = {
  employees: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
  currentEmployee: null,
};

/* -------- SLICE -------- */
const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearCurrentEmployee(state) {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    /* ================= FETCH EMPLOYEES ================= */
    builder.addCase(fetchEmployees.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchEmployees.fulfilled,
      (state, action: PayloadAction<FetchEmployeesResponse>) => {
        state.loading = false;
        state.employees = action.payload.employees;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      }
    );

    builder.addCase(fetchEmployees.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* ================= FETCH EMPLOYEE BY ID ================= */
    builder.addCase(fetchEmployeeById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchEmployeeById.fulfilled,
      (state, action: PayloadAction<FetchEmployeeByIdResponse>) => {
        state.loading = false;
        state.currentEmployee = action.payload.employee;
      }
    );

    builder.addCase(fetchEmployeeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* ================= CREATE EMPLOYEE ================= */
    builder.addCase(createEmployee.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      createEmployee.fulfilled,
      (state, action: PayloadAction<CreateEmployeeResponse>) => {
        state.loading = false;
        state.employees.unshift(action.payload.employee);
        state.total += 1;
      }
    );

    builder.addCase(createEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

/* -------- EXPORTS -------- */
export const { clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
