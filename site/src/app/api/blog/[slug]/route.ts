import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await db.blogArticle.findUnique({ where: { slug } });
    if (!article || !article.published) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    // fetch related articles (same category, excluding current)
    const related = await db.blogArticle.findMany({
      where: { category: article.category, slug: { not: slug }, published: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({
      ok: true,
      data: {
        ...article,
        publishedAt: article.publishedAt.toISOString(),
        createdAt: article.createdAt.toISOString(),
        related: related.map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          excerpt: r.excerpt,
          image: r.image,
          category: r.category,
          readMinutes: r.readMinutes,
          publishedAt: r.publishedAt.toISOString(),
        })),
      },
    });
  } catch (e) {
    console.error("blog by slug error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
