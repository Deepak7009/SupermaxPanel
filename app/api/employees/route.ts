"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose, { FilterQuery } from "mongoose";
import Employee, { IEmployee } from "../../admin/models/Employee";
import AdvancePayment from "../../admin/models/AdvancePayment";
import "@/app/admin/models/WorkEntry";
import { getSessionUser } from "@/lib/session";

// ---------------- GET ALL / SINGLE EMPLOYEE ----------------
const getEmployees = async (req: NextRequest) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();

    const url = req.nextUrl;
    const id = url.searchParams.get("id");
    const search = url.searchParams.get("search") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const employee = await Employee.findOne({ _id: id, userId }).lean();

      if (!employee) {
        return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 });
      }

      const totalsAgg = await AdvancePayment.aggregate([
        { $match: { employee: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$employee",
            advancePayment: { $sum: { $cond: [{ $eq: ["$type", "ADVANCE"] }, "$amount", 0] } },
            paidPayment:    { $sum: { $cond: [{ $eq: ["$type", "SALARY_PAYMENT"] }, "$amount", 0] } },
          },
        },
      ]);

      const advancePayment = totalsAgg[0]?.advancePayment ?? 0;
      const paidPayment = totalsAgg[0]?.paidPayment ?? 0;

      return NextResponse.json({
        success: true,
        employee: {
          ...employee,
          advancePayment,
          paidPayment,
        },
      });
    }

    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid employee id" }, { status: 400 });
    }

    const query: FilterQuery<IEmployee> = { userId };

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const skip = (page - 1) * limit;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const advanceMatch: Record<string, unknown> = { userId: userObjectId };
    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      advanceMatch.date = { $gte: start, $lte: end };
    } else if (year) {
      const start = new Date(Number(year), 0, 1);
      const end = new Date(Number(year), 11, 31, 23, 59, 59, 999);
      advanceMatch.date = { $gte: start, $lte: end };
    }

    const [employees, total, overallTotalsAgg] = await Promise.all([
      Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Employee.countDocuments(query),
      AdvancePayment.aggregate([
        { $match: advanceMatch },
        {
          $group: {
            _id: null,
            totalAdvance: { $sum: { $cond: [{ $eq: ["$type", "ADVANCE"] }, "$amount", 0] } },
            totalPaid:    { $sum: { $cond: [{ $eq: ["$type", "SALARY_PAYMENT"] }, "$amount", 0] } },
          },
        },
      ]),
    ]);

    /* ---- sync advancePayment / paidPayment from AdvancePayment collection ---- */
    const employeeIds = employees.map((e) => e._id);
    const empAdvanceMatch: Record<string, unknown> = {
      employee: { $in: employeeIds },
      userId: userObjectId,
    };
    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
      empAdvanceMatch.date = { $gte: start, $lte: end };
    } else if (year) {
      const start = new Date(Number(year), 0, 1);
      const end = new Date(Number(year), 11, 31, 23, 59, 59, 999);
      empAdvanceMatch.date = { $gte: start, $lte: end };
    }

    const totalsAgg = await AdvancePayment.aggregate([
      { $match: empAdvanceMatch },
      {
        $group: {
          _id: "$employee",
          advancePayment: { $sum: { $cond: [{ $eq: ["$type", "ADVANCE"] }, "$amount", 0] } },
          paidPayment:    { $sum: { $cond: [{ $eq: ["$type", "SALARY_PAYMENT"] }, "$amount", 0] } },
        },
      },
    ]);

    const totalsMap = new Map(totalsAgg.map((t) => [String(t._id), t]));
    const syncedEmployees = employees.map((emp) => {
      const t = totalsMap.get(String(emp._id));
      return {
        ...emp,
        advancePayment: t?.advancePayment ?? 0,
        paidPayment:    t?.paidPayment    ?? 0,
      };
    });

    const totalAdvance = overallTotalsAgg[0]?.totalAdvance ?? 0;
    const totalPaid    = overallTotalsAgg[0]?.totalPaid    ?? 0;

    return NextResponse.json({
      success: true,
      employees: syncedEmployees,
      total,
      page,
      limit,
      totalAdvance,
      totalPaid,
    });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: "Unknown error occurred" }, { status: 500 });
  }
};

// ---------------- CREATE EMPLOYEE ----------------
const createEmployee = async (req: NextRequest) => {
  try {
    const { userId, error } = await getSessionUser();
    if (error) return error;

    await connectToDatabase();
    const body = await req.json();

    const employee = await Employee.create({ ...body, userId });

    return NextResponse.json({ success: true, employee });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, message: "Unknown error occurred" }, { status: 500 });
  }
};

export { getEmployees as GET, createEmployee as POST };
