"use client";

import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { Users, Trophy, CalendarDays, Globe2, Heart, Award } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

// Animated count-up hook
function useCountUp(target: number, isVisible: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || startedRef.current) return;
    startedRef.current = true;

    // Respect reduced motion — defer setState via microtask to satisfy lint rule
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setCount(target));
      return;
    }

    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, isVisible, duration]);

  return count;
}

const stats = [
  { icon: Users, value: 200, suffix: "+", label: "Active students", sub: "Training this month" },
  { icon: Trophy, value: 35, suffix: "+", label: "Years teaching", sub: "Since 1989" },
  { icon: CalendarDays, value: 17, suffix: "", label: "Weekly classes", sub: "Mon–Sat, 6 days" },
  { icon: Globe2, value: 4, suffix: "", label: "Annual seminars", sub: "With world masters" },
];

const milestones = [
  {
    year: "1989",
    title: "PMAAI founded",
    text: "Sifu Costa opens the doors in Tingalpa with a handful of dedicated students.",
    icon: Award,
  },
  {
    year: "2024",
    title: "200+ active students",
    text: "Our community has grown to over 200 members training across all six disciplines.",
    icon: Users,
  },
  {
    year: "Today",
    title: "Six arts, one family",
    text: "A thriving community of beginners, competitors and black belts training under one roof.",
    icon: Heart,
  },
];

function StatCard({ stat, isVisible, delay }: { stat: typeof stats[0]; isVisible: boolean; delay: number }) {
  const count = useCountUp(stat.value, isVisible);
  return (
    <div
      className={cn(
        "text-center transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="inline-flex h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 items-center justify-center text-primary mb-3">
        <stat.icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="font-display text-4xl lg:text-5xl font-bold text-gradient-crimson leading-none tabular-nums" aria-hidden="true">
        {count}{stat.suffix}
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {stat.label}: {stat.value}{stat.suffix}
      </div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-foreground">{stat.label}</div>
      <div className="text-xs text-foreground/50 mt-0.5">{stat.sub}</div>
    </div>
  );
}

export function CommunityWall() {
  const { ref, isVisible } = useReveal();

  return (
    <section id="community" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-grain opacity-30" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="The PMAAI Family"
          title={<>More than a gym — <span className="text-gradient-gold">a community</span></>}
          description="Numbers tell part of the story. The rest you feel the moment you walk through the door."
        />

        {/* Animated stats */}
        <div
          ref={ref}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} isVisible={isVisible} delay={i * 120} />
          ))}
        </div>

        {/* Milestones */}
        <div className="mt-16 relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 bg-accent" />
              Our story in moments
              <span className="h-px w-8 bg-accent" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={cn(
                  "relative rounded-2xl border border-border/60 bg-card p-6 transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${i * 100 + 400}ms` }}
              >
                {/* Year badge */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-2xl font-bold text-gradient-crimson">{m.year}</span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase mb-2">{m.title}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">{m.text}</p>
                {/* Connector dot */}
                {i < milestones.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 h-6 w-6 rounded-full bg-background border-2 border-border/60 -translate-y-1/2 z-10">
                    <div className="absolute inset-1 rounded-full bg-accent/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Community quote */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <blockquote className="relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-5xl text-primary/20 leading-none">&ldquo;</span>
            <p className="font-display text-xl lg:text-2xl font-medium leading-relaxed text-foreground/90 pt-4">
              I came for the self-defence. I stayed for the people. PMAAI isn&apos;t just where I train — it&apos;s where I belong.
            </p>
            <footer className="mt-4 text-sm text-foreground/60 uppercase tracking-wider">
              — Sara Lin · Student since 2021
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
