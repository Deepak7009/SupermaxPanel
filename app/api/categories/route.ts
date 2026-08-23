"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "../../admin/models/Category";
import { getSessionUser } from "@/lib/session";

// ---------------- GET CATEGORIES ----------------
const getCategories = async (req: NextRequest) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const parent = searchParams.get("parent") || "";

    const query: Record<string, unknown> = { isActive: true, userId };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (parent === "root") {
      query.parent = null;
    } else if (parent) {
      query.parent = parent;
    }

    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .populate("parent", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ categories, total, page, limit });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
};

// ---------------- CREATE CATEGORY ----------------
const createCategory = async (req: NextRequest) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();

    const { name, slug, description, parent, isActive } = await req.json();

    const category = new Category({
      userId,
      name,
      slug,
      description,
      parent: parent?._id || parent || null,
      isActive,
    });

    await category.save();

    const saved = await Category.findById(category._id).populate("parent", "name");
    return NextResponse.json(saved);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
};

export { getCategories as GET, createCategory as POST };
