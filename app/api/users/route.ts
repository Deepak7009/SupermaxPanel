"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/app/admin/models/Admin";
import { getSessionUser } from "@/lib/session";

// ---------------- GET ALL USERS (superadmin only) ----------------
const getUsers = async () => {
  try {
    const { role, error } = await getSessionUser();
    if (error) return error;

    if (role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const users = await Admin.find({}, "-password").sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

// ---------------- CREATE USER (superadmin only) ----------------
const createUser = async (req: NextRequest) => {
  try {
    const { userId, role, error } = await getSessionUser();
    if (error) return error;

    if (role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const newUser = new Admin({
      name,
      email,
      password,
      role: "user",
      isActive: true,
      createdBy: userId,
    });

    await newUser.save();

    const { password: _pw, ...safe } = newUser.toObject();
    return NextResponse.json({ success: true, user: safe }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

// ---------------- PATCH — toggle isActive (superadmin only) ----------------
const patchUser = async (req: NextRequest) => {
  try {
    const { role, error } = await getSessionUser();
    if (error) return error;

    if (role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectToDatabase();

    const { id, isActive } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User id required" }, { status: 400 });
    }

    const user = await Admin.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, select: "-password" }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export { getUsers as GET, createUser as POST, patchUser as PATCH };
