"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "@/lib/router";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { ArtDisciplineT } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const focusColor: Record<string, string> = {
  "Stand-up": "bg-primary/15 text-primary border-primary/30",
  Weaponry: "bg-accent/15 text-accent border-accent/30",
  Ground: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Kids: "bg-pink-500/15 text-pink-400 border-pink-500/30",
};

export function Arts() {
  const [arts, setArts] = useState<ArtDisciplineT[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useRouter();

  useEffect(() => {
    fetch("/api/arts")
      .then((r) => r.json())
      .then((res) => setArts(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="arts" className="relative py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Arts We Teach
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
              Six disciplines.
              <br />
              <span className="text-gradient-crimson">One complete martial artist.</span>
            </h2>
          </div>
          <p className="text-foreground/70 max-w-md lg:text-right">
            From the striking range to the clinch, from weaponry to the ground —
            our curriculum covers every range of combat.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {arts.map((art, idx) => (
              <article
                key={art.id}
                onClick={() => navigate({ name: "program", slug: art.slug })}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") navigate({ name: "program", slug: art.slug }); }}
                className="group relative overflow-hidden rounded-xl bg-card border border-border/60 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={art.image}
                    alt={art.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <span className="absolute top-4 right-4 font-display text-5xl font-bold text-foreground/15 leading-none">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className={`border backdrop-blur-sm ${focusColor[art.focus] || "bg-secondary/20 text-foreground border-border"}`}>
                      {art.focus}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <div className="flex items-center gap-1.5 text-xs text-accent/90 mb-1.5">
                      <MapPin className="h-3 w-3" />
                      <span className="uppercase tracking-wider">Origin: {art.origin}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                      {art.name}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">{art.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                      Explore program
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                    <span className="text-xs text-foreground/40 uppercase tracking-wider">{art.difficulty}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
