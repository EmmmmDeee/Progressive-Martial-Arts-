import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.order.findUnique({ where: { id } });
    if (!order)
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ok: true,
      data: { ...order, createdAt: order.createdAt.toISOString() },
    });
  } catch (e) {
    console.error("order by id error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
