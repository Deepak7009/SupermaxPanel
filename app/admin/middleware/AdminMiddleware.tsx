"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // fixed import

export default function AdminMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/admin/login"); // use replace to avoid back button issues
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      setLoading(false); // ✅ only set loading false if token is valid
    } catch (err) {
      router.replace("/admin/login"); // invalid token
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 text-lg">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
