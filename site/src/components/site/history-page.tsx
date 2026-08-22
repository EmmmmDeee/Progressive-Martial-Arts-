"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Quote,
  ArrowRight,
  History,
  TreePine,
  Images,
  Flame,
} from "lucide-react";
import type { MediaT } from "@/lib/data";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Milestone = {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
};

const MILESTONES: Milestone[] = [
  {
    year: "1989",
    title: "PMAAI founded",
    description:
      "Sifu Costa Vassiliou opens Progressive Martial Arts Academy International in Tingalpa, Brisbane — a single-mat dojo with a vision to bring authentic, lineage-rooted martial arts to Australia.",
    highlight: true,
  },
  {
    year: "1990s",
    title: "Inosanto Academy affiliation",
    description:
      "Formal affiliation with the Inosanto Academy of Martial Arts in Los Angeles is established — connecting PMAAI students to the living lineage of Guro Dan Inosanto and Bruce Lee's Jeet Kune Do.",
  },
  {
    year: "2000s",
    title: "Machado-lineage BJJ arrives",
    description:
      "Curriculum expands to include Machado-lineage Brazilian Jiu Jitsu, completing the stand-up · weaponry · ground triangle that defines the PMAAI progressive system.",
  },
  {
    year: "2010",
    title: "Progressive Strength opens",
    description:
      "A 24/7 strength & conditioning facility opens next door to the dojo, giving students a complete physical-development pathway alongside their technical martial arts training.",
  },
  {
    year: "2014",
    title: "Sifu Francis Fong seminar",
    description:
      "Sifu Francis Fong visits Australia for a Wing Chun & JKD intensive hosted at PMAAI — the seminar is recorded and later released as a archival DVD.",
  },
  {
    year: "2015",
    title: "Guro Dan Inosanto seminar",
    description:
      "Guro Dan Inosanto returns to Brisbane for a landmark two-day intensive across JKD, Filipino Kali and Maphilindo Silat. The complete 3-disc DVD set is recorded and released.",
    highlight: true,
  },
  {
    year: "2023",
    title: "Master Jean Jacques Machado BJJ seminar",
    description:
      "BJJ legend Master Jean Jacques Machado leads an afternoon intensive on the ground mat — a rare opportunity to learn from one of the founders of BJJ in America.",
  },
  {
    year: "2026",
    title: "Inosanto + Fong dual seminar",
    description:
      "PMAAI hosts a historic dual seminar with Guro Dan Inosanto and Sifu Francis Fong in November 2026 — two lineage heads, one weekend. Registration opens mid-year.",
    highlight: true,
  },
];

type LineageBranch = {
  name: string;
  role: string;
  art: string;
  blurb: string;
};

const LINEAGE: { root: LineageBranch; branches: LineageBranch[] }[] = [
  {
    root: {
      name: "Bruce Lee",
      role: "Founder · Jeet Kune Do",
      art: "JKD",
      blurb:
        "The original founder of Jeet Kune Do — the intercepting-fist philosophy that freed martial arts from rigid styles and changed combat sports forever.",
    },
    branches: [
      {
        name: "Guro Dan Inosanto",
        role: "Heir to the JKD lineage",
        art: "JKD · Kali · Silat",
        blurb:
          "Bruce Lee's training partner and protégé. Guro Dan is the world's leading authority on JKD, Filipino Martial Arts and Maphilindo Silat, and the principal lineage head of PMAAI.",
      },
      {
        name: "Sifu Francis Fong",
        role: "Wing Chun master",
        art: "Wing Chun · JKD",
        blurb:
          "One of the world's foremost Wing Chun masters and a long-time collaborator with Guro Dan Inosanto on integrating Wing Chun principles into JKD concepts.",
      },
    ],
  },
  {
    root: {
      name: "Carlos Gracie Sr.",
      role: "Founder · Gracie Jiu Jitsu",
      art: "BJJ",
      blurb:
        "The patriarch of Brazilian Jiu Jitsu — the art that proved a smaller, skilled fighter could defeat a larger opponent on the ground.",
    },
    branches: [
      {
        name: "Machado Brothers",
        role: "Founders of Machado BJJ",
        art: "Brazilian Jiu Jitsu",
        blurb:
          "The five Machado brothers — cousins of the Gracies — developed their own highly technical style of BJJ that PMAAI's ground program is rooted in.",
      },
    ],
  },
];

