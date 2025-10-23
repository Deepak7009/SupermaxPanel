"use client";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logoutAdmin } from "@/redux/slices/adminSlice";

const AdminHeader = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => setMounted(true), []);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutAdmin());

    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <header className="flex items-center justify-between bg-[var(--background)] text-[var(--foreground)] px-6 py-3 shadow-md transition-colors">
      {/* Logo */}
      <Link href="/admin" className="text-xl font-bold">
        Admin Panel
      </Link>

      {/* Right section */}
      <div className="flex items-center gap-4 relative">
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full hover:bg-[var(--muted)] transition"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
        )}

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-full hover:bg-[var(--muted)] transition"
          >
            <User className="w-6 h-6" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-lg shadow-lg z-50">
              <Link
                href="/admin/profile"
                className="block px-4 py-2 hover:bg-[var(--muted)] transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-[var(--muted)] transition text-red-500"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
