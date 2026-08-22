"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Star, Users, Dumbbell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: Users, value: "35+", label: "Years teaching" },
  { icon: Shield, value: "6", label: "Martial arts" },
  { icon: Dumbbell, value: "24/7", label: "Strength gym" },
];

export function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // parallax only affects the first viewport of scroll
  const parallax = Math.min(scrollY * 0.3, 300);

  return (
    <section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Background with parallax */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(0, ${parallax}px, 0) scale(1.1)` }}
        >
          <Image
            src="/images/hero-bg.jpg"
            alt="Martial arts dojo at Progressive Martial Arts Academy"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Gradient mesh overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        {/* Radial accent glow */}
        <div
          className="absolute -top-1/4 -right-1/4 h-[60vh] w-[60vh] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.58 0.24 27 / 0.5), transparent 70%)" }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 h-[50vh] w-[50vh] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.14 75 / 0.4), transparent 70%)" }}
        />
        <div className="absolute inset-0 bg-grain opacity-60" />
      </div>

      {/* Decorative side stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary opacity-80" />

      {/* Decorative corner brackets */}
      <div className="absolute top-24 right-8 hidden lg:block">
        <div className="h-16 w-16 border-t-2 border-r-2 border-accent/40 rounded-tr-xl" />
      </div>
      <div className="absolute bottom-24 left-8 hidden lg:block">
        <div className="h-16 w-16 border-b-2 border-l-2 border-accent/40 rounded-bl-xl" />
      </div>

      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16 lg:pt-28 will-change-transform"
        style={{ transform: `translate3d(0, ${parallax * 0.15}px, 0)` }}
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent uppercase tracking-[0.2em] animate-fade-up animate-float">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Brisbane · Est. 1989 · Inosanto Lineage
          </div>

          {/* Heading */}
          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] tracking-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Forge your
            <br />
            <span className="text-gradient-crimson">warrior spirit</span>
            <br />
            <span className="text-gradient-gold">at PMAAI</span>
          </h1>

          {/* Sub */}
          <p className="mt-6 max-w-xl text-base sm:text-lg text-foreground/75 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
            A progressive martial arts system drawing from the world&apos;s most
            effective disciplines — stand-up, weaponry and ground fighting —
            taught under the proud lineage of{" "}
            <span className="text-foreground font-medium">Guro Dan Inosanto</span>{" "}
            and the Inosanto Academy.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="pulse-glow bg-primary hover:bg-primary/90 text-primary-foreground group">
              <Link href="#contact">
                Claim your free trial class
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-foreground/20 bg-background/30 backdrop-blur-sm hover:bg-background/50">
              <Link href="#arts">
                <Play className="mr-2 h-4 w-4 fill-current" />
                Explore the arts we teach
              </Link>
            </Button>
          </div>

          {/* Rating row */}
          <div className="mt-10 flex items-center gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm text-foreground/70">
              Rated <span className="text-foreground font-semibold">5.0</span> by 200+ students &amp; families
            </span>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg animate-fade-up" style={{ animationDelay: "0.5s" }}>
            {stats.map((s) => (
              <div key={s.label} className="border-l-2 border-primary/40 pl-4 hover:border-accent transition-colors group">
                <div className="flex items-center gap-2 text-accent group-hover:scale-110 transition-transform origin-left">
                  <s.icon className="h-4 w-4" />
                  <span className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    {s.value}
                  </span>
                </div>
                <div className="mt-1 text-xs sm:text-sm text-foreground/60 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom scroll cue with animated chevron */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-foreground/50">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-foreground/50 to-transparent" />
        <span className="animate-bounce text-accent">▼</span>
      </div>
    </section>
  );
}
