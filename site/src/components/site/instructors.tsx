"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RouteLink } from "@/lib/router";
import { Award, Clock, Quote } from "lucide-react";
import type { InstructorT } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export function Instructors() {
  const [instructors, setInstructors] = useState<InstructorT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructors")
      .then((r) => r.json())
      .then((res) => setInstructors(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="instructors" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Instructors
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
            Mentors with <span className="text-gradient-crimson">world-class</span> pedigree
          </h2>
          <p className="mt-4 text-foreground/70">
            Our instructors draw from world-renowned sources of knowledge —
            certified under Guro Dan Inosanto and the Inosanto Academy.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((ins) => (
              <RouteLink
                key={ins.id}
                to={{ name: "instructor", slug: ins.id }}
                className="group block relative overflow-hidden rounded-xl bg-card border border-border/60 transition-all duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-black/30"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={ins.image}
                    alt={ins.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 px-2.5 py-1 text-[10px] font-semibold text-accent">
                    <Clock className="h-3 w-3" />
                    {ins.yearsExperience} yrs
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-0.5">{ins.role}</div>
                    <h3 className="font-display text-xl font-bold uppercase text-foreground leading-tight">{ins.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-xs text-foreground/60 mb-2">
                    <Award className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground/80">{ins.specialty}</span>
                  </div>
                  <p className="text-xs text-foreground/65 leading-relaxed line-clamp-4">{ins.bio}</p>
                </div>
              </RouteLink>
            ))}
          </div>
        )}

        <div className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-card to-card border border-border/60 p-8 lg:p-12">
          <Quote className="absolute top-6 left-6 h-10 w-10 text-primary/30" />
          <blockquote className="relative max-w-3xl mx-auto text-center">
            <p className="font-display text-xl lg:text-2xl font-medium leading-relaxed text-foreground">
              &ldquo;We believe martial arts is for everyone. Whether your goal is self-defence, fitness, competition or personal growth, our role is to nurture that potential — wherever you start from.&rdquo;
            </p>
            <footer className="mt-4 text-sm text-foreground/60 uppercase tracking-wider">
              — The PMAAI Instructors &amp; Support Crew
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
