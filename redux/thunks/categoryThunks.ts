import axios from "axios";
import { AppDispatch } from "../store";
import { Category, setCategories, addCategory, setLoading, setError } from "../slices/categorySlice";

// Fetch all categories
const fetchCategories = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const { data } = await axios.get<Category[]>("/admin/api/categories");
    dispatch(setCategories(data));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      dispatch(setError(err.response?.data?.error || "Failed to fetch categories"));
    } else if (err instanceof Error) {
      dispatch(setError(err.message));
    } else {
      dispatch(setError("Unknown error"));
    }
  } finally {
    dispatch(setLoading(false));
  }
};

// Create new category
const createCategory = (
  categoryData: Omit<Category, "_id" | "ancestors" | "level">
) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const { data } = await axios.post<Category>("/admin/api/categories", categoryData);
    dispatch(addCategory(data));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      dispatch(setError(err.response?.data?.error || "Failed to create category"));
    } else if (err instanceof Error) {
      dispatch(setError(err.message));
    } else {
      dispatch(setError("Unknown error"));
    }
  } finally {
    dispatch(setLoading(false));
  }
};

// ✅ Exports at the bottom
export { fetchCategories, createCategory };
