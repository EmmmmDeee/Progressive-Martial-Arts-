import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().optional(),
  source: z.string().default("footer"),
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
    // upsert to avoid duplicate email errors
    await db.newsletterSub.upsert({
      where: { email: data.email },
      update: { name: data.name || null, source: data.source },
      create: {
        email: data.email,
        name: data.name || null,
        source: data.source,
      },
    });
    return NextResponse.json({ ok: true, message: "Subscribed" });
  } catch (e) {
    console.error("newsletter POST error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subs = await db.newsletterSub.count();
    return NextResponse.json({ ok: true, count: subs });
  } catch (e) {
    console.error("newsletter GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
