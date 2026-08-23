import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RawMaterial, RawMaterialState } from "../types/rawMaterial";
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
} from "../thunks/rawMaterialThunks";

const initialState: RawMaterialState = {
  materials: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,

  totalAmount: 0,
  pendingAmount: 0,
  paidAmount: 0,
};

const rawMaterialSlice = createSlice({
  name: "rawMaterial",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRawMaterials.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchRawMaterials.fulfilled, (state, action) => {
      state.loading = false;
      state.materials = action.payload.materials;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;

      state.totalAmount = action.payload.totalAmount;
      state.pendingAmount = action.payload.pendingAmount;
      state.paidAmount = action.payload.paidAmount;
    });

    builder.addCase(fetchRawMaterials.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error";
    });

    builder.addCase(createRawMaterial.fulfilled, (state, action) => {
      state.materials.unshift(action.payload.material);
      state.total += 1;
    });
    builder.addCase(updateRawMaterial.fulfilled, (state, action) => {
      const index = state.materials.findIndex(
        (m) => m._id === action.payload._id,
      );

      if (index !== -1) {
        state.materials[index] = action.payload;
      }
    });
  },
});

export const { setPage } = rawMaterialSlice.actions;

export default rawMaterialSlice.reducer;
