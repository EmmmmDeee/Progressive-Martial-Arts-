import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Phone is required"),
  art: z.string().min(2, "Please choose an art"),
  experience: z.string().default("none"),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
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
    await db.trialEnrollment.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        art: data.art,
        experience: data.experience,
        preferredDate: data.preferredDate || null,
        message: data.message || null,
      },
    });
    return NextResponse.json({ ok: true, message: "Trial class booked" });
  } catch (e) {
    console.error("enroll POST error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const enrollments = await db.trialEnrollment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ ok: true, data: enrollments });
  } catch (e) {
    console.error("enroll GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
