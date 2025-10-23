import axios from "axios";
import { AppDispatch } from "../store";
import { setAdmin, setLoading, setError } from "../slices/adminSlice";

const loginAdmin =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const { data } = await axios.post("/admin/api/login", { email, password });

      dispatch(setAdmin({ email, token: data.token }));
      localStorage.setItem("token", data.token); // persist token
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        dispatch(setError(err.response?.data?.error || "Network error"));
      } else {
        dispatch(setError("Unexpected error"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

const registerAdmin =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const { data } = await axios.post("/admin/api/register", { email, password });

      // Optional: auto-login after registration
      // dispatch(setAdmin({ email, token: data.token }));
      // localStorage.setItem("token", data.token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        dispatch(setError(err.response?.data?.error || "Network error"));
      } else {
        dispatch(setError("Unexpected error"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

export { loginAdmin, registerAdmin };
