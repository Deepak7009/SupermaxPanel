"use server";

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Employee from "../../admin/models/Employee";
import WorkEntry from "../../admin/models/WorkEntry";

/* ======================================================
   AUTO WORK OFF (CRON)
====================================================== */
const autoWorkOff = async () => {
  try {
    await connectToDatabase();

    const employees = await Employee.find().select("_id userId").lean();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingEntries = await WorkEntry.find({
      date: today,
      employee: { $in: employees.map((e) => e._id) },
    }).select("employee").lean();

    const existingSet = new Set(existingEntries.map((e) => String(e.employee)));

    const toCreate = employees
      .filter((emp) => !existingSet.has(String(emp._id)))
      .map((emp) => ({
        userId: emp.userId,
        employee: emp._id,
        date: today,
        status: "WORK_OFF" as const,
      }));

    if (toCreate.length > 0) {
      await WorkEntry.insertMany(toCreate, { ordered: false });
    }

    return NextResponse.json({ success: true, count: toCreate.length });
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

export { autoWorkOff as POST };
