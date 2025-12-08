"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/app/admin/models/Order";

// ---------------- UPDATE ORDER ----------------
interface Params {
  id: string; // route parameter
}

const updatedOrder = async (
  req: NextRequest,
  context: { params: Promise<Params> }
) => {
  try {
    await connectToDatabase();

    const { id } = await context.params;
    const data = await req.json();

    // Optional: validate incoming data here
    // Example: check if status is valid
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (data.status && !validStatuses.includes(data.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status" },
        { status: 400 }
      );
    }

    const updated = await Order.findByIdAndUpdate(id, data, { new: true }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
};

export { updatedOrder as PUT };
