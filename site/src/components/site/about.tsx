import Image from "next/image";
import Link from "next/link";
import { Quote, Award, Users2, Globe2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  {
    icon: Award,
    title: "Authentic lineage",
    text: "Directly certified under Guro Dan Inosanto and the Inosanto Academy of Martial Arts, with a teaching pedigree spanning decades.",
  },
  {
    icon: Users2,
    title: "Progressive system",
    text: "We blend the most effective techniques across stand-up, weaponry and ground fighting to build well-rounded martial artists.",
  },
  {
    icon: Globe2,
    title: "Welcoming community",
    text: "From first-timers to seasoned practitioners, every student is nurtured at their level in a respectful, ego-free environment.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-stripes opacity-40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-border/60 shadow-2xl shadow-black/40">
              <Image
                src="/images/about.jpg"
                alt="PMAAI lineage wall of instructors and certificates"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-card border border-border rounded-xl p-5 shadow-xl shadow-black/40 max-w-[220px]">
              <div className="font-display text-4xl font-bold text-gradient-crimson">35+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-foreground/60">
                Years nurturing Brisbane&apos;s martial artists
              </div>
            </div>
            {/* Decorative corner */}
            <div className="absolute -top-4 -left-4 h-20 w-20 border-t-2 border-l-2 border-accent/60 rounded-tl-xl" />
          </div>

          {/* Text side */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              About PMAAI
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
              A long, proud history under the{" "}
              <span className="text-gradient-gold">Inosanto lineage</span>
            </h2>

            <div className="relative mt-6">
              <Quote className="absolute -left-1 -top-2 h-8 w-8 text-primary/20" />
              <p className="pl-8 text-foreground/80 leading-relaxed text-lg">
                Progressive Martial Arts Academy International teaches a variety
                of arts that cover stand-up, weaponry and ground fighting —
                uniquely qualified to enhance and nurture your martial arts
                potential.
              </p>
            </div>

            <p className="mt-4 text-foreground/70 leading-relaxed">
              We complement our martial arts curriculum with our own on-site,
              certified personal fitness trainers and a specialised 24-hour
              strength gym next door, so you can train every facet of your
              performance under one roof.
            </p>

            <div className="mt-8 space-y-4">
              {pillars.map((p) => (
                <div key={p.title} className="flex gap-4 group">
                  <div className="shrink-0 h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="text-sm text-foreground/65 mt-0.5 leading-relaxed">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 group">
                <Link href="#instructors">
                  Meet the instructors
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
