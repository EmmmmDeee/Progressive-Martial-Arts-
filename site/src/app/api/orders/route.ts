import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("Australia"),
  items: z.string(),
  subtotal: z.number().min(0),
  shipping: z.number().min(0),
  total: z.number().min(0),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const order = await db.order.create({
      data: {
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        address: data.address || null,
        city: data.city || null,
        postcode: data.postcode || null,
        state: data.state || null,
        country: data.country,
        items: data.items,
        subtotal: data.subtotal,
        shipping: data.shipping,
        total: data.total,
        notes: data.notes || null,
        status: "pending",
      },
    });
    return NextResponse.json({ ok: true, data: order });
  } catch (e) {
    console.error("orders POST error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    return NextResponse.json({
      ok: true,
      data: orders.map((o) => ({ ...o, createdAt: o.createdAt.toISOString() })),
    });
  } catch (e) {
    console.error("orders GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
