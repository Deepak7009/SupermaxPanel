"use server";

import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Returns the current session user's id and role.
 * Returns a 401 NextResponse if not authenticated.
 */
export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      userId: null as null,
      role: null as null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return {
    userId: session.user.id,
    role: (session.user.role ?? "user") as string,
    error: null,
  };
}
