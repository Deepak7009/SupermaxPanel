"use client";

import Sidebar from "@/components/Sidebar";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import AdminHeader from "@/components/AdminHeader";
import AdminFooter from "@/components/AdminFooter";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AdminMiddleware from "./middleware/AdminMiddleware";
import { usePathname } from "next/navigation";

// Redux
import { Provider } from "react-redux";
import { store } from "@/redux/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isAuthPage =
    pathname?.includes("/login") || pathname?.includes("/register");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Provider store={store}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* Sidebar */}
            {!isAuthPage && (
              <aside
                className={`h-screen fixed top-0 left-0 p-4 overflow-hidden bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-r border-[var(--sidebar-border)] transition-all duration-300
              ${collapsed ? "w-20" : "w-64"}`}
              >
                <Sidebar collapsed={collapsed} />
              </aside>
            )}

            {/* Collapse button */}
            {!isAuthPage && (
              <div
                className="absolute top-[20px] -translate-x-1/2 transition-all duration-300"
                style={{ left: collapsed ? "80px" : "256px" }}
              >
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="bg-[var(--background)] border border-[var(--border)] rounded-full p-1 shadow-md hover:bg-[var(--muted)] transition"
                >
                  {collapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            {/* Main content */}
            {!isAuthPage ? (
              <AdminMiddleware>
                <div
                  className={`flex flex-col min-h-screen transition-all duration-300 ${
                    collapsed ? "ml-20" : "ml-64"
                  }`}
                >
                  <AdminHeader />
                  <main className="flex-1 p-6 mt-2 overflow-auto">
                    {children}
                  </main>
                  <AdminFooter />
                </div>
              </AdminMiddleware>
            ) : (
              <main>{children}</main>
            )}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
};

export default AdminLayout;
