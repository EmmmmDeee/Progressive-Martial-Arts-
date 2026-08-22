"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "@/lib/router";
import { RouteLink } from "@/lib/router";
import { Calendar, Users, MapPin, ArrowRight } from "lucide-react";
import type { SeminarT } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}
function formatDayMonth(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-AU", { day: "2-digit" }),
    month: d.toLocaleDateString("en-AU", { month: "short" }).toUpperCase(),
  };
}

export function Seminars() {
  const [seminars, setSeminars] = useState<SeminarT[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();

  useEffect(() => {
    fetch("/api/seminars")
      .then((r) => r.json())
      .then((res) => setSeminars(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = seminars.find((s) => s.featured) || seminars[0];

  return (
    <section id="seminars" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Seminars &amp; Events
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
            Train with <span className="text-gradient-crimson">the masters</span>
          </h2>
          <p className="mt-4 text-foreground/70">
            Annual seminars bring legendary instructors from the Inosanto Academy
            and beyond to Brisbane.
          </p>
        </div>

        {loading ? (
          <div className="space-y-8">
            <Skeleton className="h-80 rounded-2xl" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          </div>
        ) : seminars.length === 0 ? null : (
          <div className="space-y-8">
            {featured && (
              <article
                onClick={() => navigate({ name: "event", slug: featured.id })}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") navigate({ name: "event", slug: featured.id }); }}
                className="group block relative overflow-hidden rounded-2xl bg-card border border-border/60 lg:flex hover:border-primary/40 transition-all cursor-pointer"
              >
                <div className="relative lg:w-1/2 aspect-[16/10] lg:aspect-auto overflow-hidden">
                  <Image src={featured.image} alt={featured.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/60 lg:to-card" />
                  <div className="absolute top-4 left-4 flex flex-col items-center justify-center rounded-lg bg-background/90 backdrop-blur-sm border border-accent/30 px-4 py-2 shadow-lg">
                    <span className="font-display text-3xl font-bold leading-none text-gradient-crimson">{formatDayMonth(featured.date).day}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mt-0.5">{formatDayMonth(featured.date).month}</span>
                  </div>
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center lg:w-1/2">
                  <Badge className="self-start bg-accent/15 text-accent border border-accent/30 mb-3 uppercase tracking-wide">Featured Seminar</Badge>
                  <h3 className="font-display text-2xl lg:text-3xl font-bold uppercase leading-tight">{featured.title}</h3>
                  <div className="mt-2 text-sm text-accent font-semibold uppercase tracking-wider">with {featured.guest}</div>
                  <p className="mt-4 text-foreground/70 leading-relaxed line-clamp-3">{featured.description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-foreground/70"><Calendar className="h-4 w-4 text-accent" />{formatDate(featured.date)}</div>
                    <div className="flex items-center gap-2 text-foreground/70"><Users className="h-4 w-4 text-accent" />{featured.spotsLeft} spots left</div>
                    <div className="flex items-center gap-2 text-foreground/70"><MapPin className="h-4 w-4 text-accent" />{featured.location}</div>
                    <div className="flex items-center gap-2 text-foreground/70"><span className="h-4 w-4 flex items-center justify-center text-accent font-bold">$</span>{featured.price > 0 ? `$${featured.price.toFixed(0)}` : "Free for members"}</div>
                  </div>
                  <div className="mt-6">
                    <Button asChild className="bg-primary hover:bg-primary/90 group/btn">
                      <a href="#contact">Reserve a spot <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" /></a>
                    </Button>
                  </div>
                </div>
              </article>
            )}

            {seminars.length > 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {seminars.filter((s) => !s.featured).map((s) => {
                  const dm = formatDayMonth(s.date);
                  return (
                    <RouteLink key={s.id} to={{ name: "event", slug: s.id }} className="group block rounded-xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 transition-all">
                      <div className="relative aspect-video overflow-hidden">
                        <Image src={s.image} alt={s.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                        <div className="absolute top-2 left-2 flex flex-col items-center rounded-md bg-background/85 backdrop-blur border border-accent/30 px-2.5 py-1">
                          <span className="font-display text-base font-bold leading-none text-gradient-crimson">{dm.day}</span>
                          <span className="text-[9px] uppercase tracking-wider text-accent">{dm.month}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">{s.title}</h4>
                        <div className="mt-1 text-xs text-accent font-medium">{s.guest}</div>
                        <div className="mt-2 flex items-center justify-between text-xs text-foreground/55">
                          <span>{formatDate(s.date)}</span>
                          <span>{s.spotsLeft} spots</span>
                        </div>
                      </div>
                    </RouteLink>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
