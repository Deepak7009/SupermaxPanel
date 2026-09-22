"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/app/admin/models/Admin";

// POST /api/auth/set-password
// Body: { token: string, password: string }
// Verifies the token, sets the password, activates the account,
// and returns the user fields so the client can call signIn.
const setPassword = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({
      passwordToken: token,
      passwordTokenExpiry: { $gt: new Date() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "This link is invalid or has expired" },
        { status: 400 }
      );
    }

    admin.password = password;
    admin.isActive = true;
    admin.passwordToken = undefined;
    admin.passwordTokenExpiry = undefined;
    await admin.save();

    // Return the email so the client can call signIn("credentials", { email, password })
    return NextResponse.json({
      success: true,
      email: admin.email,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export { setPassword as POST };
