"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose, { FilterQuery } from "mongoose";
import FactoryExpense, { IFactoryExpense } from "../../models/FactoryExpense";

const getFactoryExpenses = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    const url = req.nextUrl;
    const search = url.searchParams.get("search") || "";
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "5");
    const status = url.searchParams.get("status") as
      | "pending"
      | "approved"
      | "rejected"
      | undefined;
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");

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

    if (status) query.status = status;

    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
      query.entryDate = { $gte: start, $lte: end };
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

    return NextResponse.json({ success: true, expenses, total, page, limit });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};

const createFactoryExpense = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const body = await req.json();
    const expense = await FactoryExpense.create(body);
    return NextResponse.json({ success: true, expense });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};

export { getFactoryExpenses as GET, createFactoryExpense as POST };
