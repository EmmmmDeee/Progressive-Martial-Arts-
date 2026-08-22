"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import type { TestimonialT } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((res) => setTestimonials(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="testimonials" className="relative py-20 lg:py-28 bg-secondary/30">
      <div className="absolute inset-0 -z-10 bg-grain opacity-40" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Student Stories
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
            Real people. <span className="text-gradient-gold">Real growth.</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <article key={t.id} className="relative rounded-xl bg-card border border-border/60 p-6 hover:border-accent/40 transition-colors">
                <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/15" />
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`h-3.5 w-3.5 ${j < t.rating ? "fill-accent text-accent" : "text-foreground/20"}`} />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-5 pt-5 border-t border-border/60 flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-full overflow-hidden bg-secondary ring-1 ring-border shrink-0">
                    {t.image && <Image src={t.image} alt={t.name} fill sizes="44px" className="object-cover" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-foreground/55">{t.role}{t.art && <span className="text-accent"> · {t.art}</span>}</div>
                  </div>
                  <span className="ml-auto font-display text-3xl font-bold text-foreground/10">{String(i + 1).padStart(2, "0")}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
