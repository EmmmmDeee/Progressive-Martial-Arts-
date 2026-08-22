import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await db.product.findUnique({ where: { slug } });
    if (!product)
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, data: product });
  } catch (e) {
    console.error("product by slug error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