export function HistoryPage() {
  const [media, setMedia] = useState<MediaT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/media?category=historical")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setMedia(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative pt-28 pb-20 lg:pt-32 lg:pb-28 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "History" }]} className="mb-6" />
        <SectionHeading
          eyebrow="Est. 1989"
          title={
            <>
              Our History &amp; <span className="text-gradient-gold">Lineage</span>
            </>
          }
          description="For more than three decades, PMAAI has been the home of authentic, lineage-rooted martial arts in Brisbane. We trace our teaching directly back through Guro Dan Inosanto to Bruce Lee, and through the Machado brothers to the founders of Brazilian Jiu Jitsu."
        />

        {/* Timeline */}
        <div className="mt-12 lg:mt-16">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-8">
            <History className="h-4 w-4" />
            <span>Milestones · 1989 → 2026</span>
          </div>

          <div className="relative">
            {/* Center line on desktop, left line on mobile */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border to-accent/30 -translate-x-1/2" />

            <ol className="space-y-10 lg:space-y-16">
              {MILESTONES.map((m, i) => {
                const isRight = i % 2 === 1;
                return (
                  <li
                    key={m.year}
                    className="relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12"
                  >
                    {/* Dot */}
                    <div className="absolute left-4 sm:left-1/2 top-1 sm:-translate-x-1/2 z-10">
                      <span
                        className={cn(
                          "block h-4 w-4 rounded-full border-2",
                          m.highlight
                            ? "bg-accent border-accent shadow-lg shadow-accent/30"
                            : "bg-primary border-primary shadow-lg shadow-primary/30"
                        )}
                      />
                      <span
                        className={cn(
                          "absolute inset-0 rounded-full animate-ping opacity-40",
                          m.highlight ? "bg-accent" : "bg-primary"
                        )}
                      />
                    </div>

                    {/* Card */}
                    <div
                      className={cn(
                        "sm:col-span-1",
                        isRight ? "sm:col-start-2" : "sm:col-start-1 sm:text-right"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-xl bg-card border border-border/60 p-5 lg:p-6 inline-block max-w-md",
                          m.highlight
                            ? "border-primary/40 shadow-lg shadow-primary/10"
                            : "",
                          isRight ? "sm:text-left" : "sm:text-right"
                        )}
                      >
                        <div className="font-display text-3xl lg:text-4xl font-bold text-gradient-gold leading-none">
                          {m.year}
                        </div>
                        <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight text-foreground">
                          {m.title}
                        </h3>
                        <p className="mt-2 text-sm text-foreground/65 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* The Lineage */}
        <div className="mt-20 lg:mt-28">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
            <TreePine className="h-4 w-4" />
            <span>The Lineage</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase">
            Roots of the <span className="text-accent">academy</span>
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/70">
            PMAAI&rsquo;s teaching traces back through two of the most important
            martial arts lineages of the 20th century. Every certification our
            instructors hold is rooted in these unbroken chains of transmission.
          </p>

          <div className="mt-8 space-y-6">
            {LINEAGE.map((group) => (
              <div
                key={group.root.name}
                className="rounded-xl bg-gradient-to-br from-primary/10 via-card to-card border border-border/60 p-5 lg:p-7"
              >
                {/* Root */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background">
                    <Flame className="h-7 w-7" />
                  </div>
                  <div className="mt-3 font-display text-xl font-bold uppercase">
                    {group.root.name}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-accent font-semibold">
                    {group.root.role}
                  </div>
                  <div className="mt-1 text-xs text-foreground/55 font-medium">
                    {group.root.art}
                  </div>
                  <p className="mt-3 max-w-xl text-sm text-foreground/70 leading-relaxed">
                    {group.root.blurb}
                  </p>
                </div>

                {/* Connector */}
                <div className="my-5 flex items-center justify-center">
                  <div className="h-8 w-px bg-border" />
                </div>

                {/* Branches */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {group.branches.map((b) => (
                    <div
                      key={b.name}
                      className="rounded-lg bg-card/80 border border-border/60 p-4 text-center"
                    >
                      <div className="font-display text-base font-bold uppercase leading-tight">
                        {b.name}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-accent font-semibold mt-0.5">
                        {b.role}
                      </div>
                      <div className="text-xs text-foreground/55 font-medium mt-1">
                        {b.art}
                      </div>
                      <p className="mt-2 text-xs text-foreground/65 leading-relaxed">
                        {b.blurb}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical gallery */}
        <div className="mt-20 lg:mt-28">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
            <Images className="h-4 w-4" />
            <span>Historical Gallery</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase">
            Decades on the <span className="text-accent">wall</span>
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Photographs from the PMAAI archives — seminars past, lineage
            visits and the people who shaped the academy.
          </p>

          {loading ? (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : media.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
              The historical archive is being curated. Check back soon.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {media.map((m) => (
                <figure
                  key={m.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-card"
                >
                  <Image
                    src={m.url}
                    alt={m.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <figcaption className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-xs font-semibold text-foreground line-clamp-2">
                      {m.title}
                    </div>
                    {m.year && (
                      <div className="text-[10px] text-accent font-semibold">
                        {m.year}
                      </div>
                    )}
                    {m.caption && (
                      <div className="mt-1 text-[10px] text-foreground/60 line-clamp-2">
                        {m.caption}
                      </div>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        {/* Quote / CTA */}
        <div className="mt-20 lg:mt-28 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/30 p-8 lg:p-12">
          <Quote className="absolute top-6 left-6 h-10 w-10 text-primary/30" />
          <blockquote className="relative max-w-3xl mx-auto text-center">
            <p className="font-display text-xl lg:text-2xl font-medium leading-relaxed text-foreground">
              &ldquo;Absorb what is useful. Discard what is not. Add what is
              uniquely your own.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-foreground/60 uppercase tracking-wider">
              — Bruce Lee, founder of Jeet Kune Do
            </footer>
          </blockquote>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-primary hover:bg-primary/90 group/btn">
              <Link href="#/instructors">
                Meet our instructors
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#/events">See upcoming seminars</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
