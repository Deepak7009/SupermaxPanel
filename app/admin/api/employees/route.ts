"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose, { FilterQuery } from "mongoose";
import Employee, { IEmployee } from "../../models/Employee";

/* ======================================================
   GET ALL / SINGLE EMPLOYEE
====================================================== */
const getEmployees = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = req.nextUrl;
    const id = url.searchParams.get("id");
    const search = url.searchParams.get("search") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");

    /* ======================================================
       ✅ GET SINGLE EMPLOYEE
    ====================================================== */
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const employee = await Employee.findById(id)
        .populate("workEntries")
        .lean();

      if (!employee) {
        return NextResponse.json(
          { success: false, message: "Employee not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        employee,
      });
    }

    // ❌ INVALID ID
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid employee id" },
        { status: 400 }
      );
    }

    /* ======================================================
       ✅ GET ALL EMPLOYEES
    ====================================================== */
    const query: FilterQuery<IEmployee> = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const skip = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Employee.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      employees,
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

/* ======================================================
   CREATE EMPLOYEE
====================================================== */
const createEmployee = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const body = await req.json();

    const employee = await Employee.create(body);

    return NextResponse.json({
      success: true,
      employee,
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

/* ======================================================
   EXPORTS (IMPORTANT)
====================================================== */
export { getEmployees as GET, createEmployee as POST };
