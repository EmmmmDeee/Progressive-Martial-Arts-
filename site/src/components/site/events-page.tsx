"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Calendar, Users, MapPin, ArrowRight, CalendarX } from "lucide-react";
import type { SeminarT } from "@/lib/data";
import { useRouter } from "@/lib/router";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
function formatDayMonth(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-AU", { day: "2-digit" }),
    month: d.toLocaleDateString("en-AU", { month: "short" }).toUpperCase(),
  };
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  current: {
    label: "Happening Now",
    className: "bg-primary/20 text-primary border-primary/40",
  },
  completed: {
    label: "Completed",
    className: "bg-accent/15 text-accent border-accent/30",
  },
  archived: {
    label: "Archived",
    className: "bg-secondary text-foreground/60 border-border",
  },
};

type TabKey = "upcoming" | "past" | "archived";

export function EventsPage() {
  const { navigate } = useRouter();
  const [seminars, setSeminars] = useState<SeminarT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seminars")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setSeminars(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const upcoming = seminars.filter(
      (s) => s.status === "upcoming" || s.status === "current"
    );
    const past = seminars.filter((s) => s.status === "completed");
    const archived = seminars.filter((s) => s.status === "archived");
    return { upcoming, past, archived };
  }, [seminars]);

  const featured = useMemo(
    () =>
      grouped.upcoming.find((s) => s.featured) || grouped.upcoming[0] || null,
    [grouped]
  );

  const othersByTab = (tab: TabKey) => {
    const list =
      tab === "upcoming" ? grouped.upcoming : tab === "past" ? grouped.past : grouped.archived;
    return list.filter((s) => s.id !== featured?.id);
  };

  return (
    <section className="relative pt-28 pb-20 lg:pt-32 lg:pb-28 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Events" }]} className="mb-6" />
        <SectionHeading
          eyebrow="Seminars & Events"
          title={
            <>
              Seminars &amp; <span className="text-gradient-crimson">Events</span>
            </>
          }
          description="Annual seminars bring legendary instructors from the Inosanto Academy and beyond to Brisbane. Spaces are limited and sell out fast."
        />

        {loading ? (
          <div className="mt-10 space-y-6">
            <Skeleton className="h-72 rounded-2xl" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          </div>
        ) : seminars.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
            <CalendarX className="h-10 w-10 mx-auto mb-3 opacity-50" />
            No seminars scheduled. Check back soon.
          </div>
        ) : (
          <div className="mt-10">
            {/* Featured banner */}
            {featured && (
              <article className="group relative overflow-hidden rounded-2xl bg-card border border-border/60 lg:flex mb-8">
                <div className="relative lg:w-1/2 aspect-[16/10] lg:aspect-auto overflow-hidden">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/60 lg:to-card" />
                  <div className="absolute top-4 left-4 flex flex-col items-center justify-center rounded-lg bg-background/90 backdrop-blur-sm border border-accent/30 px-4 py-2 shadow-lg">
                    <span className="font-display text-3xl font-bold leading-none text-gradient-crimson">
                      {formatDayMonth(featured.date).day}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mt-0.5">
                      {formatDayMonth(featured.date).month}
                    </span>
                  </div>
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center lg:w-1/2">
                  <Badge className="self-start bg-accent/15 text-accent border border-accent/30 mb-3 uppercase tracking-wide">
                    Featured Event
                  </Badge>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold uppercase leading-tight">
                    {featured.title}
                  </h2>
                  <div className="mt-2 text-sm text-accent font-semibold uppercase tracking-wider">
                    with {featured.guest}
                  </div>
                  <p className="mt-4 text-foreground/70 leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Calendar className="h-4 w-4 text-accent" />
                      {formatDate(featured.date)}
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <Users className="h-4 w-4 text-accent" />
                      {featured.spotsLeft} spots left
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <MapPin className="h-4 w-4 text-accent" />
                      {featured.location}
                    </div>
                    <div className="flex items-center gap-2 text-foreground/70">
                      <span className="h-4 w-4 flex items-center justify-center text-accent font-bold">
                        $
                      </span>
                      {featured.price > 0
                        ? `$${featured.price.toFixed(0)}`
                        : "Free for members"}
                    </div>
                  </div>
                  <div className="mt-5">
                    <Progress
                      value={
                        featured.spotsTotal > 0
                          ? (featured.spotsLeft / featured.spotsTotal) * 100
                          : 0
                      }
                      className="h-2"
                    />
                    <div className="mt-1 text-xs text-foreground/55">
                      {featured.spotsLeft} of {featured.spotsTotal} spots remaining
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="bg-primary hover:bg-primary/90 group/btn">
                      <a href="#contact">
                        Reserve a spot
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate({ name: "event", slug: featured.id })
                      }
                    >
                      View details
                    </Button>
                  </div>
                </div>
              </article>
            )}

            {/* Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="bg-card border border-border/60 p-1 h-auto flex-wrap">
                <TabsTrigger value="upcoming" className="px-4">
                  Upcoming ({grouped.upcoming.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="px-4">
                  Past Events ({grouped.past.length})
                </TabsTrigger>
                <TabsTrigger value="archived" className="px-4">
                  Archive ({grouped.archived.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-6">
                <EventGrid
                  events={othersByTab("upcoming")}
                  onNavigate={(id) => navigate({ name: "event", slug: id })}
                />
              </TabsContent>
              <TabsContent value="past" className="mt-6">
                <EventGrid
                  events={othersByTab("past")}
                  onNavigate={(id) => navigate({ name: "event", slug: id })}
                />
              </TabsContent>
              <TabsContent value="archived" className="mt-6">
                <EventGrid
                  events={othersByTab("archived")}
                  onNavigate={(id) => navigate({ name: "event", slug: id })}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </section>
  );
}

function EventGrid({
  events,
  onNavigate,
}: {
  events: SeminarT[];
  onNavigate: (id: string) => void;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
        <CalendarX className="h-10 w-10 mx-auto mb-3 opacity-50" />
        No events in this category.
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map((s) => {
        const dm = formatDayMonth(s.date);
        const meta = STATUS_META[s.status] || STATUS_META.upcoming;
        const pct = s.spotsTotal > 0 ? (s.spotsLeft / s.spotsTotal) * 100 : 0;
        return (
          <article
            key={s.id}
            role="button"
            tabIndex={0}
            onClick={() => onNavigate(s.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onNavigate(s.id);
              }
            }}
            className="group cursor-pointer rounded-xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute top-2 left-2 flex flex-col items-center rounded-md bg-background/85 backdrop-blur border border-accent/30 px-2.5 py-1">
                <span className="font-display text-base font-bold leading-none text-gradient-crimson">
                  {dm.day}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-accent">
                  {dm.month}
                </span>
              </div>
              <div
                className={`absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border ${meta.className}`}
              >
                {meta.label}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-display text-base font-bold uppercase leading-snug line-clamp-2">
                {s.title}
              </h4>
              <div className="mt-1 text-xs text-accent font-medium">{s.guest}</div>
              <div className="mt-2 flex items-center justify-between text-xs text-foreground/55">
                <span>{formatDate(s.date)}</span>
                <span>{s.spotsLeft} spots</span>
              </div>
              <div className="mt-3">
                <Progress value={pct} className="h-1" />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-foreground/55">
                    {s.price > 0 ? `$${s.price.toFixed(0)}` : "Free"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all">
                    View details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
