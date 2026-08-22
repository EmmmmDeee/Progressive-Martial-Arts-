import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const category = url.searchParams.get("category");

    const products = await db.product.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });
    return NextResponse.json({ ok: true, data: products });
  } catch (e) {
    console.error("products GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
