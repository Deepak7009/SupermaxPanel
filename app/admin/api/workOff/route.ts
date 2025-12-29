"use server";

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Employee from "../../models/Employee";
import WorkEntry from "../../models/WorkEntry";

/* ======================================================
   AUTO WORK OFF (CRON)
====================================================== */
const autoWorkOff = async () => {
  try {
    await connectToDatabase();

    const employees = await Employee.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const emp of employees) {
      const exists = await WorkEntry.findOne({
        employee: emp._id,
        date: today,
      });

      if (!exists) {
        await WorkEntry.create({
          employee: emp._id,
          date: today,
          status: "WORK_OFF",
        });
      }
    }

    return NextResponse.json({ success: true });
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
