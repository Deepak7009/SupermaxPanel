"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import RawMaterial from "@/app/admin/models/RawMaterial";
import { getSessionUser } from "@/lib/session";

interface Params {
  id: string;
}

const updateRawMaterial = async (
  req: NextRequest,
  context: { params: Promise<Params> },
) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();

    const { id } = await context.params;
    const body = await req.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updatedMaterial = await RawMaterial.findOneAndUpdate(
      { _id: id, userId },
      body,
      { new: true }
    );

    if (!updatedMaterial) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedMaterial);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update material" },
      { status: 500 },
    );
  }
};

export { updateRawMaterial as PUT };
