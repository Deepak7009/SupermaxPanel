"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import AdminPublicLayout from "../public-layout";
import { registerAdmin } from "@/redux/thunks/adminThunks";

const AdminRegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.admin
  );

  // ---------------- FIX #1: prevent unwanted auto redirect ----------------
  useEffect(() => {
    if (
      isAuthenticated &&
      typeof window !== "undefined" &&
      window.location.pathname === "/admin/register"
    ) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  // ---------------- FIX #2: correct success detection ----------------
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setLocalError("");

    // DISPATCH WITH RESULT CHECK
    const result = dispatch(registerAdmin({ email, password }));

    // If registration successful → go to login
    if (registerAdmin.fulfilled.match(result)) {
      router.push("/admin/login");
    }
  };

  return (
    <AdminPublicLayout>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 overflow-hidden">
        {/* Animated glowing blobs */}
        <motion.div
          className="absolute w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-30"
          animate={{ x: [0, 120, 0], y: [0, 80, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute w-96 h-96 bg-green-400 rounded-full blur-3xl opacity-30"
          animate={{ x: [0, -120, 0], y: [0, -60, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glass card */}
        <motion.form
          onSubmit={handleRegister}
          className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-2xl w-96 text-white"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
            Admin Register
          </h1>

          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200"
            required
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />

          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200"
            required
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />

          <motion.input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-6 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-200"
            required
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />

          {/* Password mismatch */}
          {localError && (
            <p className="text-red-400 text-sm mb-3 text-center">
              {localError}
            </p>
          )}

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>

          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}

          {/* Login link */}
          <div className="text-center mt-6 text-sm">
            <span className="text-gray-300">Already have an account? </span>
            <button
              type="button"
              onClick={() => router.push("/admin/login")}
              className="text-green-300 font-semibold hover:text-green-100 transition-colors"
            >
              Login
            </button>
          </div>
        </motion.form>
      </div>
    </AdminPublicLayout>
  );
};

export default AdminRegisterPage;
