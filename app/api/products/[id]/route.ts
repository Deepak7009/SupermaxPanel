"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Product from "@/app/admin/models/Product";
import { getSessionUser } from "@/lib/session";

interface Params {
  id: string;
}

const updatedProduct = async (
  req: NextRequest,
  context: { params: Promise<Params> }
) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();

    const { id } = await context.params;
    const body = await req.json();
    const {
      name,
      slug,
      description,
      categories,
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

    const finalPrice = price - (price * (discount || 0)) / 100;

    // Accept ObjectId strings or {_id, name} objects
    const categoryIds: string[] = (categories ?? []).map(
      (c: { _id: string } | string) => (typeof c === "string" ? c : c._id),
    );

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, userId },
      {
        name,
        slug,
        description,
        categories: categoryIds,
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
    ).populate("categories");

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
