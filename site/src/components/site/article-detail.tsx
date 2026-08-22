"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Calendar, ArrowLeft, ArrowRight, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { RouteLink, useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Related = { id: string; title: string; slug: string; excerpt: string; image: string; category: string; readMinutes: number; publishedAt: string };

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string | null;
  image: string;
  authorName: string;
  readMinutes: number;
  publishedAt: string;
  related: Related[];
};

const categoryColor: Record<string, string> = {
  training: "bg-primary/15 text-primary border-primary/30",
  lineage: "bg-accent/15 text-accent border-accent/30",
  kids: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  community: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  events: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  general: "bg-secondary/60 text-foreground/70 border-border",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

// Minimal markdown renderer (headings, paragraphs, lists, links, bold)
function renderMarkdown(md: string): string {
  // escape HTML
  let html = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="font-display text-xl font-bold uppercase mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="font-display text-2xl font-bold uppercase mt-8 mb-4">$1</h2>');
  // bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>');
  // links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-accent underline underline-offset-2">$1</a>');
  // unordered list
  html = html.replace(/(?:^|\n)((?:- .+(?:\n|$))+)/g, (match, list: string) => {
    const items = list.trim().split("\n").map((l) => l.replace(/^- /, "").trim());
    return '<ul class="my-4 space-y-1.5">' + items.map((i) => `<li class="flex gap-2 text-foreground/80"><span class="text-accent mt-1">▸</span><span>${i}</span></li>`).join("") + "</ul>";
  });
  // ordered list
  html = html.replace(/(?:^|\n)((?:\d+\. .+(?:\n|$))+)/g, (match, list: string) => {
    const items = list.trim().split("\n").map((l) => l.replace(/^\d+\. /, "").trim());
    return '<ol class="my-4 space-y-1.5 list-none">' + items.map((i, idx) => `<li class="flex gap-3 text-foreground/80"><span class="text-primary font-bold">${idx + 1}.</span><span>${i}</span></li>`).join("") + "</ol>";
  });
  // paragraphs (lines not part of other elements)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^<(h2|h3|ul|ol)/.test(trimmed)) return trimmed;
      return `<p class="my-4 text-foreground/80 leading-relaxed">${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
  return html;
}

export function ArticleDetail({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string>("");
  const loading = loadedSlug !== slug;

  useEffect(() => {
    if (loadedSlug === slug) return;
    fetch(`/api/blog/${slug}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setArticle(res.data);
        else setArticle(null);
      })
      .catch(() => setArticle(null))
      .finally(() => {
        setLoadedSlug(slug);
      });
  }, [slug, loadedSlug]);

  if (loading) {
    return (
      <div className="pt-16 lg:pt-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-48 w-full mb-6 rounded-xl" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-16 lg:pt-20 min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-md text-center px-4">
          <h1 className="font-display text-3xl font-bold uppercase mb-2">Article not found</h1>
          <p className="text-foreground/60 mb-6">This article may have been moved or removed.</p>
          <RouteLink to={{ name: "blog" }}>
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to blog
            </Button>
          </RouteLink>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src={article.image} alt="" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Blog", href: "#/blog" }, { label: article.title }]} className="mb-6" />
          <Badge variant="outline" className={cn("capitalize mb-4", categoryColor[article.category] || categoryColor.general)}>{article.category}</Badge>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-[1.05]">{article.title}</h1>
          <p className="mt-4 text-lg text-foreground/70 leading-relaxed">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-foreground/55">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-accent" /> {article.authorName}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-accent" /> {formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> {article.readMinutes} min read</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
          />

          {/* Tags */}
          {article.tags && (
            <div className="mt-10 pt-6 border-t border-border/60 flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-foreground/40" />
              {article.tags.split("|").map((t) => (
                <Badge key={t} variant="outline" className="text-xs text-foreground/60 border-border">{t}</Badge>
              ))}
            </div>
          )}

          {/* Share / CTA */}
          <div className="mt-8 rounded-xl bg-gradient-to-br from-primary/10 via-card to-card border border-border/60 p-6 text-center">
            <h3 className="font-display text-xl font-bold uppercase mb-2">Ready to start training?</h3>
            <p className="text-sm text-foreground/70 mb-4">Your first class at PMAAI is free. No commitment, no gear needed.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90 group">
                <a href="#contact">Book a free trial <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
              </Button>
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Article link copied to clipboard");
                }}
              >
                Share this article
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {article.related && article.related.length > 0 && (
        <section className="py-12 lg:py-16 bg-secondary/20 border-t border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold uppercase mb-6">More from PMAAI</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {article.related.map((r) => (
                <RouteLink
                  key={r.id}
                  to={{ name: "article", slug: r.slug }}
                  className="group block rounded-xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 transition-all"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={r.image} alt={r.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <Badge variant="outline" className={cn("capitalize mb-2 text-[10px]", categoryColor[r.category] || categoryColor.general)}>{r.category}</Badge>
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h3>
                    <div className="mt-2 text-xs text-foreground/50 flex items-center gap-1"><Clock className="h-3 w-3" />{r.readMinutes} min</div>
                  </div>
                </RouteLink>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
