"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, User, LogOut, Menu, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const isSuperAdmin = session?.user.role === "superadmin";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-[var(--background)] text-[var(--foreground)] px-4 md:px-6 py-3 transition-colors shadow-[0_2px_8px_var(--shadow-color)] shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--muted)] transition"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/admin" className="text-xl font-bold">
          Admin Panel
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full hover:bg-[var(--muted)] transition"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        )}

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--muted)] transition"
          >
            <User className="w-5 h-5" />
            {session?.user.name && (
              <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                {session.user.name}
              </span>
            )}
            {isSuperAdmin && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--badge-superadmin-bg)] text-[var(--badge-superadmin-text)]">
                <ShieldCheck className="w-3 h-3" /> Super
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-lg shadow-lg z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-[var(--border)]">
                <p className="text-sm font-semibold truncate">{session?.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session?.user.email}</p>
                <span className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isSuperAdmin
                    ? "bg-[var(--badge-superadmin-bg)] text-[var(--badge-superadmin-text)]"
                    : "bg-[var(--badge-user-bg)] text-[var(--badge-user-text)]"
                }`}>
                  {isSuperAdmin ? <><ShieldCheck className="w-3 h-3" /> Super Admin</> : "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-[var(--muted)] transition text-[var(--text-error)] text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
