"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RouteLink } from "@/lib/router";
import { ShoppingBag, Star, ArrowRight, Plus } from "lucide-react";
import type { ProductT } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  apparel: "Apparel",
  equipment: "Equipment",
  media: "Media",
  accessory: "Accessory",
};

export function Shop() {
  const [products, setProducts] = useState<ProductT[]>([]);
  const [loading, setLoading] = useState(true);
  const add = useCart((s) => s.add);

  useEffect(() => {
    fetch("/api/products?limit=8")
      .then((r) => r.json())
      .then((res) => setProducts(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="shop" className="relative py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Online Shop
            </div>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
              Gear up for <span className="text-gradient-gold">training</span>
            </h2>
            <p className="mt-3 text-foreground/70 max-w-xl">
              Official PMAAI apparel, training equipment and seminar media.
            </p>
          </div>
          <RouteLink to={{ name: "shop" }}>
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 group self-start lg:self-end">
              View all products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </RouteLink>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-foreground/50">
            <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-50" />
            The shop is being restocked.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((p) => (
              <div key={p.id} className="group flex flex-col">
                <RouteLink to={{ name: "product", slug: p.slug }} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-card border border-border/60 mb-3 transition-all group-hover:border-primary/40">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {p.badge && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-primary-foreground shadow-md text-[10px] uppercase tracking-wide">{p.badge}</Badge>
                      </div>
                    )}
                  </div>
                </RouteLink>
                <div className="flex flex-1 flex-col px-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">{categoryLabels[p.category]}</span>
                    <div className="flex items-center gap-0.5 text-accent">
                      <Star className="h-3 w-3 fill-accent" />
                      <span className="text-[11px] font-medium text-foreground/70">{p.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <RouteLink to={{ name: "product", slug: p.slug }}>
                    <h3 className="font-medium text-sm text-foreground leading-snug line-clamp-2 flex-1 hover:text-primary transition-colors">{p.name}</h3>
                  </RouteLink>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-lg font-bold">${p.price.toFixed(2)}</span>
                    {p.compareAt && <span className="text-xs text-foreground/40 line-through">${p.compareAt.toFixed(2)}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      add({ productId: p.id, slug: p.slug, name: p.name, price: p.price, image: p.image });
                      toast.success(`${p.name} added to cart`);
                    }}
                    className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-secondary/70 hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-semibold uppercase tracking-wide py-2 transition-colors"
                  >
                    <Plus className="h-3 w-3" /> Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 grid sm:grid-cols-3 gap-4 text-center">
          {[
            { t: "Members get 10% off", s: "Show your PMAAI card at checkout" },
            { t: "Pick up in store", s: "180 New Cleveland Rd, Tingalpa" },
            { t: "Authentic brands", s: "Morgan, Punch, Machado & more" },
          ].map((i) => (
            <div key={i.t} className="rounded-lg border border-border/60 bg-card/50 p-4">
              <div className="text-sm font-semibold text-foreground">{i.t}</div>
              <div className="text-xs text-foreground/55 mt-0.5">{i.s}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
