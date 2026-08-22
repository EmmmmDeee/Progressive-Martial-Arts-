import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const instructors = await db.instructor.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ ok: true, data: instructors });
  } catch (e) {
    console.error("instructors GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
