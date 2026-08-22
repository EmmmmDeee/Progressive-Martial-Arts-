"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Clock,
  Download,
  User as UserIcon,
  Swords,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import type { SeminarT, InstructorT, ArtDisciplineT } from "@/lib/data";
import { useRouter } from "@/lib/router";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type SeminarWithRelations = SeminarT & {
  art?: ArtDisciplineT | null;
  instructor?: InstructorT | null;
};

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

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateRange(startIso: string, endIso?: string | null) {
  const start = new Date(startIso);
  if (!endIso) {
    return formatDateTime(startIso);
  }
  const end = new Date(endIso);
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) {
    const datePart = start.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const startT = start.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endT = end.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} · ${startT} – ${endT}`;
  }
  return `${formatDateTime(startIso)} → ${formatDateTime(endIso)}`;
}

function downloadICS(seminar: SeminarT) {
  const dtStart = new Date(seminar.date);
  const dtEnd = seminar.endDate
    ? new Date(seminar.endDate)
    : new Date(dtStart.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const safeSummary = seminar.title.replace(/[\r\n,;]/g, " ");
  const safeDesc = (seminar.description || "").replace(/[\r\n]/g, "\\n").replace(/[,;]/g, " ");
  const safeLoc = (seminar.location || "").replace(/[\r\n,;]/g, " ");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PMAAI//Seminar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${seminar.id}@pmaai.com.au`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(dtStart)}`,
    `DTEND:${fmt(dtEnd)}`,
    `SUMMARY:${safeSummary}`,
    `DESCRIPTION:${safeDesc}`,
    `LOCATION:${safeLoc}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${seminar.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Calendar event downloaded", {
    description: `Added "${seminar.title}" to your downloads.`,
  });
}

