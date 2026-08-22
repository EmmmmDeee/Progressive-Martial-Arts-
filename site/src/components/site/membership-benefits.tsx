"use client";

import { useReveal } from "@/hooks/use-reveal";
import {
  Gift,
  Dumbbell,
  Users,
  GraduationCap,
  Calendar,
  Tag,
  Heart,
  Trophy,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

const perks = [
  {
    icon: Dumbbell,
    title: "24/7 Progressive Strength access",
    text: "Unlimited members get round-the-clock entry to our on-site strength gym — train whenever suits you.",
    tier: "Unlimited & Family",
  },
  {
    icon: Tag,
    title: "10% off the PMAAI shop",
    text: "Member pricing on all apparel, equipment and seminar media. Gloves, wraps, rash guards and more.",
    tier: "All paid plans",
  },
  {
    icon: Calendar,
    title: "Priority seminar access",
    text: "First dibs on spots for Guro Dan Inosanto, Sifu Francis Fong and Machado seminars — they sell out fast.",
    tier: "Unlimited & Family",
  },
  {
    icon: GraduationCap,
    title: "Free belt grading & testing",
    text: "No hidden fees for progression. Your belt promotions are included in your membership, always.",
    tier: "Unlimited & Family",
  },
  {
    icon: Gift,
    title: "Bring-a-friend passes",
    text: "Unlimited members get monthly guest passes — bring a mate to try a class, on us.",
    tier: "Unlimited",
  },
  {
    icon: Users,
    title: "Family-friendly community",
    text: "Train alongside your family. Family plans include Mini Muscles for the kids and adult classes for you.",
    tier: "Family",
  },
  {
    icon: Heart,
    title: "Concession & student discounts",
    text: "10% off all plans for students, seniors and pensioners. Everyone deserves to train.",
    tier: "All plans",
  },
  {
    icon: Trophy,
    title: "Competition support",
    text: "Coaching, cornering and fight-camp prep for members who want to compete — at no extra cost.",
    tier: "Unlimited",
  },
];

const tierColor: Record<string, string> = {
  "Unlimited & Family": "border-primary/30 text-primary bg-primary/10",
  "All paid plans": "border-accent/30 text-accent bg-accent/10",
  "All plans": "border-accent/30 text-accent bg-accent/10",
  Unlimited: "border-primary/30 text-primary bg-primary/10",
  Family: "border-pink-500/30 text-pink-400 bg-pink-500/10",
};

export function MembershipBenefits() {
  const { ref, isVisible } = useReveal();

  return (
    <section id="benefits" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-stripes opacity-20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="More Than Classes"
          title={<>What your membership <span className="text-gradient-gold">includes</span></>}
          description="No lock-in contracts. No joining fees. Cancel anytime. But while you're with us, you get real value — not just mat time."
        />

        <div
          ref={ref}
          className={`mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal ${isVisible ? "is-visible" : ""}`}
        >
          {perks.map((perk, i) => (
            <div
              key={perk.title}
              className="group relative rounded-xl border border-border/60 bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <perk.icon className="h-5 w-5" />
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${tierColor[perk.tier] || "border-border text-foreground/60 bg-secondary/40"}`}>
                  {perk.tier}
                </span>
              </div>
              <h3 className="font-semibold text-foreground text-sm leading-snug mb-1.5">{perk.title}</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">{perk.text}</p>
            </div>
          ))}
        </div>

        {/* Guarantee band */}
        <div className="mt-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/15 via-card to-accent/10 border border-border/60 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold uppercase">The PMAAI Guarantee</h3>
                <p className="text-sm text-foreground/70 mt-1 max-w-md">
                  If you don&apos;t love your first month, we&apos;ll refund your membership in full. No questions, no hassle — just honest training.
                </p>
              </div>
            </div>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2.5 transition-colors shrink-0"
            >
              See all plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
