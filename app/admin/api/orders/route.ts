import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Order, { IOrder } from "../../models/Order";
import { FilterQuery } from "mongoose";

// -------------------------- CREATE ORDER --------------------------
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // Basic validation
    if (!data.customerName || !data.totalAmount || !Array.isArray(data.items)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const newOrder = await Order.create(data);

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
}

// -------------------------- GET ALL / SINGLE ORDER --------------------------
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = req.nextUrl;

    const id = url.searchParams.get("id");
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");

    // ---------------- GET SINGLE ORDER ----------------
    if (id) {
      const order = await Order.findById(id).populate("items.product");
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, order });
    }

    // ---------------- GET ALL ORDERS ----------------
    const query: FilterQuery<IOrder> = {};

    if (status) query.status = status;

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { customerName: regex },
        { customerEmail: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      total,
      page,
      limit,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
