import {
  CalendarCheck,
  Footprints,
  Shirt,
  Users,
  Dumbbell,
  PartyPopper,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";

const steps = [
  {
    n: "01",
    icon: CalendarCheck,
    title: "Book your free trial",
    text: "Use the contact form below or call (07) 3393 9329. Tell us your goals and which art interests you — or ask us to recommend one. Your first class is 100% free, no commitment.",
    accent: "from-primary/20",
  },
  {
    n: "02",
    icon: Shirt,
    title: "Arrive 15 minutes early",
    text: "Come a little early so we can show you around the academy, introduce you to your instructor, and lend you any gear you need for the session (gloves, wraps, sticks — all free to loan).",
    accent: "from-accent/20",
  },
  {
    n: "03",
    icon: Footprints,
    title: "Train at your pace",
    text: "Wear comfortable workout clothes and a water bottle. Every drill is scaled to your level — you'll learn the fundamentals alongside other beginners, no pressure to keep up.",
    accent: "from-emerald-500/20",
  },
  {
    n: "04",
    icon: Users,
    title: "Meet the community",
    text: "After class, chat with your instructor and fellow students. PMAAI is ego-free and welcoming — we've all been the new person on day one. Ask anything you like.",
    accent: "from-pink-500/20",
  },
  {
    n: "05",
    icon: Dumbbell,
    title: "Pick your membership",
    text: "If you loved it (you will), choose a plan that fits your life — casual, single-art, or unlimited. No lock-in contracts, no joining fees. Concession and family discounts available.",
    accent: "from-primary/20",
  },
  {
    n: "06",
    icon: PartyPopper,
    title: "Start your journey",
    text: "That's it. You're a PMAAI student. Train 2–3 times a week and watch yourself transform — fitter, more confident, more capable. Every black belt started exactly where you are now.",
    accent: "from-accent/20",
  },
];

export function FirstVisit() {
  return (
    <section id="first-visit" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-stripes opacity-20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Your First Class"
          title={<>What to expect on <span className="text-gradient-crimson">day one</span></>}
          description="Nervous? That's normal — and it fades by minute five of your first class. Here's exactly how your journey begins, step by step."
        />

        <div className="mt-14 relative">
          {/* Vertical line connector (desktop) */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

          <div className="space-y-6 lg:space-y-0">
            {steps.map((step, idx) => (
              <div
                key={step.n}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center ${
                  idx % 2 === 1 ? "lg:[direction:rtl]" : ""
                }`}
              >
                <div className={`lg:[direction:ltr] ${idx % 2 === 1 ? "lg:pl-12" : "lg:pr-12 lg:text-right"}`}>
                  <div className={`group relative rounded-2xl border border-border/60 bg-card p-6 lg:p-8 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden ${idx % 2 === 1 ? "" : ""}`}>
                    {/* Gradient accent */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.accent} to-transparent opacity-50 pointer-events-none`} />
                    <div className="relative flex items-start gap-4">
                      <div className={`shrink-0 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                        <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <step.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className={`flex-1 ${idx % 2 === 1 ? "lg:text-right" : ""}`}>
                        <div className="flex items-baseline gap-2 mb-1.5">
                          <span className="font-display text-3xl font-bold text-gradient-crimson leading-none">
                            {step.n}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                            Step
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Spacer for alternating layout */}
                <div className="hidden lg:block" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="pulse-glow bg-primary hover:bg-primary/90 group">
            <Link href="#contact">
              Book your free trial class
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <p className="mt-3 text-xs text-foreground/50">
            No commitment · No gear needed · Just comfortable clothes
          </p>
        </div>
      </div>
    </section>
  );
}
