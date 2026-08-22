import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const seminar = await db.seminar.findUnique({
      where: { id },
      include: { art: true, instructor: true },
    });
    if (!seminar)
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ok: true,
      data: {
        ...seminar,
        date: seminar.date.toISOString(),
        endDate: seminar.endDate ? seminar.endDate.toISOString() : null,
      },
    });
  } catch (e) {
    console.error("seminar by id error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
