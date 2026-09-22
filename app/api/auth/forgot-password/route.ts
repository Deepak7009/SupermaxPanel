"use server";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/app/admin/models/Admin";
import { sendForgotPasswordEmail } from "@/lib/mailer";

// POST /api/auth/forgot-password
// Body: { email: string }
// Finds the account, generates a 1-hour reset token, and sends the email.
// Always returns 200 to avoid leaking whether an email exists.
const forgotPassword = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    // Respond with success even if no account found — prevents email enumeration
    if (!admin) {
      return NextResponse.json({ success: true });
    }

    const token  = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    admin.passwordToken       = token;
    admin.passwordTokenExpiry = expiry;
    await admin.save();

    await sendForgotPasswordEmail(admin.email, admin.name || "there", token);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export { forgotPassword as POST };
