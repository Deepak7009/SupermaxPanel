"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose, { FilterQuery } from "mongoose";
import FactoryExpense, { IFactoryExpense } from "../../models/FactoryExpense";

/* ======================================================
   GET ALL / SINGLE FACTORY EXPENSE
====================================================== */
const getFactoryExpenses = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = req.nextUrl;
    const id = url.searchParams.get("id");
    const search = url.searchParams.get("search") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "5");

    /* ======================================================
       ✅ GET SINGLE EXPENSE
    ====================================================== */
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      const expense = await FactoryExpense.findById(id).lean();

      if (!expense) {
        return NextResponse.json(
          { success: false, message: "Expense not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        expense,
      });
    }

    // ❌ INVALID ID
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid expense id" },
        { status: 400 },
      );
    }

    /* ======================================================
       ✅ GET ALL EXPENSES (WITH SEARCH + PAGINATION)
    ====================================================== */

    const query: FilterQuery<IFactoryExpense> = {};

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { entryPerson: regex },
        { shopName: regex },
        { status: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      FactoryExpense.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FactoryExpense.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      expenses,
      total,
      page,
      limit,
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

/* ======================================================
   CREATE FACTORY EXPENSE
====================================================== */
const createFactoryExpense = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const body = await req.json();

    const expense = await FactoryExpense.create(body);

    return NextResponse.json({
      success: true,
      expense,
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

export { getFactoryExpenses as GET, createFactoryExpense as POST };
