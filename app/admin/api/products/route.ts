"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "../../models/Product";
import Category from "../../models/Category";

// ---------------- GET PRODUCTS ----------------
const getProducts = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const products = await Product.find({ isActive: true }).populate("category");
    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
