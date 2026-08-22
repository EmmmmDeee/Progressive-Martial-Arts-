import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary",
            align === "center" && "justify-center"
          )}
        >
          <span className="h-px w-8 bg-primary" />
          {eyebrow}
          {align === "center" && <span className="h-px w-8 bg-primary" />}
        </div>
      )}
      <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-foreground/70 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
