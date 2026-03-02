"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "../../models/Category";

// ---------------- GET CATEGORIES ----------------
const getCategories = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true });
    return NextResponse.json(categories);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
};

// ---------------- CREATE CATEGORY ----------------
const createCategory = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, slug, description, parent } = body;

    const category = new Category({
      name,
      slug,
      description,
      parent: parent || null,
    });

    await category.save();
    return NextResponse.json(category);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
};

// ---------------- EXPORT HANDLERS ----------------
export { getCategories as GET, createCategory as POST };
