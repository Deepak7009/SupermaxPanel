"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/app/admin/models/Admin";

// ---------------- REGISTER ----------------
// First-ever registration → becomes superadmin.
// After that, self-registration is disabled.
// New users are created by the superadmin via /api/users.
const adminRegister = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const totalAdmins = await Admin.countDocuments();

    if (totalAdmins > 0) {
      return NextResponse.json(
        { error: "Registration is disabled. Contact your superadmin." },
        { status: 403 }
      );
    }

    // First user ever → superadmin
    const admin = new Admin({
      name,
      email,
      password,
      role: "superadmin",
      isActive: true,
    });

    await admin.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export { adminRegister as POST };
