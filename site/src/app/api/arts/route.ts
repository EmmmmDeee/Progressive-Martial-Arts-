import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const arts = await db.artDiscipline.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ ok: true, data: arts });
  } catch (e) {
    console.error("arts GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
