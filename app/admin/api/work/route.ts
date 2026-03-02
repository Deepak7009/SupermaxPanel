"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import WorkEntry, { IWorkEntry } from "../../models/WorkEntry";
import Employee from "../../models/Employee";

/* ======================================================
   GET WORK ENTRIES
====================================================== */
const getWorkEntries = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = req.nextUrl;
    const employeeId = url.searchParams.get("employeeId");
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 5);

    if (!employeeId || !mongoose.Types.ObjectId.isValid(employeeId)) {
      return NextResponse.json(
        { success: false, message: "Invalid employee id" },
        { status: 400 },
      );
    }

    const total = await WorkEntry.countDocuments({ employee: employeeId });

    const entries = await WorkEntry.find({ employee: employeeId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IWorkEntry[]>();

    return NextResponse.json({
      success: true,
      entries,
      total,
      page,
      limit,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: (error as Error)?.message || "Unknown error occurred",
      },
      { status: 500 },
    );
  }
};

/* ======================================================
   CREATE WORK ENTRY
====================================================== */
const createWorkEntry = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const body = await req.json();

    const entry = await WorkEntry.create(body);

    await Employee.findByIdAndUpdate(body.employee, {
      $push: { workEntries: entry._id },
    });

    return NextResponse.json({
      success: true,
      entry,
    });
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Unknown error occurred" },
      { status: 500 },
    );
  }
};

export { getWorkEntries as GET, createWorkEntry as POST };
