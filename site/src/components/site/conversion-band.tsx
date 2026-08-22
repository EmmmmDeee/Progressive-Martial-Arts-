import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function ConversionBand() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* bg */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/cta-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background" />
        <div className="absolute inset-0 bg-stripes opacity-30" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent uppercase tracking-[0.2em]">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Your first class is on us
        </div>
        <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[0.95]">
          Stop watching.
          <br />
          <span className="text-gradient-crimson">Start training.</span>
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-foreground/75 text-lg leading-relaxed">
          Every journey starts with a single step onto the mat. Claim your free
          trial class today — no commitment, no gear required, just comfortable
          clothes and the willingness to begin.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="pulse-glow bg-primary hover:bg-primary/90 group">
            <Link href="#contact">
              Claim your free trial class
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-foreground/20 bg-background/30 backdrop-blur-sm hover:bg-background/50">
            <a href={siteConfig.phoneHref}>
              <Phone className="mr-2 h-4 w-4" />
              Call {siteConfig.phone}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