export function EventDetail({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [seminar, setSeminar] = useState<SeminarWithRelations | null>(null);
  const [related, setRelated] = useState<SeminarT[]>([]);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/api/seminars/${encodeURIComponent(slug)}`).then((r) =>
        r.json()
      ),
      fetch("/api/seminars").then((r) => r.json()),
    ])
      .then(([s, all]) => {
        if (!alive) return;
        if (s.ok) {
          setSeminar(s.data || null);
          setNotFound(false);
        } else {
          setSeminar(null);
          setNotFound(true);
        }
        if (all.ok) {
          const list: SeminarT[] = all.data || [];
          setRelated(
            list
              .filter(
                (x) =>
                  x.id !== slug &&
                  (x.status === "upcoming" || x.status === "current")
              )
              .slice(0, 3)
          );
        }
        setLoadedSlug(slug);
      })
      .catch(() => {
        if (!alive) return;
        setSeminar(null);
        setNotFound(true);
        setLoadedSlug(slug);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loadedSlug !== slug) return <EventDetailSkeleton />;

  if (notFound || !seminar) {
    return (
      <section className="pt-28 pb-20 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl font-bold uppercase mb-3">
            Event not found
          </h1>
          <p className="text-foreground/60 mb-6">
            The seminar you&rsquo;re looking for doesn&rsquo;t exist or has
            been moved.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="#/events">Back to all events</Link>
          </Button>
        </div>
      </section>
    );
  }

  const meta = STATUS_META[seminar.status] || STATUS_META.upcoming;
  const pct = seminar.spotsTotal > 0 ? (seminar.spotsLeft / seminar.spotsTotal) * 100 : 0;
  const isPast = seminar.status === "completed" || seminar.status === "archived";

  return (
    <section className="relative pt-28 pb-20 lg:pt-32 lg:pb-28 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Events", href: "#/events" },
            { label: seminar.title },
          ]}
          className="mb-6"
        />

        {/* Hero */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          <div className="relative aspect-[4/3] lg:aspect-[3/4] lg:col-span-3 overflow-hidden rounded-2xl border border-border/60 bg-card">
            <Image
              src={seminar.image}
              alt={seminar.title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            <div
              className={`absolute top-4 left-4 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded border ${meta.className}`}
            >
              {meta.label}
            </div>
            {isPast && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded border border-accent/30 bg-background/85 backdrop-blur text-accent">
                <AlertCircle className="h-3.5 w-3.5" />
                Past event
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                Seminar &amp; Event
              </div>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-[1.05]">
                {seminar.title}
              </h1>
              <div className="mt-2 text-lg text-accent font-semibold uppercase tracking-wide">
                with {seminar.guest}
              </div>
            </div>

            {/* Key facts */}
            <div className="rounded-xl border border-border/60 bg-card/60 divide-y divide-border/60">
              <FactRow icon={<Calendar className="h-4 w-4 text-accent" />} label="When">
                {formatDateRange(seminar.date, seminar.endDate)}
              </FactRow>
              <FactRow icon={<MapPin className="h-4 w-4 text-accent" />} label="Where">
                {seminar.location}
              </FactRow>
              <FactRow icon={<Clock className="h-4 w-4 text-accent" />} label="Duration">
                {seminar.endDate
                  ? `${Math.max(1, Math.round((new Date(seminar.endDate).getTime() - new Date(seminar.date).getTime()) / (1000 * 60 * 60)))} hours`
                  : "Single session"}
              </FactRow>
              <FactRow icon={<UserIcon className="h-4 w-4 text-accent" />} label="Open to">
                All levels welcome
              </FactRow>
              <FactRow
                icon={
                  <span className="h-4 w-4 flex items-center justify-center text-accent font-bold text-sm">
                    $
                  </span>
                }
                label="Price"
              >
                <span className="font-display text-2xl font-bold text-foreground">
                  {seminar.price > 0 ? `$${seminar.price.toFixed(0)}` : "Free"}
                </span>
              </FactRow>
            </div>

            {/* Spots remaining (only show for upcoming/current) */}
            {!isPast && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-foreground">Spots remaining</span>
                  <span className="text-accent font-semibold">
                    {seminar.spotsLeft} / {seminar.spotsTotal}
                  </span>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="mt-1.5 text-xs text-foreground/55">
                  {seminar.spotsLeft === 0
                    ? "Sold out — join the waitlist via contact."
                    : `${Math.round(pct)}% of spots still available`}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {!isPast ? (
                <Button asChild className="bg-primary hover:bg-primary/90 group/btn">
                  <a href="#contact">
                    Reserve a spot
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </Button>
              ) : (
                <Button asChild variant="outline">
                  <a href="#contact">Enquire about future events</a>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => downloadICS(seminar)}
                className="group/btn"
              >
                <Download className="mr-2 h-4 w-4 transition-transform group-hover/btn:translate-y-0.5" />
                Add to calendar
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 lg:mt-16 max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase">
            About this <span className="text-accent">seminar</span>
          </h2>
          <div className="mt-2 h-px w-16 bg-primary/40" />
          <p className="mt-4 text-foreground/75 leading-relaxed whitespace-pre-line">
            {seminar.description}
          </p>

          {/* Past event notice */}
          {isPast && (
            <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-foreground/80">
                <span className="font-semibold text-foreground">This event has already taken place.</span>{" "}
                Stay tuned for upcoming seminars — PMAAI hosts world-class
                instructors from the Inosanto Academy every year.
                {seminar.galleryUrl && (
                  <>
                    {" "}
                    <a
                      href={seminar.galleryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:underline font-medium"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      View event gallery
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Instructor + Discipline */}
        {(seminar.instructor || seminar.art) && (
          <div className="mt-12 lg:mt-16 grid sm:grid-cols-2 gap-4">
            {seminar.instructor && (
              <article
                role="button"
                tabIndex={0}
                onClick={() =>
                  navigate({ name: "instructor", slug: seminar.instructor!.id })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate({ name: "instructor", slug: seminar.instructor!.id });
                  }
                }}
                className="group cursor-pointer rounded-xl bg-card border border-border/60 p-5 hover:border-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <div className="text-[10px] uppercase tracking-wider text-foreground/40 mb-2">
                  Hosted by PMAAI instructor
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border border-border/60 shrink-0">
                    <Image
                      src={seminar.instructor.image}
                      alt={seminar.instructor.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-lg font-bold uppercase leading-tight">
                      {seminar.instructor.name}
                    </div>
                    <div className="text-xs text-accent font-semibold uppercase tracking-wide">
                      {seminar.instructor.role}
                    </div>
                    <div className="text-xs text-foreground/55 mt-0.5 line-clamp-1">
                      {seminar.instructor.specialty}
                    </div>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all">
                  View instructor profile <ArrowRight className="h-3 w-3" />
                </div>
              </article>
            )}

            {seminar.art && (
              <article
                role="button"
                tabIndex={0}
                onClick={() =>
                  navigate({ name: "program", slug: seminar.art!.slug })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate({ name: "program", slug: seminar.art!.slug });
                  }
                }}
                className="group cursor-pointer rounded-xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={seminar.art.image}
                    alt={seminar.art.name}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <div className="text-[10px] uppercase tracking-wider text-accent font-semibold flex items-center gap-1">
                      <Swords className="h-3 w-3" />
                      {seminar.art.focus}
                    </div>
                    <div className="font-display text-lg font-bold uppercase leading-tight">
                      {seminar.art.name}
                    </div>
                  </div>
                </div>
                {seminar.art.tagline && (
                  <div className="p-3 text-xs text-foreground/60 italic">
                    &ldquo;{seminar.art.tagline}&rdquo;
                  </div>
                )}
              </article>
            )}
          </div>
        )}

        {/* Related upcoming events */}
        {related.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase mb-4">
              More <span className="text-accent">upcoming events</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((s) => (
                <article
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate({ name: "event", slug: s.id })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate({ name: "event", slug: s.id });
                    }
                  }}
                  className="group cursor-pointer rounded-xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-accent font-semibold">
                      {formatDateRange(s.date, s.endDate).split(" · ")[0]}
                    </div>
                    <h4 className="mt-1 font-display text-base font-bold uppercase leading-snug line-clamp-2">
                      {s.title}
                    </h4>
                    <div className="mt-1 text-xs text-foreground/60">{s.guest}</div>
                    <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all">
                      View details <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 flex justify-center">
          <Button asChild variant="ghost" className="text-foreground/70">
            <Link href="#/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all events
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-foreground/40">
          {label}
        </div>
        <div className="text-sm text-foreground font-medium">{children}</div>
      </div>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-48 mb-6 rounded" />
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          <Skeleton className="aspect-[4/3] lg:aspect-[3/4] lg:col-span-3 rounded-2xl" />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-16 w-3/4 rounded" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-10 w-40 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
