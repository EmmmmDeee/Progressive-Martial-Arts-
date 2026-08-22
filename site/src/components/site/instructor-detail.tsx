"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Clock,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Quote,
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  ShieldCheck,
  Swords,
} from "lucide-react";
import { useRouter } from "@/lib/router";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  InstructorT,
  ArtDisciplineT,
  ClassScheduleT,
  SeminarT,
} from "@/lib/data";

type InstructorWithRelations = InstructorT & {
  classes?: ClassScheduleT[];
  events?: SeminarT[];
};

const DAY_ORDER: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const levelStyle: Record<string, string> = {
  "All Levels": "bg-secondary/60 text-foreground border-border",
  Beginner: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Advanced: "bg-primary/15 text-primary border-primary/30",
  Kids: "bg-pink-500/15 text-pink-400 border-pink-500/30",
};

export function InstructorDetail({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [instructor, setInstructor] = useState<InstructorWithRelations | null>(
    null
  );
  const [arts, setArts] = useState<ArtDisciplineT[]>([]);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/api/instructors/${encodeURIComponent(slug)}`).then((r) =>
        r.json()
      ),
      fetch("/api/arts").then((r) => r.json()),
    ])
      .then(([i, a]) => {
        if (!alive) return;
        if (i.ok) {
          setInstructor(i.data || null);
          setNotFound(false);
        } else {
          setInstructor(null);
          setNotFound(true);
        }
        if (a.ok) setArts(a.data || []);
        setLoadedSlug(slug);
      })
      .catch(() => {
        if (!alive) return;
        setInstructor(null);
        setNotFound(true);
        setLoadedSlug(slug);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loadedSlug !== slug) return <InstructorDetailSkeleton />;

  if (notFound || !instructor) {
    return (
      <section className="pt-28 pb-20 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl font-bold uppercase mb-3">
            Instructor not found
          </h1>
          <p className="text-foreground/60 mb-6">
            The instructor profile you&rsquo;re looking for doesn&rsquo;t exist
            or has been moved.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="#/instructors">Back to all instructors</Link>
          </Button>
        </div>
      </section>
    );
  }

  const disciplines = (instructor.artDisciplineIds || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((id) => arts.find((a) => a.id === id))
    .filter(Boolean) as ArtDisciplineT[];

  const classes = instructor.classes || [];
  const classesByDay = classes.reduce((acc, c) => {
    if (!acc[c.day]) acc[c.day] = [];
    acc[c.day].push(c);
    return acc;
  }, {} as Record<string, ClassScheduleT[]>);
  const dayKeys = Object.keys(classesByDay).sort(
    (a, b) => (DAY_ORDER[a] || 99) - (DAY_ORDER[b] || 99)
  );

  const upcomingSeminars = (instructor.events || []).filter(
    (e) => e.status === "upcoming" || e.status === "current"
  );

  const firstName = instructor.name.split(" ").slice(-1)[0] || instructor.name;

  return (
    <section className="relative pt-28 pb-20 lg:pt-32 lg:pb-28 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Instructors", href: "#/instructors" },
            { label: instructor.name },
          ]}
          className="mb-6"
        />

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/60 bg-card">
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            {instructor.yearsExperience > 0 && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur border border-accent/30 px-3 py-1.5 text-xs font-semibold text-accent">
                <Clock className="h-3.5 w-3.5" />
                {instructor.yearsExperience}+ years experience
              </div>
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              {instructor.role}
            </div>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.05]">
              {instructor.name}
            </h1>
            <div className="mt-2 text-lg text-foreground/70">
              {instructor.specialty}
            </div>

            {/* Stats */}
            <div className="mt-5 flex flex-wrap gap-3">
              {instructor.startedTraining && (
                <div className="flex items-center gap-1.5 text-xs text-foreground/70 rounded-md border border-border/60 bg-card/60 px-3 py-1.5">
                  <Swords className="h-3.5 w-3.5 text-accent" />
                  Training since {instructor.startedTraining}
                </div>
              )}
              {instructor.joinedPMAAI && (
                <div className="flex items-center gap-1.5 text-xs text-foreground/70 rounded-md border border-border/60 bg-card/60 px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Joined PMAAI {instructor.joinedPMAAI}
                </div>
              )}
              {instructor.certifications && (
                <div className="flex items-center gap-1.5 text-xs text-foreground/70 rounded-md border border-border/60 bg-card/60 px-3 py-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  Certified instructor
                </div>
              )}
            </div>

            {/* Certifications */}
            {instructor.certifications && (
              <div className="mt-5">
                <div className="text-[10px] uppercase tracking-wider text-foreground/40 mb-1.5">
                  Certifications
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {instructor.certifications}
                </p>
              </div>
            )}

            {/* Quote */}
            {instructor.quote && (
              <div className="mt-6 relative rounded-lg border-l-2 border-primary bg-primary/5 p-4">
                <Quote className="h-5 w-5 text-primary/40 mb-1" />
                <p className="font-display text-base italic text-foreground/90">
                  &ldquo;{instructor.quote}&rdquo;
                </p>
              </div>
            )}

            {/* Contact + socials */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-primary hover:bg-primary/90 group/btn">
                <a href="#contact">
                  Train with {firstName}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
              </Button>
              {instructor.email && (
                <Button asChild variant="outline" size="icon" aria-label={`Email ${instructor.name}`}>
                  <a href={`mailto:${instructor.email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {instructor.phone && (
                <Button asChild variant="outline" size="icon" aria-label={`Call ${instructor.name}`}>
                  <a href={`tel:${instructor.phone.replace(/[^+\d]/g, "")}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {instructor.socialInstagram && (
                <Button asChild variant="outline" size="icon" aria-label="Instagram">
                  <a href={instructor.socialInstagram} target="_blank" rel="noreferrer">
                    <Instagram className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {instructor.socialFacebook && (
                <Button asChild variant="outline" size="icon" aria-label="Facebook">
                  <a href={instructor.socialFacebook} target="_blank" rel="noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Long bio */}
        {(instructor.longBio || instructor.bio) && (
          <div className="mt-12 lg:mt-16 max-w-3xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase">
              Biography
            </h2>
            <div className="mt-2 h-px w-16 bg-primary/40" />
            <p className="mt-4 text-foreground/75 leading-relaxed whitespace-pre-line">
              {instructor.longBio || instructor.bio}
            </p>
          </div>
        )}

        {/* Disciplines taught */}
        {disciplines.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase mb-4">
              Disciplines <span className="text-accent">taught</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {disciplines.map((art) => (
                <article
                  key={art.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate({ name: "program", slug: art.slug })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate({ name: "program", slug: art.slug });
                    }
                  }}
                  className="group cursor-pointer rounded-xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={art.image}
                      alt={art.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                        {art.focus}
                      </div>
                      <div className="font-display text-lg font-bold uppercase leading-tight">
                        {art.name}
                      </div>
                    </div>
                  </div>
                  {art.tagline && (
                    <div className="p-3 text-xs text-foreground/60 italic">
                      &ldquo;{art.tagline}&rdquo;
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Classes taught */}
        {classes.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase mb-4">
              Classes <span className="text-accent">taught</span>
            </h2>
            <div className="space-y-5">
              {dayKeys.map((day) => (
                <div key={day}>
                  <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">
                    {day}
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {classesByDay[day].map((c) => (
                      <div
                        key={c.id}
                        className="rounded-lg bg-card border border-border/60 p-3.5"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                            <Clock className="h-3.5 w-3.5 text-accent" />
                            {c.startTime}&ndash;{c.endTime}
                          </div>
                          <span
                            className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded border ${
                              levelStyle[c.level] || levelStyle["All Levels"]
                            }`}
                          >
                            {c.level}
                          </span>
                        </div>
                        <div className="font-display text-base font-bold uppercase leading-tight">
                          {c.artName || "Class"}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground/55">
                          <MapPin className="h-3 w-3" />
                          {c.room}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming seminars */}
        {upcomingSeminars.length > 0 && (
          <div className="mt-12 lg:mt-16">
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase mb-4">
              Upcoming <span className="text-accent">seminars</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {upcomingSeminars.map((s) => {
                const pct =
                  s.spotsTotal > 0 ? (s.spotsLeft / s.spotsTotal) * 100 : 0;
                return (
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
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-accent font-semibold">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(s.date)}
                      </div>
                      <h3 className="mt-1 font-display text-lg font-bold uppercase leading-tight">
                        {s.title}
                      </h3>
                      <div className="mt-1 text-xs text-foreground/60">
                        with {s.guest}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-foreground/60">
                            {s.spotsLeft} spots left
                          </span>
                          <span className="font-semibold text-foreground">
                            {s.price > 0 ? `$${s.price.toFixed(0)}` : "Free"}
                          </span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 lg:mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/30 p-8 lg:p-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase">
            Train with <span className="text-gradient-gold">{firstName}</span>
          </h2>
          <p className="mt-2 text-foreground/70 max-w-xl mx-auto">
            Book a free trial class and experience the PMAAI difference for
            yourself. All levels welcome.
          </p>
          <Button asChild className="mt-5 bg-primary hover:bg-primary/90 group/btn">
            <a href="#contact">
              Book free trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </a>
          </Button>
        </div>

        {/* Back link */}
        <div className="mt-8 flex justify-center">
          <Button asChild variant="ghost" className="text-foreground/70">
            <Link href="#/instructors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all instructors
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function InstructorDetailSkeleton() {
  return (
    <section className="pt-28 pb-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-48 mb-6 rounded" />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-[3/4] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-16 w-3/4 rounded" />
            <Skeleton className="h-6 w-1/2 rounded" />
            <Skeleton className="h-20 w-full rounded" />
            <Skeleton className="h-10 w-40 rounded" />
          </div>
        </div>
        <Skeleton className="mt-12 h-40 w-full rounded-xl" />
      </div>
    </section>
  );
}
