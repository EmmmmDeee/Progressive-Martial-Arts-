import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || "0");
    const category = url.searchParams.get("category");
    const featured = url.searchParams.get("featured");

    const articles = await db.blogArticle.findMany({
      where: {
        published: true,
        ...(category ? { category } : {}),
        ...(featured === "true" ? { featured: true } : {}),
      },
      orderBy: { publishedAt: "desc" },
      ...(limit ? { take: limit } : {}),
    });
    return NextResponse.json({
      ok: true,
      data: articles.map((a) => ({
        ...a,
        publishedAt: a.publishedAt.toISOString(),
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch (e) {
    console.error("blog GET error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
