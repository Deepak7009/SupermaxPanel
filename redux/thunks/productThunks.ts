import axios from "axios";
import { AppDispatch } from "../store";
import { Product, setProducts, addProduct, setLoading, setError } from "../slices/productSlice";

// Fetch all products
const fetchProducts = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const { data } = await axios.get<Product[]>("/admin/api/products");
    dispatch(setProducts(data));
  } catch (err: unknown) {
    let message = "Unknown error";
    if (axios.isAxiosError(err)) message = err.response?.data?.error || "Failed to fetch products";
    else if (err instanceof Error) message = err.message;
    dispatch(setError(message));
  } finally {
    dispatch(setLoading(false));
  }
};

// Create new product
const createProduct = (productData: Omit<Product, "_id" | "finalPrice">) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const { data } = await axios.post<Product>("/admin/api/products", productData);
    dispatch(addProduct(data));
  } catch (err: unknown) {
    let message = "Unknown error";
    if (axios.isAxiosError(err)) message = err.response?.data?.error || "Failed to create product";
    else if (err instanceof Error) message = err.message;
    dispatch(setError(message));
  } finally {
    dispatch(setLoading(false));
  }
};

export { fetchProducts, createProduct };
