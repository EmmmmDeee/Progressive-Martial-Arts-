import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const seminars = await db.seminar.findMany({ orderBy: { date: "asc" } });
    return NextResponse.json({
      ok: true,
      data: seminars.map((s) => ({
        ...s,
        date: s.date.toISOString(),
        endDate: s.endDate ? s.endDate.toISOString() : null,
      })),
    });
  } catch (e) {
    console.error("seminars GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
