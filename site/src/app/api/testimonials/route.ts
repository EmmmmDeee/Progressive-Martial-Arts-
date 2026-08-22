import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ ok: true, data: testimonials });
  } catch (e) {
    console.error("testimonials GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
