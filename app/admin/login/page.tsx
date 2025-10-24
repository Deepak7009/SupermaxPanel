"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import AdminPublicLayout from "../public-layout";
import { loginAdmin } from "@/redux/thunks/adminThunks";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await dispatch(loginAdmin(email, password));
  };

  return (
    <AdminPublicLayout>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 overflow-hidden">
        {/* Floating blobs for animated background */}
        <motion.div
          className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-30"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glass card */}
        <motion.form
          onSubmit={handleLogin}
          className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-2xl w-96 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
            Admin Login
          </h1>

          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-200"
            required
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />

          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-2 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-200"
            required
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
          <div className="text-right mt- mb-6">
            <button
              type="button"
              onClick={() => router.push("/admin/forgot-password")}
              className="text-blue-300 hover:text-blue-100 text-sm transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}

          {/* Forgot Password link */}
          

          {/* Sign Up link */}
          <div className="text-center mt-4 text-sm">
            <span className="text-gray-300">Don’t have an account? </span>
            <button
              type="button"
              onClick={() => router.push("/admin/register")}
              className="text-blue-300 font-semibold hover:text-blue-100 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </motion.form>
      </div>
    </AdminPublicLayout>
  );
};

export default AdminLoginPage;
