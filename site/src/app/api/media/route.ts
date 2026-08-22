import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || undefined;
    const artId = url.searchParams.get("artId") || undefined;
    const media = await db.media.findMany({
      where: { ...(category ? { category } : {}), ...(artId ? { artId } : {}) },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: media });
  } catch (e) {
    console.error("media GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
