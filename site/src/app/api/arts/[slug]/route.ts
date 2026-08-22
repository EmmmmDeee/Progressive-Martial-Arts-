import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const art = await db.artDiscipline.findUnique({
      where: { slug },
      include: {
        classes: { orderBy: { day: "asc" } },
        faqs: { orderBy: { order: "asc" } },
        media: { take: 6 },
      },
    });
    if (!art) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data: art });
  } catch (e) {
    console.error("art by slug error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
