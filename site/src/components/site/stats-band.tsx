"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  HeartPulse,
  Users,
  Trophy,
  Clock,
  MapPin,
  GraduationCap,
  HandHeart,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const stats = [
  { value: "35+", label: "Years teaching", sub: "Since 1989" },
  { value: "6", label: "Martial arts", sub: "Stand-up · Weaponry · Ground" },
  { value: "4", label: "Certified instructors", sub: "Inosanto lineage" },
  { value: "17", label: "Weekly classes", sub: "Mon – Sat" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Authentic self-defence",
    text: "Real techniques tested under pressure — not choreographed dance. Every drill has a purpose rooted in combat reality.",
    color: "text-primary",
  },
  {
    icon: HeartPulse,
    title: "Built for every body",
    text: "No fitness prerequisite. Martial arts gets you fit — you don't need to be fit to start. We scale to you.",
    color: "text-accent",
  },
  {
    icon: Users,
    title: "Ego-free community",
    text: "From first-timers to black belts, everyone trains with respect. No meathead culture, no intimidation, no judgement.",
    color: "text-emerald-400",
  },
  {
    icon: Trophy,
    title: "Proven lineage",
    text: "Directly certified under Guro Dan Inosanto and the Inosanto Academy. Knowledge passed hand-to-hand for decades.",
    color: "text-primary",
  },
  {
    icon: Clock,
    title: "Flexible training",
    text: "17 classes a week across 6 days plus a 24/7 strength gym. Train around your life, not the other way around.",
    color: "text-accent",
  },
  {
    icon: GraduationCap,
    title: "Progressive system",
    text: "A curriculum that absorbs what works from every art. Build a complete game across stand-up, weaponry and ground.",
    color: "text-emerald-400",
  },
  {
    icon: MapPin,
    title: "One roof, everything",
    text: "Martial arts dojo and 24/7 Progressive Strength gym side by side in Tingalpa. One membership, complete training.",
    color: "text-primary",
  },
  {
    icon: HandHeart,
    title: "Family-friendly",
    text: "From Mini Muscles (age 5) to senior practitioners — a genuine community where families grow together on the mat.",
    color: "text-accent",
  },
];

function CountUp({ value, suffix }: { value: string; suffix?: string }) {
  const [n, setN] = useState(value);
  return <span>{n}{suffix}</span>;
}

export function StatsBand() {
  return (
    <section className="relative py-16 lg:py-20 border-y border-border/60 bg-gradient-to-b from-secondary/20 to-background">
      <div className="absolute inset-0 -z-10 bg-grain opacity-40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {stats.map((s, i) => (
            <div key={s.label} className="text-center relative group">
              {i < stats.length - 1 && (
                <span className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 h-12 w-px bg-border/60" />
              )}
              <div className="font-display text-5xl lg:text-6xl font-bold text-gradient-crimson leading-none">
                <CountUp value={s.value} />
              </div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-foreground">{s.label}</div>
              <div className="text-xs text-foreground/50 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Why PMAAI */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Why train with us
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
            More than a gym. <span className="text-gradient-gold">A lineage.</span>
          </h2>
          <p className="mt-4 text-foreground/70">
            We don&apos;t just teach techniques — we build complete martial artists
            with a deep foundation and a supportive community for life.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="group rounded-xl border border-border/60 bg-card/60 p-5 hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className={`h-11 w-11 rounded-lg bg-secondary/60 border border-border/60 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${v.color}`}>
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground text-sm leading-snug mb-1.5">{v.title}</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
