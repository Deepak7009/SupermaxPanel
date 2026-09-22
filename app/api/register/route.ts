"use server";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/app/admin/models/Admin";
import { sendSetPasswordEmail } from "@/lib/mailer";

// ---------------- REGISTER ----------------
// First-ever registration → becomes superadmin (legacy path, keeps password fields).
// All subsequent registrations: accepts name + email only, creates an inactive account,
// and sends a "Set your password" email. The user activates via /admin/set-password.
const adminRegister = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const { name, email, password } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const totalAdmins = await Admin.countDocuments();

    if (totalAdmins === 0) {
      // ── First user ever → superadmin (requires password) ──
      if (!password) {
        return NextResponse.json(
          { error: "Password is required for the first registration" },
          { status: 400 }
        );
      }
      const admin = new Admin({
        name,
        email,
        password,
        role: "superadmin",
        isActive: true,
      });
      await admin.save();
      return NextResponse.json({ success: true, firstUser: true });
    }

    // ── Subsequent users: passwordless signup ──
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

    const admin = new Admin({
      name,
      email,
      password: "", // no password yet — blocked from login until set
      role: "user",
      isActive: false,
      passwordToken: token,
      passwordTokenExpiry: expiry,
    });

    await admin.save();

    await sendSetPasswordEmail(email, name, token);

    return NextResponse.json({ success: true, emailSent: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export { adminRegister as POST };
