"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Customer, { ICustomer } from "../../models/Customer";
import "@/app/admin/models/Order";
import mongoose, { FilterQuery } from "mongoose";
import { CustomerDetail } from "@/redux/types/customer";

// ---------------- GET ALL / SINGLE CUSTOMER ----------------
const getCustomers = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = req.nextUrl;
    const id = url.searchParams.get("id");
    const search = url.searchParams.get("search") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");

    /* ======================================================
       ✅ GET SINGLE CUSTOMER
    ====================================================== */
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const customer = await Customer.findById(id)
        .populate("orders")
        .lean<CustomerDetail | null>();

      if (!customer) {
        return NextResponse.json(
          { success: false, message: "Customer not found" },
          { status: 404 }
        );
      }

      const totalOrders = customer.orders.length;
      const totalPages = Math.ceil(totalOrders / limit);

      return NextResponse.json({
        success: true,
        customer,
        pagination: {
          totalItems: totalOrders,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    }

    // ❌ INVALID ID PROTECTION
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid customer id" },
        { status: 400 }
      );
    }

    /* ======================================================
       ✅ GET ALL CUSTOMERS
    ====================================================== */

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

    // const totalPages = Math.ceil(total / limit);

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
