import Image from "next/image";
import { RouteLink } from "@/lib/router";
import { ArrowRight } from "lucide-react";

export function LineageStrip() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden border-y border-border/60 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Image */}
          <div className="lg:col-span-2 relative aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-border/60">
            <Image
              src="/images/about.jpg"
              alt="PMAAI lineage wall"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          {/* Text */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Our Lineage
            </div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold uppercase leading-tight">
              Three decades under the{" "}
              <span className="text-gradient-gold">Inosanto Academy</span>
            </h2>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              Founded in 1989 by Sifu Costa Vassiliou, PMAAI is a direct affiliate
              of the Inosanto Academy of Martial Arts — carrying the lineage of
              Bruce Lee&apos;s Jeet Kune Do, Filipino Kali, Maphilindo Silat and the
              Machado brothers&apos; Brazilian Jiu Jitsu to Brisbane.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <div className="font-display text-3xl font-bold text-gradient-crimson">1989</div>
                <div className="text-xs uppercase tracking-wider text-foreground/50 mt-1">Established</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-gradient-crimson">35+</div>
                <div className="text-xs uppercase tracking-wider text-foreground/50 mt-1">Years teaching</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-gradient-crimson">6</div>
                <div className="text-xs uppercase tracking-wider text-foreground/50 mt-1">Martial arts</div>
              </div>
            </div>
            <RouteLink
              to={{ name: "history" }}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group"
            >
              Explore our history &amp; lineage
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </RouteLink>
          </div>
        </div>
      </div>
    </section>
  );
}
