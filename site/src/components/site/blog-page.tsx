"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Newspaper, Clock, ArrowRight, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { RouteLink } from "@/lib/router";
import { cn } from "@/lib/utils";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags?: string | null;
  image: string;
  authorName: string;
  readMinutes: number;
  publishedAt: string;
  featured?: boolean;
};

const categories = [
  { value: "all", label: "All" },
  { value: "training", label: "Training" },
  { value: "lineage", label: "Lineage" },
  { value: "kids", label: "Kids" },
  { value: "community", label: "Community" },
  { value: "events", label: "Events" },
];

const categoryColor: Record<string, string> = {
  training: "bg-primary/15 text-primary border-primary/30",
  lineage: "bg-accent/15 text-accent border-accent/30",
  kids: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  community: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  events: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  general: "bg-secondary/60 text-foreground/70 border-border",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

export function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((res) => setArticles(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles
    .filter((a) => activeCat === "all" || a.category === activeCat)
    .filter((a) =>
      search.trim()
        ? (a.title + " " + a.excerpt + " " + (a.tags || "")).toLowerCase().includes(search.toLowerCase())
        : true
    );

  const featured = filtered.find((a) => a.featured) || filtered[0];
  const rest = filtered.filter((a) => a.id !== featured?.id);

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      {/* Header */}
      <section className="relative py-12 lg:py-16 overflow-hidden border-b border-border/60 bg-secondary/20">
        <div className="absolute inset-0 -z-10 bg-stripes opacity-30" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Blog & News" }]} className="mb-4" />
          <SectionHeading
            eyebrow="PMAAI Journal"
            title={<>Insights from the <span className="text-gradient-crimson">mat</span></>}
            description="Training tips, lineage stories, kids advice and academy news from the PMAAI coaching team."
          />
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10">
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setActiveCat(c.value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all border",
                    activeCat === c.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground/70 hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="relative lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full rounded-lg bg-card border border-border pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
              <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-50" />
              No articles found. Try a different search or category.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured article */}
              {featured && (
                <RouteLink
                  to={{ name: "article", slug: featured.slug }}
                  className="group block relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all"
                >
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                      <Image src={featured.image} alt={featured.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60 lg:to-card" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-accent-foreground shadow-lg">Featured</Badge>
                      </div>
                    </div>
                    <div className="p-6 lg:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className={cn("capitalize", categoryColor[featured.category] || categoryColor.general)}>{featured.category}</Badge>
                        <span className="text-xs text-foreground/50 flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(featured.publishedAt)}</span>
                        <span className="text-xs text-foreground/50 flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readMinutes} min</span>
                      </div>
                      <h2 className="font-display text-2xl lg:text-3xl font-bold uppercase leading-tight group-hover:text-primary transition-colors">
                        {featured.title}
                      </h2>
                      <p className="mt-3 text-foreground/70 leading-relaxed line-clamp-3">{featured.excerpt}</p>
                      <div className="mt-5 flex items-center gap-2 text-sm">
                        <span className="text-foreground/60">By {featured.authorName}</span>
                        <span className="ml-auto inline-flex items-center gap-1 text-primary font-semibold group-hover:text-accent transition-colors">
                          Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </RouteLink>
              )}

              {/* Article grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((a) => (
                  <RouteLink
                    key={a.id}
                    to={{ name: "article", slug: a.slug }}
                    className="group flex flex-col rounded-xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all hover:-translate-y-1"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image src={a.image} alt={a.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className={cn("capitalize backdrop-blur-sm", categoryColor[a.category] || categoryColor.general)}>{a.category}</Badge>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-foreground/50 mb-2">
                        <Calendar className="h-3 w-3" />
                        {formatDate(a.publishedAt)}
                        <span className="mx-1">·</span>
                        <Clock className="h-3 w-3" />
                        {a.readMinutes} min
                      </div>
                      <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">{a.title}</h3>
                      <p className="text-sm text-foreground/60 leading-relaxed line-clamp-3 flex-1">{a.excerpt}</p>
                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-foreground/55">By {a.authorName}</span>
                        <span className="inline-flex items-center gap-1 text-primary font-semibold group-hover:text-accent transition-colors">
                          Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </RouteLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
