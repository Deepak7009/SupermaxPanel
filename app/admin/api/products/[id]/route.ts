"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/app/admin/models/Product";
import Category from "@/app/admin/models/Category";

// ---------------- UPDATE PRODUCT ----------------
interface Params {
  id: string; // adjust according to your route
}

const updatedProduct = async (
  req: NextRequest,
  context: { params: Promise<Params> }
) => {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    console.log("params.id:", id);

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
      isActive,
    } = body;

    console.log("category at updatedProduct", category?.name);

    // Validate category
    // const existingCategory = await Category.findById(category._id);
    // if (!existingCategory) {
    //   return NextResponse.json(
    //     { error: "Category not found" },
    //     { status: 400 }
    //   );
    // }

    // Recalculate final price
    const finalPrice = price - (price * (discount || 0)) / 100;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        description,
        category, // ✔ MUST be ObjectId
        price,
        discount: discount || 0,
        finalPrice,
        stock,
        sku,
        images: images || [],
        brand,
        weight,
        dimensions,
        tags: tags || [],
        isFeatured: isFeatured || false,
        isActive: isActive ?? true,
      },
      { new: true }
    ).populate("category"); // 👈 IMPORTANT

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
};

export { updatedProduct as PUT };
