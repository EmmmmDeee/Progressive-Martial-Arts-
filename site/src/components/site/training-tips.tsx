"use client";

import { useEffect, useState, useCallback } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { Lightbulb, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

const tips = [
  {
    category: "Mindset",
    title: "Show up consistently",
    text: "Two sessions a week for a year beats six sessions a week for a month. Martial arts rewards consistency above intensity. Build the habit first, then build the skill.",
    accent: "from-primary/20",
  },
  {
    category: "Technique",
    title: "Slow is smooth, smooth is fast",
    text: "Don't rush new techniques. Practise slowly with perfect form until the movement is automatic. Speed comes from efficiency, not effort. Rushed reps build bad habits.",
    accent: "from-accent/20",
  },
  {
    category: "Recovery",
    title: "Sleep is your secret weapon",
    text: "Your body adapts during rest, not during training. Seven hours of sleep will do more for your progression than any supplement. Treat recovery as part of your training.",
    accent: "from-emerald-500/20",
  },
  {
    category: "Sparring",
    title: "Leave your ego at the door",
    text: "Sparring is learning, not winning. Tap early, tap often. The student who taps the most learns the most. Save the wars for competition — on the mat, we're all friends.",
    accent: "from-pink-500/20",
  },
  {
    category: "Gear",
    title: "Invest in good hand wraps",
    text: "Your hands are your tools. Cheap gloves are fine to start, but 180-inch hand wraps protect your knuckles and wrists from day one. Never skip the wraps.",
    accent: "from-primary/20",
  },
  {
    category: "Nutrition",
    title: "Eat to train, don't train to eat",
    text: "A light meal 90 minutes before training fuels your session without weighing you down. Hydrate throughout the day, not just before class. Small habits compound.",
    accent: "from-accent/20",
  },
  {
    category: "Mindset",
    title: "Compare yourself to yesterday",
    text: "Don't measure your progress against the black belts — measure it against your first week. Celebrate small wins. The journey is long; enjoy the road.",
    accent: "from-emerald-500/20",
  },
];

const categoryColor: Record<string, string> = {
  Mindset: "bg-primary/15 text-primary border-primary/30",
  Technique: "bg-accent/15 text-accent border-accent/30",
  Recovery: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Sparring: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  Gear: "bg-primary/15 text-primary border-primary/30",
  Nutrition: "bg-accent/15 text-accent border-accent/30",
};

export function TrainingTips() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const { ref, isVisible } = useReveal();

  const next = useCallback(() => setActive((i) => (i + 1) % tips.length), []);
  const prev = useCallback(() => setActive((i) => (i - 1 + tips.length) % tips.length), []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [playing, next]);

  const tip = tips[active];

  return (
    <section id="tips" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-stripes opacity-20" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="From the Coaches"
          title={<>Training <span className="text-gradient-crimson">tips</span> that stick</>}
          description="Bite-sized wisdom from our instructors — the kind of advice that makes the difference between progress and plateau."
        />

        <div
          ref={ref}
          className={cn(
            "mt-10 relative overflow-hidden rounded-2xl border border-border/60 bg-card reveal",
            isVisible && "is-visible"
          )}
        >
          {/* Gradient accent strip */}
          <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-30 pointer-events-none transition-all duration-700", tip.accent)} />

          <div className="relative p-6 lg:p-10 min-h-[280px] flex flex-col justify-center">
            {/* Tip number + category */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div>
                  <span className={cn("inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border", categoryColor[tip.category])}>
                    {tip.category}
                  </span>
                  <div className="text-[10px] text-foreground/40 mt-1">Tip {active + 1} of {tips.length}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPlaying(!playing)}
                aria-label={playing ? "Pause" : "Play"}
                className="h-9 w-9 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center text-foreground/60 hover:text-primary transition-colors"
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
            </div>

            {/* Tip content (keyed for re-animation) */}
            <div key={active} className="animate-fade-up">
              <h3 className="font-display text-2xl lg:text-3xl font-bold uppercase leading-tight mb-3">
                {tip.title}
              </h3>
              <p className="text-foreground/75 leading-relaxed text-base lg:text-lg max-w-2xl">
                {tip.text}
              </p>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1.5">
                {tips.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to tip ${i + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === active ? "w-8 bg-primary" : "w-1.5 bg-foreground/20 hover:bg-foreground/40"
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous tip"
                  className="h-9 w-9 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center text-foreground/60 hover:text-primary transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next tip"
                  className="h-9 w-9 rounded-full border border-border hover:border-primary/40 hover:bg-primary/5 flex items-center justify-center text-foreground/60 hover:text-primary transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
