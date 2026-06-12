"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import FactoryExpense from "@/app/admin/models/FactoryExpense";

/* ================= UPDATE FACTORY EXPENSE ================= */

interface Params {
  id: string;
}

const updateFactoryExpense = async (
  req: NextRequest,
  context: { params: Promise<Params> },
) => {
  try {
    await connectToDatabase();

    // ✅ IMPORTANT (new Next.js pattern)
    const { id } = await context.params;

    const body = await req.json();

    const {
      name,
      amount,
      entryDate,
      entryPerson,
      quantity,
      shopName,
      status,
    }: {
      name: string;
      amount: number;
      entryDate: string;
      entryPerson: string;
      quantity: number;
      shopName: string;
      status: "pending" | "paid";
    } = body;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // ✅ Update document
    const updatedExpense = await FactoryExpense.findByIdAndUpdate(
      id,
      {
        name,
        amount,
        entryDate,
        entryPerson,
        quantity,
        shopName,
        status,
      },
      { new: true },
    );

    if (!updatedExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(updatedExpense);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 },
    );
  }
};

export { updateFactoryExpense as PUT };
