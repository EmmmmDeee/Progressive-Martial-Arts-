import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const instructor = await db.instructor.findUnique({
      where: { id },
      include: {
        classes: { orderBy: { day: "asc" } },
        events: { orderBy: { date: "asc" } },
      },
    });
    if (!instructor)
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data: instructor });
  } catch (e) {
    console.error("instructor by id error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
