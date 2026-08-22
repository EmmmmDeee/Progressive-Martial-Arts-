"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { Clock, Footprints, Users, Dumbbell, Brain, Wind, Sparkles, Play } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

type Phase = {
  time: string;
  duration: string;
  title: string;
  icon: typeof Clock;
  description: string;
  detail: string;
  color: string;
};

const phases: Phase[] = [
  {
    time: "0:00",
    duration: "10 min",
    title: "Warm-up & mobility",
    icon: Footprints,
    description: "Skipping, shadow boxing and dynamic stretching to prepare your body.",
    detail: "We start every class with a structured warm-up that raises your heart rate and mobilises the joints you'll use. This prevents injury and primes your nervous system for learning. No cold starts — ever.",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    time: "0:10",
    duration: "15 min",
    title: "Technique instruction",
    icon: Brain,
    description: "Coach demonstrates the day's technique; you drill it slowly with a partner.",
    detail: "The heart of every class. Your coach breaks down a specific technique — a strike, escape, sweep or entry — explains the mechanics, demonstrates it, and then you drill it with a partner at controlled speed. Questions encouraged.",
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    time: "0:25",
    duration: "30 min",
    title: "Pad work & application",
    icon: Dumbbell,
    description: "Apply the technique with resistance on pads, bags or in drills.",
    detail: "Now you put it into action. Pad work with a partner, bag rounds, or specific sparring drills that let you test the technique against a moving, reacting opponent — at an intensity scaled to your level.",
    color: "text-accent bg-accent/10 border-accent/20",
  },
  {
    time: "0:55",
    duration: "15 min",
    title: "Sparring (optional)",
    icon: Users,
    description: "Live rounds for experienced students. Beginners continue drilling.",
    detail: "For those ready, supervised sparring lets you integrate everything under pressure. New students continue structured drilling — sparring is always optional and earned, never forced. Safety and control come first.",
    color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  },
  {
    time: "1:10",
    duration: "10 min",
    title: "Conditioning",
    icon: Sparkles,
    description: "Core, strength and cardio circuits to build fight-ready fitness.",
    detail: "Finish strong with a conditioning block — kettlebell circuits, core work, battle ropes or bodyweight intervals. This is where the engine gets built. Scaled to all fitness levels.",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    time: "1:20",
    duration: "10 min",
    title: "Cool-down & review",
    icon: Wind,
    description: "Static stretching, breathing and a quick technique recap with the coach.",
    detail: "We close every class with a proper cool-down — stretching the muscles you worked, bringing your heart rate down, and a brief recap of the day's technique. This is also when students ask questions and the coach gives individual feedback.",
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
];

export function ClassExperience() {
  const [activePhase, setActivePhase] = useState(0);
  const { ref, isVisible } = useReveal();
  const phase = phases[activePhase];

  return (
    <section id="class-experience" className="relative py-20 lg:py-28 bg-secondary/20">
      <div className="absolute inset-0 -z-10 bg-grain opacity-30" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Inside A Class"
          title={<>90 minutes, <span className="text-gradient-crimson">six phases</span></>}
          description="Every PMAAI class follows a proven structure. Tap through the phases to see exactly what happens, minute by minute — no surprises on day one."
        />

        <div
          ref={ref}
          className={cn("mt-12 grid lg:grid-cols-5 gap-8 reveal", isVisible && "is-visible")}
        >
          {/* Left: phase selector (vertical timeline) */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Vertical connector */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border/60" />
              <div
                className="absolute left-6 top-6 w-0.5 bg-gradient-to-b from-primary via-accent to-primary transition-all duration-500"
                style={{ height: `${(activePhase / (phases.length - 1)) * 100}%` }}
              />

              <div className="space-y-2" role="tablist" aria-label="Class phases">
                {phases.map((p, i) => (
                  <button
                    key={p.time}
                    type="button"
                    role="tab"
                    aria-selected={activePhase === i}
                    aria-label={`Phase ${i + 1}: ${p.title} at ${p.time}, ${p.duration}`}
                    aria-controls="class-phase-detail"
                    onClick={() => setActivePhase(i)}
                    className={cn(
                      "relative flex items-center gap-4 w-full text-left p-3 rounded-lg transition-all group",
                      activePhase === i ? "bg-card shadow-lg" : "hover:bg-card/50"
                    )}
                  >
                    {/* Node */}
                    <div className={cn(
                      "relative z-10 h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                      activePhase === i
                        ? "bg-card border-primary scale-110 shadow-lg shadow-primary/20"
                        : "bg-background border-border group-hover:border-primary/40"
                    )}>
                      <p.icon className={cn(
                        "h-5 w-5 transition-colors",
                        activePhase === i ? "text-primary" : "text-foreground/40 group-hover:text-foreground/70"
                      )} />
                    </div>
                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className={cn(
                          "font-display text-sm font-bold tabular-nums",
                          activePhase === i ? "text-foreground" : "text-foreground/50"
                        )}>
                          {p.time}
                        </span>
                        <span className="text-[10px] text-foreground/40 uppercase tracking-wide">{p.duration}</span>
                      </div>
                      <div className={cn(
                        "text-sm font-medium truncate transition-colors",
                        activePhase === i ? "text-foreground" : "text-foreground/60"
                      )}>
                        {p.title}
                      </div>
                    </div>
                    {activePhase === i && (
                      <Play className="h-3 w-3 text-primary shrink-0 fill-current" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: active phase detail */}
          <div className="lg:col-span-3">
            <div key={activePhase} id="class-phase-detail" role="tabpanel" aria-live="polite" className="rounded-2xl border border-border/60 bg-card p-6 lg:p-8 animate-fade-up h-full">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className={cn("h-14 w-14 rounded-xl border flex items-center justify-center shrink-0", phase.color)}>
                  <phase.icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs font-semibold text-accent">{phase.time} · {phase.duration}</span>
                    <span className="text-[10px] text-foreground/40 uppercase tracking-wider">
                      Phase {activePhase + 1} of {phases.length}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase leading-tight">{phase.title}</h3>
                </div>
              </div>

              {/* Short description */}
              <p className="text-foreground/70 leading-relaxed mb-4">{phase.description}</p>

              {/* Detail */}
              <div className="rounded-lg bg-secondary/40 border border-border/40 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold mb-2">
                  What actually happens
                </div>
                <p className="text-sm text-foreground/75 leading-relaxed">{phase.detail}</p>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-foreground/50 mb-2">
                  <span>Class progress</span>
                  <span>{Math.round(((activePhase + 1) / phases.length) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500"
                    style={{ width: `${((activePhase + 1) / phases.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Nav */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActivePhase(Math.max(0, activePhase - 1))}
                  disabled={activePhase === 0}
                  className="text-xs text-foreground/50 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Previous phase
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhase(Math.min(phases.length - 1, activePhase + 1))}
                  disabled={activePhase === phases.length - 1}
                  className="text-xs text-foreground/50 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next phase →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
