"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "../../models/Product";
import Category from "../../models/Category";
import { FilterQuery } from "mongoose";

// ---------------- GET PRODUCTS WITH PAGINATION & FILTERS ----------------
const getProducts = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = req.nextUrl;
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");

    // ---------------- Build query ----------------
    const query: FilterQuery<typeof Product> = { isActive: true };

    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    // Fetch products and total count in parallel
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category")
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      products,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
};

// ---------------- CREATE PRODUCT ----------------
const createProduct = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      name,
      slug,
      description,
      category,
      price,
      discount,
      stock,
      sku,
      images,
      brand,
      weight,
      dimensions,
      tags,
      isFeatured,
    } = body;

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    // ✅ Calculate finalPrice here
    const finalPrice = price - (price * (discount || 0)) / 100;

    const product = new Product({
      name,
      slug,
      description,
      category,
      price,
      discount: discount || 0,
      finalPrice,  // must provide
      stock,
      sku,
      images: images || [],
      brand,
      weight,
      dimensions,
      tags: tags || [],
      isFeatured: isFeatured || false,
      isActive: true,
    });

    await product.save();
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
};


// ---------------- EXPORT HANDLERS ----------------
export { getProducts as GET, createProduct as POST };
