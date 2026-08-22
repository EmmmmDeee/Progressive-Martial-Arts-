import { cn } from "@/lib/utils";

/**
 * Ornamental martial-arts themed section divider.
 * Renders a centered emblem with flanking lines and optional label.
 */
export function SectionDivider({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 py-6 select-none",
        className
      )}
      aria-hidden="true"
    >
      {/* Left line */}
      <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-border/60" />
      {/* Emblem */}
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
        <span className="h-2 w-2 rotate-45 border border-accent/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
      </div>
      {label && (
        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-semibold px-2">
          {label}
        </span>
      )}
      {/* Right line */}
      <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-border/60" />
    </div>
  );
}
