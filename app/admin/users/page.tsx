"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSession as useNextSession } from "next-auth/react";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUsers } from "@/redux/thunks/userThunks";
import { setPage } from "@/redux/slices/userSlice";
import { toggleUserActive } from "@/redux/thunks/userThunks";
import { User } from "@/redux/types/user";

import Table, { Column } from "@/components/common/Table";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Pagination from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { Eye, ToggleLeft, ToggleRight, ShieldCheck } from "lucide-react";
import AddUserModal from "@/components/modals/AddUserModal";

const UsersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data: session, status } = useNextSession();

  const { users, total, page, limit, loading } = useSelector(
    (state: RootState) => state.users
  );

  const [search, setSearch] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);

  const totalPages = Math.ceil(total / limit);

  // only superadmin can access this page
  useEffect(() => {
    if (session && session.user.role !== "superadmin") {
      router.replace("/admin");
    }
  }, [session, router]);

  useEffect(() => {
    dispatch(setPage(1));
  }, [search, dispatch]);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // client-side search filter (guard against missing name/email)
  const filtered = users.filter((u) =>
    (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email ?? "").toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * limit, page * limit);
  const filteredTotal = filtered.length;
  const filteredPages = Math.ceil(filteredTotal / limit);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    { key: "_id", label: "#" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "isActive", label: "Status" },
    { key: "createdAt", label: "Created" },
    { key: "actions", label: "Actions" },
  ];

  // Wait for session to load before checking role
  if (status === "loading") return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!session) return null;
  if (session.user.role !== "superadmin") {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p className="font-medium">Access denied.</p>
        <p className="text-sm mt-1">Your session role is: <code className="bg-muted px-1 rounded">{session.user.role ?? "undefined"}</code></p>
        <p className="text-sm mt-1">Please <button className="underline" onClick={() => { import("next-auth/react").then(m => m.signOut({ callbackUrl: "/admin/login" })); }}>sign out</button> and log in again.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Users</h1>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => setAddUserOpen(true)}>Add User</Button>
      </div>

      {/* Table */}
      <Card className="p-4 rounded-xl">
        <Table<User & { actions?: never }>
          columns={columns}
          data={paginated}
          loading={loading}
          renderCell={(user, key, index) => {
            switch (key) {
              case "_id":
                return <span>{index + 1 + (page - 1) * limit}</span>;

              case "role":
                return (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.role === "superadmin"
                      ? "bg-[var(--badge-superadmin-bg)] text-[var(--badge-superadmin-text)]"
                      : "bg-[var(--badge-user-bg)] text-[var(--badge-user-text)]"
                  }`}>
                    {user.role === "superadmin" && <ShieldCheck className="w-3 h-3" />}
                    {user.role === "superadmin" ? "Super Admin" : "User"}
                  </span>
                );

              case "isActive":
                return (
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive
                      ? "bg-[var(--badge-active-bg)] text-[var(--badge-active-text)]"
                      : "bg-[var(--badge-inactive-bg)] text-[var(--badge-inactive-text)]"
                  }`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                );

              case "createdAt":
                return new Date(user.createdAt).toLocaleDateString();

              case "actions":
                return (
                  <div className="flex items-center gap-2">
                    <Button onClick={() => router.push(`/admin/users/${user._id}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    {user._id !== session?.user.id && (
                      <Button
                        onClick={() =>
                          dispatch(toggleUserActive({ id: user._id, isActive: !user.isActive }))
                        }
                      >
                        {user.isActive
                          ? <ToggleRight className="w-4 h-4 text-[var(--icon-success)]" />
                          : <ToggleLeft className="w-4 h-4" />
                        }
                      </Button>
                    )}
                  </div>
                );

              default:
                return user[key] ? String(user[key]) : "";
            }
          }}
        />

        {paginated.length === 0 && !loading && (
          <div className="text-center text-muted-foreground py-6">
            No users found
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={filteredPages}
          totalItems={filteredTotal}
          onPageChange={(p) => dispatch(setPage(p))}
        />
      </Card>

      {/* Modal */}
      <AddUserModal isOpen={addUserOpen} setIsOpen={setAddUserOpen} />
    </div>
  );
};

export default UsersPage;
