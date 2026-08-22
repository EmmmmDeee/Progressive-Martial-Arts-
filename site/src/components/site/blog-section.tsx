"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, ArrowRight, Newspaper, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/site/section-heading";
import { RouteLink } from "@/lib/router";
import { cn } from "@/lib/utils";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  authorName: string;
  readMinutes: number;
  publishedAt: string;
  featured?: boolean;
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
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

export function BlogSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog?limit=4")
      .then((r) => r.json())
      .then((res) => setArticles(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = articles.find((a) => a.featured) || articles[0];
  const rest = articles.filter((a) => a.id !== featured?.id).slice(0, 3);

  return (
    <section id="blog" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="PMAAI Journal"
            title={<>From the <span className="text-gradient-crimson">mat</span></>}
            description="Training tips, lineage stories and academy news from our coaching team."
          />
          <RouteLink to={{ name: "blog" }}>
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 group self-start lg:self-end">
              All articles <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </RouteLink>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-2xl" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
          </div>
        ) : articles.length === 0 ? null : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Featured */}
            {featured && (
              <RouteLink
                to={{ name: "article", slug: featured.slug }}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={featured.image} alt={featured.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-accent text-accent-foreground shadow-lg uppercase tracking-wide text-[10px]">Featured</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2 text-xs text-foreground/50">
                    <Badge variant="outline" className={cn("capitalize", categoryColor[featured.category] || categoryColor.general)}>{featured.category}</Badge>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(featured.publishedAt)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{featured.readMinutes} min</span>
                  </div>
                  <h3 className="font-display text-xl lg:text-2xl font-bold uppercase leading-tight group-hover:text-primary transition-colors">{featured.title}</h3>
                  <p className="mt-2 text-sm text-foreground/65 leading-relaxed line-clamp-2">{featured.excerpt}</p>
                  <div className="mt-3 text-xs text-foreground/50">By {featured.authorName}</div>
                </div>
              </RouteLink>
            )}

            {/* Rest list */}
            <div className="flex flex-col gap-4">
              {rest.map((a) => (
                <RouteLink
                  key={a.id}
                  to={{ name: "article", slug: a.slug }}
                  className="group flex gap-4 rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-lg">
                    <Image src={a.image} alt={a.title} fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 text-xs text-foreground/50">
                      <Badge variant="outline" className={cn("capitalize text-[9px] px-1.5 py-0", categoryColor[a.category] || categoryColor.general)}>{a.category}</Badge>
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{a.readMinutes}m</span>
                    </div>
                    <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{a.title}</h4>
                    <p className="text-xs text-foreground/55 mt-1 line-clamp-1">{a.excerpt}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all self-center shrink-0" />
                </RouteLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
