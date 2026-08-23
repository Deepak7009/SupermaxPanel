import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/app/admin/models/Category";
import { getSessionUser } from "@/lib/session";

const getCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();

    const { id } = await params;

    const category = await Category.findOne({ _id: id, userId }).populate("parent", "name");

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
};

const updateCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();

    const { id } = await params;
    const body = await req.json();

    const category = await Category.findOne({ _id: id, userId });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    if (body.name !== undefined) category.name = body.name;
    if (body.slug !== undefined) category.slug = body.slug;
    if (body.description !== undefined) category.description = body.description;
    if (body.image !== undefined) category.image = body.image;
    if ("parent" in body) {
      // Accept either a plain ObjectId string, or {_id, name} object from the modal
      category.parent = body.parent?._id ?? body.parent ?? null;
    }
    if (body.isActive !== undefined) category.isActive = body.isActive;

    await category.save(); // triggers pre-save: recomputes level & ancestors

    // Re-fetch with parent populated so the Redux slice gets the full shape
    const saved = await Category.findById(category._id).populate("parent", "name");

    return NextResponse.json(saved);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
};

export { getCategory as GET, updateCategory as PUT };
