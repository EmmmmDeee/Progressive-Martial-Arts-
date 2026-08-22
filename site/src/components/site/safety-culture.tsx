"use client";

import { useReveal } from "@/hooks/use-reveal";
import { ShieldCheck, HeartHandshake, Accessibility, Baby, Users2, Stethoscope } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { cn } from "@/lib/utils";

const assurances = [
  {
    icon: ShieldCheck,
    title: "Safety is rule one",
    text: "Every class is supervised by certified instructors. Techniques are taught progressively, sparring is optional and controlled, and we have first-aid-trained staff on site. Injuries are rare and minor.",
    stat: "0 serious injuries",
    statLabel: "in 35+ years",
  },
  {
    icon: HeartHandshake,
    title: "Ego-free culture",
    text: "No meatheads, no intimidation, no judgement. We've all been the new person. Every student — from day-one beginner to black belt — trains with respect and humility. Tap early, learn fast.",
    stat: "100%",
    statLabel: "ego-free guarantee",
  },
  {
    icon: Accessibility,
    title: "Every body welcome",
    text: "No fitness prerequisite. Martial arts gets you fit — you don't need to be fit to start. We scale every drill to your level, your body, your goals. All ages, all sizes, all backgrounds.",
    stat: "Ages 5–75",
    statLabel: "currently training",
  },
  {
    icon: Baby,
    title: "Kids are protected",
    text: "All kids coaches hold Working With Children checks (Blue Cards). Class sizes are capped for quality attention. Parents are welcome to watch from our viewing area.",
    stat: "Blue Card",
    statLabel: "verified coaches",
  },
  {
    icon: Users2,
    title: "Women feel welcome",
    text: "A genuine, safe environment for women. Our female lead coach (Amy) runs women-friendly sessions. No creepy behaviour, no differential treatment — just training partners.",
    stat: "40%+",
    statLabel: "growth in women students",
  },
  {
    icon: Stethoscope,
    title: "Injury-aware coaching",
    text: "Got a bad back, dodgy knee or old injury? Tell us. Our coaches modify techniques around your limitations. We'd rather you train for 20 years than push through and quit in 6 months.",
    stat: "Personalised",
    statLabel: "modifications available",
  },
];

export function SafetyCulture() {
  const { ref, isVisible } = useReveal();

  return (
    <section id="safety" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-stripes opacity-20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Safety & Culture"
          title={<>Train with <span className="text-gradient-gold">confidence</span></>}
          description="We know walking into a martial arts gym can feel intimidating. Here's our promise: you'll be safe, respected and supported — from your very first class to your hundredth."
        />

        <div
          ref={ref}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal"
        >
          {assurances.map((a, i) => (
            <div
              key={a.title}
              className={cn("transition-all duration-500", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="group relative h-full rounded-2xl border border-border/60 bg-card p-6 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <a.icon className="h-6 w-6" />
                  </div>
                  {/* Stat badge */}
                  <div className="text-right">
                    <div className="font-display text-lg font-bold text-gradient-crimson leading-none">{a.stat}</div>
                    <div className="text-[9px] uppercase tracking-wider text-foreground/40 mt-0.5">{a.statLabel}</div>
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-2">{a.title}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">{a.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust banner */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-card to-card border border-emerald-500/20 p-6 lg:p-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div className="text-left">
              <h3 className="font-display text-xl font-bold uppercase">Our promise to you</h3>
              <p className="text-sm text-foreground/70 mt-1 max-w-2xl">
                If you ever feel unsafe, disrespected or uncomfortable at PMAAI, tell us immediately. We will fix it — no exceptions, no excuses. Everyone deserves to train in peace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
