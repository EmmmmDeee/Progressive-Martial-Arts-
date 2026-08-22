import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const DAY_ORDER: Record<string, number> = {
  Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7,
};

// Returns all weekly classes, sorted by day (Mon→Sat) then start time.
// Each item includes the denormalised `artName` field for client display.
export async function GET() {
  try {
    const classes = await db.classSchedule.findMany();
    classes.sort((a, b) => {
      const d = (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99);
      if (d !== 0) return d;
      return a.startTime.localeCompare(b.startTime);
    });
    return NextResponse.json({ ok: true, data: classes });
  } catch (e) {
    console.error("classes GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
