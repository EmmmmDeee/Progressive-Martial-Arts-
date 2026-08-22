"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-xs text-foreground/50 flex-wrap", className)}>
      <Link href="#/" className="inline-flex items-center gap-1 hover:text-accent transition-colors">
        <Home className="h-3 w-3" />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-foreground/30" />
          {item.href && i < items.length - 1 ? (
            <a href={item.href} className="hover:text-accent transition-colors">{item.label}</a>
          ) : (
            <span className="text-foreground/80 font-medium truncate max-w-[200px]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
