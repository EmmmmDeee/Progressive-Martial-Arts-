"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { ChevronRight, Award, Clock, Target } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

type Belt = {
  name: string;
  color: string; // tailwind bg class or hex
  duration: string;
  focus: string;
  skills: string[];
};

const bjjBelts: Belt[] = [
  {
    name: "White",
    color: "#e5e5e5",
    duration: "0–1 year",
    focus: "Survival & fundamentals",
    skills: ["Positional escapes", "Basic submissions", "Defensive posture", "Breathing under pressure"],
  },
  {
    name: "Blue",
    color: "#3b82f6",
    duration: "1–2 years",
    focus: "Technical development",
    skills: ["Guard retention", "Sweeps from closed guard", "Basic leg locks", "Transition chains"],
  },
  {
    name: "Purple",
    color: "#a855f7",
    duration: "2–4 years",
    focus: "Personal game development",
    skills: ["Signature positions", "Advanced submission chains", "Counter-game", "Competition strategy"],
  },
  {
    name: "Brown",
    color: "#92400e",
    duration: "4–6 years",
    focus: "Refinement & teaching",
    skills: ["Pressure & timing mastery", "Teaching fundamentals", "Competition mastery", "Self-correction"],
  },
  {
    name: "Black",
    color: "#0a0a0a",
    duration: "6–10 years",
    focus: "Mastery & mentorship",
    skills: ["Complete game", "Coaching certification", "Lineage preservation", "Lifelong learning"],
  },
];

const muayThaiBelts: Belt[] = [
  {
    name: "Beginner",
    color: "#10b981",
    duration: "0–6 months",
    focus: "Foundations & fitness",
    skills: ["Stance & guard", "Basic strikes (jab, cross)", "Teep & round kick", "Pad holding basics"],
  },
  {
    name: "Novice",
    color: "#3b82f6",
    duration: "6–18 months",
    focus: "Technique & combinations",
    skills: ["Elbows & knees", "Clinch entries", "Defensive checks & slips", "Combination flow"],
  },
  {
    name: "Intermediate",
    color: "#a855f7",
    duration: "1–3 years",
    focus: "Timing & strategy",
    skills: ["Counter-fighting", "Clinch sweeps", "Distance management", "Sparring control"],
  },
  {
    name: "Advanced",
    color: "#f59e0b",
    duration: "3–5 years",
    focus: "Competition & mastery",
    skills: ["Fight IQ", "Ring craft", "Competition preparation", "Teaching basics"],
  },
  {
    name: "Kru",
    color: "#dc2626",
    duration: "5+ years",
    focus: "Teaching & lineage",
    skills: ["Kru certification (WMC)", "Cornering fighters", "Curriculum design", "Academy leadership"],
  },
];

const disciplines = [
  { id: "bjj", name: "Brazilian Jiu Jitsu", belts: bjjBelts, image: "/images/art-bjj.jpg" },
  { id: "muay-thai", name: "Muay Thai", belts: muayThaiBelts, image: "/images/art-muay-thai.jpg" },
];

