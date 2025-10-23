"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import AdminPublicLayout from "../public-layout";
import { registerAdmin } from "@/redux/thunks/adminThunks";

const AdminRegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.admin
  );

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    await dispatch(registerAdmin(email, password));

    // Redirect to login page after successful registration
    if (!error) {
      router.push("/admin/login");
    }
  };

  return (
    <AdminPublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded shadow-md w-96"
        >
          <h1 className="text-2xl font-bold mb-6">Admin Register</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </AdminPublicLayout>
  );
};

export default AdminRegisterPage;
