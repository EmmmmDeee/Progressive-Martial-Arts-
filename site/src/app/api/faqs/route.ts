import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const artId = url.searchParams.get("artId") || undefined;
    const category = url.searchParams.get("category") || undefined;
    const faqs = await db.faq.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(artId
          ? { OR: [{ artId }, { artId: null, category: "general" }] }
          : { artId: null }),
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ ok: true, data: faqs });
  } catch (e) {
    console.error("faqs GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
