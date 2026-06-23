"use server";

import { NextRequest, NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";

import Category from "../../admin/models/Category";

// ---------------- GET CATEGORIES ----------------

const getCategories = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const query: Record<string, unknown> = {
      isActive: true,
    };

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    const total = await Category.countDocuments(query);

    const categories = await Category.find(query)
      .populate("parent", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      categories,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to fetch categories",
      },
      {
        status: 500,
      },
    );
  }
};

// ---------------- CREATE CATEGORY ----------------

const createCategory = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const body = await req.json();

    const { name, slug, description, parent, isActive } = body;

    const category = new Category({
      name,
      slug,
      description,
      parent: parent?._id || parent || null,
      isActive,
    });

    await category.save();

    const savedCategory = await Category.findById(category._id).populate(
      "parent",
      "name",
    );

    return NextResponse.json(savedCategory);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to create category",
      },
      {
        status: 500,
      },
    );
  }
};

export { getCategories as GET, createCategory as POST };
