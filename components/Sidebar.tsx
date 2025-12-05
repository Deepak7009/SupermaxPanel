import Link from "next/link";
import { Home, Box } from "lucide-react"; // Example icons
import Image from "next/image";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: <Home className="w-5 h-5" /> },
    {
      name: "Products",
      href: "/admin/products",
      icon: <Box className="w-5 h-5" />,
    },
    {
      name: "Orders",
      href: "/admin/products",
      icon: <Box className="w-5 h-5" />,
    },
    {
      name: "Factory Exp",
      href: "/admin/products",
      icon: <Box className="w-5 h-5" />,
    },
    {
      name: "Raw Metrial",
      href: "/admin/products",
      icon: <Box className="w-5 h-5" />,
    },
    {
      name: "Employ Exp",
      href: "/admin/products",
      icon: <Box className="w-5 h-5" />,
    },
    {
      name: "Total Exp",
      href: "/admin/products",
      icon: <Box className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 transition-all duration-300 flex items-center justify-center">
        {collapsed ? (
          <Image
            src="https://thumbs.dreamstime.com/b/admin-sign-laptop-icon-stock-vector-166205404.jpg?w=768"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
        ) : (
          <div className="flex items-center space-x-2">
            <Image
              src="https://thumbs.dreamstime.com/b/admin-sign-laptop-icon-stock-vector-166205404.jpg?w=768"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
        )}
      </h2>
      <hr />

      <ul className={`flex flex-col space-y-4 ${collapsed ? "mt-5" : "mt-0"}`}>
        {menuItems.map((item) => (
          <li key={item.name} className="relative group">
            <Link
              href={item.href}
              className={`flex items-center p-2 rounded hover:bg-[var(--muted)] transition-all duration-300
                ${
                  collapsed
                    ? "justify-center space-x-0"
                    : "justify-start space-x-3"
                }`}
              title={collapsed ? item.name : undefined} // simple tooltip on hover
            >
              {/* Icon always visible */}
              {item.icon}

              {/* Label visible only when not collapsed */}
              <span
                className={`transition-all duration-300 ${
                  collapsed ? "hidden" : "inline"
                }`}
              >
                {item.name}
              </span>
            </Link>

            {/* Optional: Fancy tooltip with Tailwind */}
            {collapsed && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
