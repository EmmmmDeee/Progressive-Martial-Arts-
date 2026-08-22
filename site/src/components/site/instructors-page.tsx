"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { Award, Clock, Quote, ArrowRight } from "lucide-react";
import type { InstructorT, ArtDisciplineT } from "@/lib/data";
import { useRouter } from "@/lib/router";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SectionHeading } from "@/components/site/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function InstructorsPage() {
  const { navigate } = useRouter();
  const [instructors, setInstructors] = useState<InstructorT[]>([]);
  const [arts, setArts] = useState<ArtDisciplineT[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/instructors").then((r) => r.json()),
      fetch("/api/arts").then((r) => r.json()),
    ])
      .then(([i, a]) => {
        if (i.ok) setInstructors(i.data || []);
        if (a.ok) setArts(a.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const disciplineIds = useMemo(() => {
    const ids = new Set<string>();
    instructors.forEach((ins) => {
      (ins.artDisciplineIds || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((id) => ids.add(id));
    });
    return ids;
  }, [instructors]);

  const disciplineOptions = useMemo(
    () => arts.filter((a) => disciplineIds.has(a.id)),
    [arts, disciplineIds]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return instructors;
    return instructors.filter((ins) =>
      (ins.artDisciplineIds || "")
        .split(",")
        .map((s) => s.trim())
        .includes(filter)
    );
  }, [instructors, filter]);

  return (
    <section className="relative pt-28 pb-20 lg:pt-32 lg:pb-28 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Instructors" }]} className="mb-6" />
        <SectionHeading
          eyebrow="The Team"
          title={
            <>
              Our <span className="text-gradient-crimson">Instructors</span>
            </>
          }
          description="Mentors with world-class pedigree — certified under Guro Dan Inosanto and the Inosanto Academy. Our instructors draw from decades of training across stand-up, weaponry and ground arts."
        />

        {/* Filter pills */}
        {disciplineOptions.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter instructors by discipline">
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
              All ({instructors.length})
            </FilterPill>
            {disciplineOptions.map((art) => {
              const count = instructors.filter((ins) =>
                (ins.artDisciplineIds || "")
                  .split(",")
                  .map((s) => s.trim())
                  .includes(art.id)
              ).length;
              return (
                <FilterPill key={art.id} active={filter === art.id} onClick={() => setFilter(art.id)}>
                  {art.name} ({count})
                </FilterPill>
              );
            })}
          </div>
        )}

        {/* Grid */}
        <div className="mt-10">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
              No instructors match this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((ins) => (
                <article
                  key={ins.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate({ name: "instructor", slug: ins.id })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate({ name: "instructor", slug: ins.id });
                    }
                  }}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border/60 cursor-pointer transition-all duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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
                      <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-0.5">
                        {ins.role}
                      </div>
                      <h3 className="font-display text-xl font-bold uppercase text-foreground leading-tight">
                        {ins.name}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-foreground/60 mb-2">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium text-foreground/80">{ins.specialty}</span>
                    </div>
                    <p className="text-xs text-foreground/65 leading-relaxed line-clamp-3">{ins.bio}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:gap-2 transition-all">
                      View profile
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Quote banner */}
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

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-all",
        active
          ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
          : "bg-card border-border text-foreground/70 hover:border-primary/40 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
