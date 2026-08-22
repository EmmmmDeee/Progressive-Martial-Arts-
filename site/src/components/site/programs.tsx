import Image from "next/image";
import Link from "next/link";
import { Dumbbell, Baby, Clock, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const programs = [
  {
    id: "progressive-strength",
    eyebrow: "24/7 Fitness Gym",
    title: "Progressive Strength",
    tagline: "On-site certified personal training",
    description:
      "Based at the PMAAI premises in Tingalpa, Progressive Strength is our 24-hour fitness facility next door — purpose-built to complement your martial arts training with strength, conditioning and personal training.",
    image: "/images/program-strength.jpg",
    features: [
      "24/7 swipe-access members gym",
      "Certified personal trainers on staff",
      "Strength & conditioning for fighters",
      "Kettlebells, free weights, cardio",
    ],
    cta: "Enquire about membership",
    accent: "from-primary/30 to-transparent",
    badge: "bg-primary",
    icon: Dumbbell,
  },
  {
    id: "mini-muscles",
    eyebrow: "Healthy Active Kids",
    title: "Mini Muscles",
    tagline: "Ages 5–12 martial arts & movement",
    description:
      "A fun yet disciplined environment where children develop self-defence skills, strength, motor control, balance and coordination. Lessons focus around martial arts, BeastFit Kids and Fit Play — guided discovery and play.",
    image: "/images/program-kids.jpg",
    features: [
      "Self-defence from Muay Thai & BJJ",
      "BeastFit Kids & Fit Play sessions",
      "Builds confidence & discipline",
      "Escape from holds & grabs",
    ],
    cta: "Book a kids trial",
    accent: "from-accent/30 to-transparent",
    badge: "bg-accent text-accent-foreground",
    icon: Baby,
  },
];

export function Programs() {
  return (
    <section id="programs" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Programs
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
            Beyond the mat
          </h2>
          <p className="mt-4 text-foreground/70">
            Two specialised programs that extend the PMAAI experience — for the
            youngest members of your family and for the strength athlete in all
            of us.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {programs.map((p) => (
            <article
              key={p.id}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border/60 transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-black/30"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-tr ${p.accent}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${p.badge} shadow-lg`}>
                    <p.icon className="h-5 w-5" />
                  </span>
                </div>
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                    {p.eyebrow}
                  </div>
                  <h3 className="mt-1 font-display text-3xl font-bold uppercase">
                    {p.title}
                  </h3>
                  <p className="text-sm text-foreground/70">{p.tagline}</p>
                </div>
              </div>

              <div className="p-6 lg:p-7">
                <p className="text-foreground/75 leading-relaxed">{p.description}</p>
                <ul className="mt-5 grid sm:grid-cols-2 gap-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 group/btn">
                    <Link href="#contact">
                      {p.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Next door to PMAAI</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
