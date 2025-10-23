"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="w-full bg-[var(--background)] text-[var(--foreground)] shadow-md fixed top-0 left-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            {/* Left: Logo */}
            <div className="text-2xl font-bold">
              Supermax
            </div>

            {/* Right: Desktop nav */}
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-6 items-center">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="hover:opacity-80 font-medium transition"
                  >
                    {item.name}
                  </Link>
                ))}
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="hover:opacity-80 transition"
                    title="Toggle theme"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                )}
                <button className="bg-[var(--foreground)] text-[var(--background)] px-4 py-2 rounded hover:opacity-80 transition">
                  Login
                </button>
              </nav>

              {/* Mobile Theme Toggle */}
              <div className="md:hidden">
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="hover:opacity-80 transition"
                    title="Toggle theme"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden text-3xl focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Slide-In Menu */}
      <div
        className={`fixed top-0 right-0 w-[70%] h-full transition-transform duration-300 z-40 bg-[var(--background)] text-[var(--foreground)] p-6 space-y-4 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold">
            Supermax
          </div>
          <button
            onClick={closeMenu}
            className="text-2xl"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="block text-lg font-medium hover:opacity-80"
            onClick={closeMenu}
          >
            {item.name}
          </Link>
        ))}

        <button
          className="w-full bg-red-400 text-white px-4 py-2 rounded hover:opacity-80 transition"
          onClick={closeMenu}
        >
          Login
        </button>
      </div>
    </>
  );
};

export default Navbar;
