"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Customer, { ICustomer } from "../../models/Customer";
import "@/app/admin/models/Order";
import { FilterQuery } from "mongoose";

// ---------------- GET ALL / SINGLE CUSTOMER ----------------
const getCustomers = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = req.nextUrl;
    const id = url.searchParams.get("id");
    const search = url.searchParams.get("search") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");

    // GET SINGLE CUSTOMER
    if (id) {
      const customer = await Customer.findById(id).populate("orders");

      if (!customer) {
        return NextResponse.json(
          { success: false, message: "Customer not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, customer });
    }

    // FIX: Use FilterQuery instead of any
    const query: FilterQuery<ICustomer> = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { email: regex }];
    }

    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      Customer.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Customer.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      customers,
      total,
      page,
      limit,
    });
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Unknown error occurred" },
      { status: 500 }
    );
  }
};

export { getCustomers as GET };
