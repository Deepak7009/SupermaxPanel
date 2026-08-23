"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "../../admin/models/Product";
import "../../admin/models/Category"; // ensure Category schema is registered for populate
import { FilterQuery } from "mongoose";
import { getSessionUser } from "@/lib/session";

// ---------------- GET PRODUCTS ----------------
const getProducts = async (req: NextRequest) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();

    const url = req.nextUrl;
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");

    const query: FilterQuery<typeof Product> = { userId };

    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.categories = { $in: [category] };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).populate("categories").skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, products, total, page, limit });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
};

// ---------------- CREATE PRODUCT ----------------
const createProduct = async (req: NextRequest) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();

    const body = await req.json();
    const {
      name, slug, description, categories, price, discount,
      stock, sku, images, brand, weight, dimensions, tags, isFeatured,
    } = body;

    if (!categories || categories.length === 0) {
      return NextResponse.json({ error: "At least one category is required" }, { status: 400 });
    }

    const categoryIds: string[] = categories.map(
      (c: { _id: string } | string) => (typeof c === "string" ? c : c._id)
    );

    const finalPrice = price - (price * (discount || 0)) / 100;

    const product = new Product({
      userId,
      name, slug, description,
      categories: categoryIds,
      price, discount: discount || 0, finalPrice,
      stock, sku,
      images: images || [],
      brand, weight, dimensions,
      tags: tags || [],
      isFeatured: isFeatured || false,
      isActive: true,
    });

    await product.save();
    await product.populate("categories");
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
};

export { getProducts as GET, createProduct as POST };
