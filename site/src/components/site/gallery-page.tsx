"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Images, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

type Media = {
  id: string;
  title: string;
  url: string;
  thumbnail?: string | null;
  type: string;
  category: string;
  caption?: string | null;
  year?: number | null;
  artId?: string | null;
};

const categories = [
  { value: "all", label: "All", icon: Images },
  { value: "training", label: "Training", icon: Filter },
  { value: "instructor", label: "Instructors", icon: Filter },
  { value: "event", label: "Events", icon: Filter },
  { value: "kids", label: "Kids", icon: Filter },
  { value: "academy", label: "Academy", icon: Filter },
  { value: "historical", label: "Historical", icon: Filter },
];

const categoryColor: Record<string, string> = {
  training: "bg-primary/15 text-primary border-primary/30",
  instructor: "bg-accent/15 text-accent border-accent/30",
  event: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  kids: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  academy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  historical: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export function GalleryPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((res) => setMedia(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "all" ? media : media.filter((m) => m.category === activeCategory);

  const openLightbox = useCallback((idx: number) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const nextImage = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length]
  );
  const prevImage = useCallback(
    () => setLightbox((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );

  // keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox, nextImage, prevImage]);

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      {/* Header */}
      <section className="relative py-12 lg:py-16 overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 bg-stripes opacity-30" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Gallery" }]} className="mb-4" />
          <SectionHeading
            eyebrow="Media & Galleries"
            title={<>Life at <span className="text-gradient-crimson">PMAAI</span></>}
            description="Training, events, instructors and our academy through the years. Every image tells a story of the PMAAI community."
          />
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((c) => {
              const count = c.value === "all" ? media.length : media.filter((m) => m.category === c.value).length;
              const isActive = activeCategory === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setActiveCategory(c.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-card border-border text-foreground/70 hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {c.label}
                  <span className={cn("text-[10px] font-bold", isActive ? "text-primary-foreground/70" : "text-foreground/40")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Masonry grid */}
          {loading ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className={cn("rounded-xl", i % 3 === 0 ? "h-64" : i % 3 === 1 ? "h-48" : "h-80")} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
              <Images className="h-10 w-10 mx-auto mb-3 opacity-50" />
              No images in this category yet.
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
              {filtered.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => openLightbox(idx)}
                  className="group relative w-full block overflow-hidden rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-all break-inside-avoid"
                >
                  <div className="relative">
                    <Image
                      src={m.url}
                      alt={m.title}
                      width={400}
                      height={Math.round(400 * (idx % 3 === 0 ? 1.4 : idx % 3 === 1 ? 1 : 1.6))}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* category badge */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className={cn("border backdrop-blur-sm capitalize", categoryColor[m.category] || "bg-secondary/20 text-foreground border-border")}>
                        {m.category}
                      </Badge>
                    </div>
                    {/* caption */}
                    <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-sm font-semibold text-foreground leading-tight line-clamp-2">{m.title}</div>
                      {m.caption && (
                        <div className="text-xs text-foreground/60 mt-0.5 line-clamp-1">{m.caption}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-4 right-4 h-11 w-11 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous image"
            className="absolute left-4 h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next image"
            className="absolute right-4 h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-h-[75vh]">
              <Image
                src={filtered[lightbox].url}
                alt={filtered[lightbox].title}
                width={1200}
                height={800}
                className="max-h-[75vh] w-auto h-auto object-contain rounded-lg"
              />
            </div>
            <div className="mt-4 text-center max-w-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="outline" className={cn("capitalize", categoryColor[filtered[lightbox].category] || "")}>
                  {filtered[lightbox].category}
                </Badge>
                {filtered[lightbox].year && (
                  <span className="text-xs text-foreground/50">{filtered[lightbox].year}</span>
                )}
              </div>
              <h3 className="font-display text-xl font-bold uppercase">{filtered[lightbox].title}</h3>
              {filtered[lightbox].caption && (
                <p className="mt-2 text-sm text-foreground/60">{filtered[lightbox].caption}</p>
              )}
              <div className="mt-3 text-xs text-foreground/40">
                {lightbox + 1} of {filtered.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
