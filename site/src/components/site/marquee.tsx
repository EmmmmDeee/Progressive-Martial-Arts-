const items = [
  "Muay Thai",
  "Brazilian Jiu Jitsu",
  "Kali",
  "Jeet Kune Do",
  "Maphilindo Silat",
  "Jun Fan Gung Fu",
  "Mini Muscles",
  "Progressive Strength",
  "Inosanto Lineage",
  "Since 1989",
];

export function Marquee() {
  return (
    <div className="relative border-y border-border/60 bg-background overflow-hidden py-4">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-3 text-sm font-display font-semibold uppercase tracking-[0.2em] text-foreground/40"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