export function BeltProgression() {
  const [active, setActive] = useState("bjj");
  const [selectedBelt, setSelectedBelt] = useState(0);
  const { ref, isVisible } = useReveal();

  const activeDiscipline = disciplines.find((d) => d.id === active)!;
  const belts = activeDiscipline.belts;
  const currentBelt = belts[selectedBelt];

  return (
    <section id="progression" className="relative py-20 lg:py-28 bg-secondary/20">
      <div className="absolute inset-0 -z-10 bg-grain opacity-30" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Your Journey"
          title={<>The road to <span className="text-gradient-gold">mastery</span></>}
          description="Every black belt was once a white belt who refused to quit. See the path ahead — what you'll learn, how long it takes, and what each grade really means."
        />

        {/* Discipline switcher */}
        <div className="mt-10 flex justify-center gap-2" role="tablist" aria-label="Select discipline to view belt progression">
          {disciplines.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={active === d.id}
              aria-controls="belt-detail-panel"
              onClick={() => {
                setActive(d.id);
                setSelectedBelt(0);
              }}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-all border",
                active === d.id
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card border-border text-foreground/70 hover:border-primary/40 hover:text-foreground"
              )}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div
          ref={ref}
          className={cn("mt-10 reveal", isVisible && "is-visible")}
        >
          {/* Belt timeline */}
          <div className="relative">
            {/* Horizontal connector line */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-border/60" />
            <div
              className="hidden md:block absolute top-6 left-[10%] h-0.5 bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700"
              style={{ width: `${(selectedBelt / (belts.length - 1)) * 80}%` }}
            />

            {/* Belt nodes */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-2" role="tablist" aria-label={`${activeDiscipline.name} belt grades`}>
              {belts.map((belt, i) => (
                <button
                  key={belt.name}
                  type="button"
                  role="tab"
                  aria-selected={selectedBelt === i}
                  aria-label={`${belt.name} belt — ${belt.duration}, focus: ${belt.focus}`}
                  onClick={() => setSelectedBelt(i)}
                  className="group relative flex flex-col items-center"
                >
                  {/* Belt icon */}
                  <div
                    className={cn(
                      "relative h-12 w-12 md:h-12 md:w-12 rounded-full border-4 transition-all duration-300",
                      selectedBelt === i
                        ? "scale-125 shadow-xl ring-4 ring-primary/20"
                        : "group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    )}
                    style={{ backgroundColor: belt.color, borderColor: "var(--card)" }}
                  >
                    {selectedBelt === i && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent ring-2 ring-card flex items-center justify-center">
                        <ChevronRight className="h-2.5 w-2.5 text-accent-foreground rotate-90" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  {/* Belt name */}
                  <div className="mt-2 text-center">
                    <div className={cn(
                      "text-xs font-semibold uppercase tracking-wide transition-colors",
                      selectedBelt === i ? "text-foreground" : "text-foreground/50"
                    )}>
                      {belt.name}
                    </div>
                    <div className="text-[10px] text-foreground/40 hidden md:block">{belt.duration}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected belt detail */}
          <div key={selectedBelt} id="belt-detail-panel" role="tabpanel" aria-live="polite" className="mt-8 rounded-2xl border border-border/60 bg-card p-6 lg:p-8 animate-fade-up">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: belt identity */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-16 w-3 rounded-full shadow-lg"
                    style={{ backgroundColor: currentBelt.color }}
                  />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                      {activeDiscipline.name} · Grade {selectedBelt + 1} of {belts.length}
                    </div>
                    <h3 className="font-display text-3xl font-bold uppercase leading-tight">{currentBelt.name}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-foreground/60">Typical duration:</span>
                    <span className="font-semibold text-foreground">{currentBelt.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-foreground/60">Focus:</span>
                    <span className="font-semibold text-foreground">{currentBelt.focus}</span>
                  </div>
                </div>
              </div>

              {/* Right: skills */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-primary" />
                  <h4 className="font-display text-sm font-bold uppercase tracking-wide">What you&apos;ll develop</h4>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {currentBelt.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2 rounded-lg bg-secondary/40 border border-border/40 px-3 py-2 text-sm text-foreground/80"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {skill}
                    </div>
                  ))}
                </div>
                {/* Progress note */}
                <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-foreground/70 leading-relaxed">
                  {selectedBelt === 0 && "Every student starts here. Your first class is free — just turn up, we'll handle the rest."}
                  {selectedBelt > 0 && selectedBelt < belts.length - 1 && `Progression from ${belts[selectedBelt - 1].name} to ${currentBelt.name} typically takes ${currentBelt.duration}. Consistency — 2-3 sessions per week — is the key.`}
                  {selectedBelt === belts.length - 1 && `The ${currentBelt.name} grade represents years of dedicated training. At this level you're not just a student — you're a custodian of the lineage, ready to teach the next generation.`}
                </div>
              </div>
            </div>

            {/* Navigation hint */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-foreground/40">
              <button
                type="button"
                onClick={() => setSelectedBelt(Math.max(0, selectedBelt - 1))}
                disabled={selectedBelt === 0}
                className="hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous grade
              </button>
              <span>Tap any belt above to explore</span>
              <button
                type="button"
                onClick={() => setSelectedBelt(Math.min(belts.length - 1, selectedBelt + 1))}
                disabled={selectedBelt === belts.length - 1}
                className="hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next grade →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
