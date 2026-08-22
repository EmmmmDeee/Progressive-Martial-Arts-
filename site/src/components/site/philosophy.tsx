"use client";

import { useReveal } from "@/hooks/use-reveal";
import { Brain, Swords, Heart, Infinity as InfinityIcon } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

const principles = [
  {
    number: "01",
    icon: Brain,
    title: "Absorb what is useful",
    text: "Bruce Lee's founding principle. We don't cling to tradition for tradition's sake — we test, we keep what works, we discard what doesn't. Every art at PMAAI earned its place by proving itself under pressure.",
    accent: "from-primary/20",
    borderColor: "group-hover:border-primary/40",
    iconBg: "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  },
  {
    number: "02",
    icon: Swords,
    title: "Train every range",
    text: "A complete martial artist can fight standing, in the clinch, on the ground, and with and against weapons. Our curriculum covers all four ranges — stand-up, weaponry, clinch and ground — so you're never caught without an answer.",
    accent: "from-accent/20",
    borderColor: "group-hover:border-accent/40",
    iconBg: "bg-accent/10 border-accent/20 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
  },
  {
    number: "03",
    icon: Heart,
    title: "Martial arts is for everyone",
    text: "We believe martial arts is for every body, every age, every goal. Whether you seek self-defence, fitness, competition or personal growth — our role is to nurture your potential, wherever you start from. Ego stays at the door.",
    accent: "from-pink-500/20",
    borderColor: "group-hover:border-pink-500/40",
    iconBg: "bg-pink-500/10 border-pink-500/20 text-pink-400 group-hover:bg-pink-500 group-hover:text-white",
  },
  {
    number: "04",
    icon: InfinityIcon,
    title: "The journey never ends",
    text: "There is no black belt, no finish line. Martial arts is a lifelong practice of refinement — physically, mentally and spiritually. The best practitioners are still learning. We'll walk that path with you for as long as you choose to train.",
    accent: "from-emerald-500/20",
    borderColor: "group-hover:border-emerald-500/40",
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
  },
];

export function Philosophy() {
  const { ref, isVisible } = useReveal();

  return (
    <section id="philosophy" className="relative py-20 lg:py-28 bg-secondary/20">
      <div className="absolute inset-0 -z-10 bg-grain opacity-30" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="The PMAAI Way"
          title={<>Our training <span className="text-gradient-crimson">philosophy</span></>}
          description="Four principles that shape every class, every drill, every interaction at PMAAI. Inherited from Bruce Lee, refined over 35 years of teaching."
        />

        <div
          ref={ref}
          className={`mt-12 grid sm:grid-cols-2 gap-6 reveal ${isVisible ? "is-visible" : ""}`}
        >
          {principles.map((p, i) => (
            <article
              key={p.number}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 lg:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 ${p.borderColor}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Gradient accent overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${p.accent} to-transparent opacity-40 pointer-events-none`} />

              <div className="relative flex items-start gap-5">
                <div className={`shrink-0 h-14 w-14 rounded-xl border flex items-center justify-center transition-all ${p.iconBg}`}>
                  <p.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-display text-3xl font-bold text-gradient-crimson leading-none">{p.number}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-semibold">Principle</span>
                  </div>
                  <h3 className="font-display text-xl lg:text-2xl font-bold uppercase tracking-tight mb-2">{p.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{p.text}</p>
                </div>
              </div>

              {/* Decorative corner number watermark */}
              <span className="absolute -bottom-4 -right-2 font-display text-8xl font-bold text-foreground/[0.03] leading-none pointer-events-none select-none">
                {p.number}
              </span>
            </article>
          ))}
        </div>

        {/* Bruce Lee quote */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <blockquote className="relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-display text-6xl text-primary/20 leading-none">&ldquo;</span>
            <p className="font-display text-xl lg:text-2xl font-medium leading-relaxed text-foreground/90 pt-4">
              Empty your mind, be formless, shapeless — like water. If you put water into a cup, it becomes the cup. Be water, my friend.
            </p>
            <footer className="mt-4 text-sm text-foreground/60 uppercase tracking-wider">
              — Bruce Lee
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
