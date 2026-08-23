"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUsers } from "@/redux/thunks/userThunks";
import { toggleUserActive } from "@/redux/thunks/userThunks";
import { setCurrentUser } from "@/redux/slices/userSlice";

import { Card } from "@/components/ui/card";
import Button from "@/components/common/Button";
import {
  Mail,
  ShieldCheck,
  User,
  Calendar,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
} from "lucide-react";

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { data: session, status } = useSession();

  const { users, currentUser, loading } = useSelector(
    (state: RootState) => state.users
  );

  // load users list if empty (e.g. direct URL visit)
  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  // set currentUser from the list when id or users change
  useEffect(() => {
    if (!id) return;
    const found = users.find((u) => u._id === id) ?? null;
    dispatch(setCurrentUser(found));
  }, [id, users, dispatch]);

  // guard: only superadmin
  useEffect(() => {
    if (session && session.user.role !== "superadmin") {
      router.replace("/admin");
    }
  }, [session, router]);

  if (status === "loading" || loading) return <div className="p-6">Loading...</div>;
  if (session?.user.role !== "superadmin") return null;
  if (!currentUser) return <div className="p-6 text-muted-foreground">User not found</div>;

  const isSelf = currentUser._id === session?.user.id;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      {/* LEFT — Profile card */}
      <Card className="p-5 rounded-xl">
        <div className="flex flex-col items-center text-center gap-3">

          {/* Avatar */}
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
            {currentUser.name?.[0]?.toUpperCase() ?? <User className="w-8 h-8" />}
          </div>

          <h2 className="text-lg font-semibold">{currentUser.name}</h2>

          {/* Role badge */}
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            currentUser.role === "superadmin"
              ? "bg-[var(--badge-superadmin-bg)] text-[var(--badge-superadmin-text)]"
              : "bg-[var(--badge-user-bg)] text-[var(--badge-user-text)]"
          }`}>
            {currentUser.role === "superadmin" && <ShieldCheck className="w-3 h-3" />}
            {currentUser.role === "superadmin" ? "Super Admin" : "User"}
          </span>

          {/* Status badge */}
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
            currentUser.isActive
              ? "bg-[var(--badge-active-bg)] text-[var(--badge-active-text)]"
              : "bg-[var(--badge-inactive-bg)] text-[var(--badge-inactive-text)]"
          }`}>
            {currentUser.isActive ? "Active" : "Inactive"}
          </span>

          {/* Info rows */}
          <div className="w-full mt-2 space-y-2 text-sm text-left">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Joined {new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Toggle active — can't toggle yourself */}
          {!isSelf && (
            <Button
              className="w-full mt-2"
              onClick={() =>
                dispatch(toggleUserActive({ id: currentUser._id, isActive: !currentUser.isActive }))
              }
            >
              {currentUser.isActive
                ? <><ToggleRight className="w-4 h-4 text-[var(--icon-success)] mr-1" /> Disable User</>
                : <><ToggleLeft className="w-4 h-4 mr-1" /> Enable User</>
              }
            </Button>
          )}

          {isSelf && (
            <p className="text-xs text-muted-foreground mt-1">This is your own account</p>
          )}
        </div>
      </Card>

      {/* RIGHT — Details */}
      <Card className="lg:col-span-3 p-5 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <h3 className="text-lg font-semibold">User Details</h3>
          </div>
          <Button onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </div>

        {/* Detail rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name",   value: currentUser.name },
            { label: "Email",       value: currentUser.email },
            { label: "Role",        value: currentUser.role === "superadmin" ? "Super Admin" : "User" },
            { label: "Status",      value: currentUser.isActive ? "Active" : "Inactive" },
            { label: "Created At",  value: new Date(currentUser.createdAt).toLocaleString() },
            { label: "Updated At",  value: new Date(currentUser.updatedAt).toLocaleString() },
            { label: "User ID",     value: currentUser._id },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-[var(--muted)] px-4 py-3"
            >
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-medium break-all">{value}</p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};

export default UserDetailPage;
