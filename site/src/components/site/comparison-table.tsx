"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X, Minus, ArrowRight, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/site/section-heading";
import { RouteLink } from "@/lib/router";
import type { ArtDisciplineT } from "@/lib/data";
import { cn } from "@/lib/utils";

const comparisonRows = [
  { label: "Focus", key: "focus", type: "text" },
  { label: "Origin", key: "origin", type: "text" },
  { label: "Difficulty", key: "difficulty", type: "badge" },
  { label: "Min. age", key: "minAge", type: "number" },
  { label: "Striking", key: "striking", type: "bool" },
  { label: "Grappling/Ground", key: "ground", type: "bool" },
  { label: "Weaponry", key: "weaponry", type: "bool" },
  { label: "Cardio intensity", key: "cardio", type: "rating" },
  { label: "Technical depth", key: "technical", type: "rating" },
] as const;

// Per-discipline capability data (static, curated)
const disciplineCapabilities: Record<string, {
  striking: boolean;
  ground: boolean;
  weaponry: boolean;
  cardio: number; // 1-3
  technical: number; // 1-3
}> = {
  "muay-thai": { striking: true, ground: false, weaponry: false, cardio: 3, technical: 2 },
  "brazilian-jiu-jitsu": { striking: false, ground: true, weaponry: false, cardio: 2, technical: 3 },
  "kali": { striking: true, ground: false, weaponry: true, cardio: 2, technical: 3 },
  "jeet-kune-do": { striking: true, ground: false, weaponry: false, cardio: 2, technical: 3 },
  "maphilindo-silat": { striking: true, ground: false, weaponry: true, cardio: 2, technical: 3 },
  "jun-fan-gung-fu": { striking: true, ground: false, weaponry: false, cardio: 2, technical: 3 },
};

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 border border-accent/30">
      <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary/40 border border-border/40">
      <Minus className="h-3 w-3 text-foreground/30" />
    </span>
  );
}

function RatingDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1 justify-center">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            n <= value ? "bg-primary" : "bg-secondary/50 border border-border/40"
          )}
        />
      ))}
    </div>
  );
}

export function ComparisonTable() {
  const [arts, setArts] = useState<ArtDisciplineT[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlighted, setHighlighted] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/arts")
      .then((r) => r.json())
      .then((res) => setArts(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="compare" className="relative py-20 lg:py-28 bg-secondary/20">
      <div className="absolute inset-0 -z-10 bg-grain opacity-30" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Side By Side"
          title={<>Compare the <span className="text-gradient-crimson">six disciplines</span></>}
          description="Not sure which art fits? See every discipline compared — focus, difficulty, intensity and what you'll actually train. Hover a column to highlight it."
        />

        {loading ? (
          <div className="mt-10">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        ) : arts.length === 0 ? null : (
          <>
            {/* Desktop table */}
            <div className="mt-10 hidden lg:block overflow-x-auto rounded-2xl border border-border/60 bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="p-4 text-left text-xs uppercase tracking-wider text-foreground/50 font-semibold w-40">
                      Discipline
                    </th>
                    {arts.map((art) => (
                      <th
                        key={art.id}
                        className={cn(
                          "p-4 text-center align-bottom transition-colors cursor-pointer",
                          highlighted === art.slug ? "bg-primary/10" : "hover:bg-secondary/40"
                        )}
                        onMouseEnter={() => setHighlighted(art.slug)}
                        onMouseLeave={() => setHighlighted(null)}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden ring-1 ring-border/60">
                            <Image src={art.image} alt={art.name} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="font-display font-bold text-sm uppercase leading-tight">{art.name}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, ri) => (
                    <tr
                      key={row.key}
                      className={cn("border-b border-border/40 last:border-b-0", ri % 2 === 1 && "bg-secondary/20")}
                    >
                      <td className="p-4 text-sm font-medium text-foreground/70 text-left">
                        {row.label}
                      </td>
                      {arts.map((art) => {
                        const caps = disciplineCapabilities[art.slug];
                        const value = (art as Record<string, unknown>)[row.key];
                        return (
                          <td
                            key={art.id}
                            className={cn(
                              "p-4 text-center text-sm transition-colors",
                              highlighted === art.slug ? "bg-primary/5" : ""
                            )}
                            onMouseEnter={() => setHighlighted(art.slug)}
                            onMouseLeave={() => setHighlighted(null)}
                          >
                            {row.type === "text" && <span className="text-foreground/80">{String(value)}</span>}
                            {row.type === "badge" && (
                              <Badge variant="outline" className="text-[10px]">{String(value)}</Badge>
                            )}
                            {row.type === "number" && <span className="font-display font-bold">{String(value)}+</span>}
                            {row.type === "bool" && caps && (
                              <BoolCell value={(caps as Record<string, boolean>)[row.key]} />
                            )}
                            {row.type === "rating" && caps && (
                              <RatingDots value={(caps as Record<string, number>)[row.key]} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* CTA row */}
                  <tr>
                    <td className="p-4"></td>
                    {arts.map((art) => (
                      <td key={art.id} className="p-4 text-center">
                        <RouteLink to={{ name: "program", slug: art.slug }}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary/30 text-primary hover:bg-primary/10 group"
                          >
                            Explore <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </Button>
                        </RouteLink>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile cards (one per discipline, stacked) */}
            <div className="mt-10 lg:hidden space-y-4">
              {arts.map((art) => {
                const caps = disciplineCapabilities[art.slug];
                return (
                  <div key={art.id} className="rounded-xl border border-border/60 bg-card overflow-hidden">
                    <div className="flex items-center gap-3 p-4 bg-secondary/30">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden ring-1 ring-border/60 shrink-0">
                        <Image src={art.image} alt={art.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div>
                        <div className="font-display font-bold uppercase text-sm">{art.name}</div>
                        <div className="text-xs text-foreground/50">{art.focus} · {art.origin}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 text-sm">
                      <div className="text-foreground/50">Striking</div>
                      <div className="text-right"><BoolCell value={caps?.striking ?? false} /></div>
                      <div className="text-foreground/50">Grappling</div>
                      <div className="text-right"><BoolCell value={caps?.ground ?? false} /></div>
                      <div className="text-foreground/50">Weaponry</div>
                      <div className="text-right"><BoolCell value={caps?.weaponry ?? false} /></div>
                      <div className="text-foreground/50">Cardio</div>
                      <div className="text-right"><RatingDots value={caps?.cardio ?? 0} /></div>
                      <div className="text-foreground/50">Technical</div>
                      <div className="text-right"><RatingDots value={caps?.technical ?? 0} /></div>
                    </div>
                    <div className="p-4 pt-0">
                      <RouteLink to={{ name: "program", slug: art.slug }}>
                        <Button variant="outline" size="sm" className="w-full border-primary/30 text-primary hover:bg-primary/10 group">
                          Explore {art.name} <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </RouteLink>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground/55">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Intensity/depth (1–3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 border border-accent/30">
              <Check className="h-3 w-3 text-accent" strokeWidth={3} />
            </span>
            <span>Yes — trained in this art</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary/40 border border-border/40">
              <Minus className="h-2.5 w-2.5 text-foreground/30" />
            </span>
            <span>Not a focus of this art</span>
          </div>
        </div>
      </div>
    </section>
  );
}
