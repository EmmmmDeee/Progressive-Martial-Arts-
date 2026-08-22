"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw, Target, Zap, Heart, Swords, Shield, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/site/section-heading";
import { RouteLink } from "@/lib/router";
import type { ArtDisciplineT } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

type Question = {
  id: string;
  text: string;
  options: { label: string; icon: typeof Target; scores: Record<string, number> }[];
};

const questions: Question[] = [
  {
    id: "goal",
    text: "What's your main goal?",
    options: [
      { label: "Self-defence", icon: Shield, scores: { "brazilian-jiu-jitsu": 3, kali: 2, "jeet-kune-do": 2, "jun-fan-gung-fu": 1 } },
      { label: "Get fit & lose weight", icon: Heart, scores: { "muay-thai": 3, "brazilian-jiu-jitsu": 2 } },
      { label: "Compete / fight", icon: Zap, scores: { "muay-thai": 3, "brazilian-jiu-jitsu": 3 } },
      { label: "Learn weaponry", icon: Swords, scores: { kali: 3, "maphilindo-silat": 2 } },
    ],
  },
  {
    id: "range",
    text: "Which range interests you most?",
    options: [
      { label: "Striking (stand-up)", icon: Zap, scores: { "muay-thai": 3, "jeet-kune-do": 2, "jun-fan-gung-fu": 1 } },
      { label: "Ground fighting", icon: Shield, scores: { "brazilian-jiu-jitsu": 3 } },
      { label: "Weapons", icon: Swords, scores: { kali: 3, "maphilindo-silat": 2 } },
      { label: "All ranges", icon: Target, scores: { "jeet-kune-do": 3, "jun-fan-gung-fu": 2 } },
    ],
  },
  {
    id: "style",
    text: "What training style appeals to you?",
    options: [
      { label: "High intensity, cardio-heavy", icon: Zap, scores: { "muay-thai": 3 } },
      { label: "Technical, strategic, leverage-based", icon: Target, scores: { "brazilian-jiu-jitsu": 3, "maphilindo-silat": 1 } },
      { label: "Flowing, reflex-based, dynamic", icon: Sparkles, scores: { kali: 3, "jeet-kune-do": 1 } },
      { label: "Philosophical, efficient, direct", icon: Shield, scores: { "jeet-kune-do": 3, "jun-fan-gung-fu": 2 } },
    ],
  },
  {
    id: "experience",
    text: "Your experience level?",
    options: [
      { label: "Complete beginner", icon: Heart, scores: { "muay-thai": 2, "brazilian-jiu-jitsu": 2, "jun-fan-gung-fu": 2 } },
      { label: "Some training", icon: Target, scores: { kali: 2, "jeet-kune-do": 2, "maphilindo-silat": 1 } },
      { label: "Experienced martial artist", icon: Swords, scores: { "maphilindo-silat": 2, "jeet-kune-do": 2, kali: 1 } },
    ],
  },
];

const focusLabels: Record<string, string> = {
  "Stand-up": "Stand-up striking",
  Weaponry: "Filipino weaponry",
  Ground: "Ground fighting",
};

export function DisciplineSelector() {
  const [arts, setArts] = useState<ArtDisciplineT[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/arts")
      .then((r) => r.json())
      .then((res) => setArts(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function selectOption(option: Question["options"][number]) {
    const newScores = { ...scores };
    for (const [slug, pts] of Object.entries(option.scores)) {
      newScores[slug] = (newScores[slug] || 0) + pts;
    }
    setScores(newScores);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // determine winner
      const winner = Object.entries(newScores).sort(([, a], [, b]) => b - a)[0]?.[0] || null;
      setResult(winner);
    }
  }

  function reset() {
    setStep(0);
    setScores({});
    setResult(null);
  }

  const winnerArt = result ? arts.find((a) => a.slug === result) : null;
  const progress = result ? 100 : (step / questions.length) * 100;

  return (
    <section id="discipline-selector" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-grain opacity-30" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Not Sure Where To Start?"
          title={<>Find your <span className="text-gradient-crimson">perfect martial art</span></>}
          description="Answer 4 quick questions and we'll recommend the discipline that fits your goals, style and experience. Takes 30 seconds."
        />

        <div className="mt-10 relative rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xl shadow-black/20">
          {/* Progress bar */}
          <div className="h-1 bg-secondary/60">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : result && winnerArt ? (
              /* Result screen */
              <div className="text-center animate-fade-up">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 border border-accent/30 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-accent" />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">Your match</div>
                <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase leading-tight">
                  <span className="text-gradient-gold">{winnerArt.name}</span>
                </h3>
                {winnerArt.tagline && (
                  <p className="mt-2 text-foreground/70 italic">&ldquo;{winnerArt.tagline}&rdquo;</p>
                )}
                <p className="mt-4 text-sm text-foreground/70 leading-relaxed max-w-lg mx-auto">
                  {winnerArt.suitability || winnerArt.description}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-primary/30 text-primary">{focusLabels[winnerArt.focus] || winnerArt.focus}</Badge>
                  <Badge variant="outline" className="border-accent/30 text-accent">Origin: {winnerArt.origin}</Badge>
                  <Badge variant="outline" className="border-border text-foreground/70">{winnerArt.difficulty}</Badge>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <RouteLink to={{ name: "program", slug: winnerArt.slug }}>
                    <Button className="bg-primary hover:bg-primary/90 group w-full sm:w-auto">
                      Explore {winnerArt.name}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </RouteLink>
                  <a href="#contact">
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 w-full sm:w-auto">
                      Book a free trial
                    </Button>
                  </a>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-accent transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Retake the quiz
                </button>
              </div>
            ) : (
              /* Question screen */
              <div className="animate-fade-up" key={step}>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                    Question {step + 1} of {questions.length}
                  </div>
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="text-xs text-foreground/50 hover:text-foreground transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase mb-6">
                  {questions[step].text}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {questions[step].options.map((option, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Select answer: ${option.label}`}
                      onClick={() => selectOption(option)}
                      className="group flex items-center gap-4 rounded-xl border border-border/60 bg-secondary/40 p-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-all hover:-translate-y-0.5"
                    >
                      <div className="h-11 w-11 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all">
                        <option.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-foreground text-sm flex-1">{option.label}</span>
                      <ArrowRight className="h-4 w-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
