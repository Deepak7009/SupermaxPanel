import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order from "@/app/admin/models/Order";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const id = params.id;
    const data = await req.json();

    const updated = await Order.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
    if (!updated)
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
