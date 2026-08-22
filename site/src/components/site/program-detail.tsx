"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Home,
  MapPin,
  Package,
  Quote,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useRouter, RouteLink } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ArtDisciplineT, ClassScheduleT, InstructorT, MediaT, FaqT } from "@/lib/data";

type ArtWithRelations = ArtDisciplineT & {
  classes?: ClassScheduleT[];
  faqs?: FaqT[];
  media?: MediaT[];
};

const SUBNAV = [
  { id: "overview", label: "Overview" },
  { id: "suitability", label: "Suitability" },
  { id: "learn", label: "What You'll Learn" },
  { id: "bring", label: "What to Bring" },
  { id: "instructors", label: "Instructors" },
  { id: "timetable", label: "Timetable" },
  { id: "faqs", label: "FAQs" },
];

const focusColor: Record<string, string> = {
  "Stand-up": "bg-primary/15 text-primary border-primary/30",
  Weaponry: "bg-accent/15 text-accent border-accent/30",
  Ground: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Kids: "bg-pink-500/15 text-pink-400 border-pink-500/30",
};

const DAY_ORDER: Record<string, number> = {
  Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7,
};

function parsePipe(s?: string | null): string[] {
  if (!s) return [];
  return s.split("|").map((x) => x.trim()).filter(Boolean);
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function ProgramDetail({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [art, setArt] = useState<ArtWithRelations | null>(null);
  const [instructors, setInstructors] = useState<InstructorT[]>([]);
  const [allClasses, setAllClasses] = useState<ClassScheduleT[]>([]);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/api/arts/${slug}`).then((r) => r.json()),
      fetch(`/api/instructors`).then((r) => r.json()),
      fetch(`/api/classes`).then((r) => r.json()),
    ])
      .then(([artRes, insRes, clsRes]) => {
        if (!alive) return;
        if (artRes.ok) setArt(artRes.data);
        if (insRes.ok) setInstructors(insRes.data || []);
        if (clsRes.ok) setAllClasses(clsRes.data || []);
        setLoadedSlug(slug);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoadedSlug(slug);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const loading = loadedSlug !== slug;

  const artInstructors = useMemo(() => {
    if (!art) return [];
    return instructors.filter(
      (i) =>
        i.artDisciplineIds &&
        i.artDisciplineIds.split(",").map((x) => x.trim()).includes(art.id)
    );
  }, [instructors, art]);

  const artClasses = useMemo(() => {
    if (!art) return [];
    return allClasses
      .filter((c) => c.artName === art.name || c.artId === art.id)
      .sort((a, b) => {
        const d = (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99);
        if (d !== 0) return d;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [allClasses, art]);

  const grouped = useMemo(() => {
    const map = new Map<string, ClassScheduleT[]>();
    artClasses.forEach((c) => {
      const list = map.get(c.day) || [];
      list.push(c);
      map.set(c.day, list);
    });
    return Array.from(map.entries());
  }, [artClasses]);

  const faqs = art?.faqs && art.faqs.length > 0 ? art.faqs : [];

  if (loading) return <ProgramSkeleton />;
  if (!art) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold uppercase mb-3">Program not found</h1>
        <p className="text-foreground/70 mb-6">
          The discipline you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.
        </p>
        <Button onClick={() => navigate({ name: "home" })}>Back to home</Button>
      </div>
    );
  }

  const accent = art.accentColor || "#dc2626";
  const learn = parsePipe(art.whatYouLearn);
  const bring = parsePipe(art.whatToBring);
  const focusCls = focusColor[art.focus] || "bg-secondary/40 text-foreground border-border";

  return (
    <article className="bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-foreground/50 flex-wrap"
          >
            <RouteLink
              to={{ name: "home" }}
              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Home className="h-3 w-3" />
              <span className="sr-only">Home</span>
            </RouteLink>
            <ChevronRight className="h-3 w-3 text-foreground/30" />
            <RouteLink to={{ name: "home" }} className="hover:text-accent transition-colors">
              Arts We Teach
            </RouteLink>
            <ChevronRight className="h-3 w-3 text-foreground/30" />
            <span className="text-foreground/80 font-medium truncate">{art.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={art.image}
            alt={art.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Badge
                variant="outline"
                className={`backdrop-blur-sm ${focusCls}`}
              >
                {art.focus}
              </Badge>
              <Badge variant="outline" className="backdrop-blur-sm border-border/60 text-foreground/80">
                <MapPin className="h-3 w-3" /> Origin: {art.origin}
              </Badge>
              <Badge variant="outline" className="backdrop-blur-sm border-border/60 text-foreground/80">
                <GraduationCap className="h-3 w-3" /> {art.difficulty}
              </Badge>
              <Badge variant="outline" className="backdrop-blur-sm border-border/60 text-foreground/80">
                <Users className="h-3 w-3" /> Ages {art.minAge}+
              </Badge>
            </div>
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] mb-3"
              style={{ color: accent }}
            >
              <span className="h-px w-8" style={{ background: accent }} />
              Discipline
            </div>
            <h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-4"
            >
              {art.name}
            </h1>
            {art.tagline && (
              <p className="font-display text-lg sm:text-xl text-foreground/80 italic max-w-2xl">
                &ldquo;{art.tagline}&rdquo;
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate({ name: "contact" })}
                className="group"
              >
                Claim your free trial class
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToId("timetable")}
                className="border-border/60 bg-background/40 backdrop-blur-sm hover:bg-background/70"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                View timetable
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky sub-nav */}
      <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Program sections"
            className="flex gap-1 overflow-x-auto py-3 scrollbar-thin"
          >
            {SUBNAV.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToId(s.id)}
                className="shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider text-foreground/60 hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview */}
      <Section id="overview" eyebrow="Overview" title={`About ${art.name}`}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-base sm:text-lg">
              {art.longDescription || art.description}
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              <Stat icon={<MapPin className="h-4 w-4" />} label="Origin" value={art.origin} />
              <Stat icon={<GraduationCap className="h-4 w-4" />} label="Difficulty" value={art.difficulty} />
              <Stat icon={<Users className="h-4 w-4" />} label="Min. age" value={`${art.minAge}+`} />
            </div>
          </div>
          {/* Media gallery */}
          <div>
            {art.media && art.media.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {art.media.slice(0, 4).map((m) => (
                  <figure
                    key={m.id}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border/60 group"
                  >
                    <Image
                      src={m.thumbnail || m.url}
                      alt={m.title || art.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <figcaption className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-background/90 to-transparent text-[10px] text-foreground/80 uppercase tracking-wide">
                      {m.caption || m.title}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border/60">
                <Image
                  src={art.image}
                  alt={art.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Suitability */}
      <Section
        id="suitability"
        eyebrow="Suitability"
        title="Is this discipline for you?"
        variant="alt"
      >
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <p className="text-foreground/80 leading-relaxed text-base sm:text-lg">
            {art.suitability || "Suitable for adults and teens of all levels. No prior experience necessary."}
          </p>
          <div className="flex flex-wrap gap-3">
            <SuitabilityBadge icon={<GraduationCap className="h-4 w-4" />} label="Difficulty" value={art.difficulty} />
            <SuitabilityBadge icon={<Users className="h-4 w-4" />} label="Minimum age" value={`${art.minAge} years`} />
            <SuitabilityBadge icon={<Sparkles className="h-4 w-4" />} label="Focus" value={art.focus} />
            <SuitabilityBadge icon={<MapPin className="h-4 w-4" />} label="Origin" value={art.origin} />
          </div>
        </div>
      </Section>

      {/* What You'll Learn */}
      <Section id="learn" eyebrow="Curriculum" title="What you'll learn">
        {learn.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {learn.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg bg-card border border-border/60 p-4 hover:border-primary/30 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/85 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">Curriculum details coming soon.</p>
        )}
      </Section>

      {/* What to Bring */}
      <Section
        id="bring"
        eyebrow="Get started"
        title="What to bring"
        variant="alt"
      >
        {bring.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-3 max-w-3xl">
            {bring.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg bg-card border border-border/60 p-3"
              >
                <Package className="h-4 w-4 text-accent shrink-0" />
                <span className="text-sm text-foreground/85">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">Comfortable training clothes and a water bottle will get you started.</p>
        )}
      </Section>

      {/* Instructors */}
      <Section id="instructors" eyebrow="Mentors" title="Your instructors">
        {artInstructors.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {artInstructors.map((ins) => (
              <article
                key={ins.id}
                className="group overflow-hidden rounded-xl bg-card border border-border/60 hover:border-accent/40 transition-colors"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={ins.image}
                    alt={ins.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-0.5">
                      {ins.role}
                    </div>
                    <h3 className="font-display text-lg font-bold uppercase text-foreground leading-tight">
                      {ins.name}
                    </h3>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-xs text-foreground/70 mb-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">{ins.specialty}</span>
                  </div>
                  <p className="text-[11px] text-foreground/65 leading-snug line-clamp-3">
                    {ins.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-10 text-center text-foreground/55">
            <User className="h-8 w-8 mx-auto mb-3 opacity-50" />
            Instructor profiles for {art.name} are being finalised.
            <div className="mt-4">
              <RouteLink
                to={{ name: "instructors" }}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors"
              >
                Meet the full team
                <ArrowRight className="h-4 w-4" />
              </RouteLink>
            </div>
          </div>
        )}
      </Section>

      {/* Timetable */}
      <Section
        id="timetable"
        eyebrow="Schedule"
        title="Weekly timetable"
        variant="alt"
      >
        {grouped.length > 0 ? (
          <div className="space-y-5">
            {grouped.map(([day, list]) => (
              <div key={day}>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                    {day}
                  </h3>
                  <span className="text-[10px] text-foreground/40 uppercase">
                    {list.length} class{list.length > 1 ? "es" : ""}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-lg bg-card border border-border/60 p-3"
                    >
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <Clock className="h-3.5 w-3.5 text-accent" />
                        {c.startTime} – {c.endTime}
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-xs text-foreground/65 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {c.instructor}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border border-border bg-secondary/40 text-foreground/80">
                          {c.level}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-foreground/50 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {c.room}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-foreground/65 mb-4">
              No dedicated {art.name} classes scheduled this week.
            </p>
            <Button asChild variant="outline">
              <RouteLink to={{ name: "timetable" }}>
                <CalendarDays className="mr-2 h-4 w-4" />
                See full timetable
              </RouteLink>
            </Button>
          </div>
        )}
      </Section>

      {/* FAQs */}
      <Section id="faqs" eyebrow="Questions" title="Frequently asked questions">
        {faqs.length > 0 ? (
          <div className="max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f) => (
                <AccordionItem key={f.id} value={f.id}>
                  <AccordionTrigger className="text-left font-display text-base font-semibold uppercase tracking-wide hover:no-underline">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/75 leading-relaxed">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="trial">
                <AccordionTrigger className="text-left font-display text-base font-semibold uppercase tracking-wide hover:no-underline">
                  Can I try a class for free?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/75 leading-relaxed">
                  Yes. Your first class at PMAAI is free. Just arrive 15 minutes
                  before the scheduled session to meet your instructor and
                  complete a quick induction form.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="gear">
                <AccordionTrigger className="text-left font-display text-base font-semibold uppercase tracking-wide hover:no-underline">
                  Do I need gear for my first class?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/75 leading-relaxed">
                  Comfortable training clothes and a water bottle will get you
                  started. We have loaner gloves, wraps and sticks for first-timers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="membership">
                <AccordionTrigger className="text-left font-display text-base font-semibold uppercase tracking-wide hover:no-underline">
                  How does membership work?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/75 leading-relaxed">
                  PMAAI offers casual, monthly and unlimited memberships. You can
                  train in any of our six disciplines on a single membership.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </Section>

      {/* Conversion CTA band */}
      <section className="relative overflow-hidden border-y border-border/60 bg-gradient-to-br from-primary/15 via-card to-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Quote className="h-8 w-8 text-primary/40 mb-3" />
              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase leading-tight">
                Claim your free trial <span className="text-gradient-crimson">{art.name}</span> class
              </h2>
              <p className="mt-3 text-foreground/75 max-w-lg">
                Walk-ins welcome. Your first session is on us — just arrive 15
                minutes early to meet your instructor and tour the academy.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button size="lg" onClick={() => navigate({ name: "contact" })} className="group">
                Book a free trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button asChild size="lg" variant="outline">
                <RouteLink to={{ name: "timetable" }}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  View full timetable
                </RouteLink>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
  variant = "default",
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  variant?: "default" | "alt";
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-14 lg:py-20 ${
        variant === "alt" ? "bg-secondary/20" : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">
            <span className="h-px w-8 bg-primary" />
            {eyebrow}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase leading-tight">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-foreground/50 mb-1">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function SuitabilityBadge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-4 py-3">
      <span className="text-primary">{icon}</span>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-foreground/50">{label}</div>
        <div className="text-sm font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function ProgramSkeleton() {
  return (
    <div className="bg-background">
      <div className="border-b border-border/60 bg-secondary/20 py-3">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-3 w-64" />
        </div>
      </div>
      <Skeleton className="h-[60vh] w-full rounded-none" />
      <div className="sticky top-[64px] z-30 bg-background/95 border-b border-border/60 py-3">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-80" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <div className="grid sm:grid-cols-3 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    </div>
  );
}
