"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Home,
  Search,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useRouter, RouteLink } from "@/lib/router";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import type { ProductT } from "@/lib/data";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "apparel", label: "Apparel" },
  { value: "equipment", label: "Equipment" },
  { value: "media", label: "Media" },
  { value: "accessory", label: "Accessory" },
];

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const categoryLabel = (c: string) =>
  CATEGORIES.find((x) => x.value === c)?.label || c;

export function ShopPage() {
  const { navigate } = useRouter();
  const add = useCart((s) => s.add);

  const [products, setProducts] = useState<ProductT[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/products")
      .then((r) => r.json())
      .then((res) => {
        if (alive && res.ok) setProducts(res.data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [products, category, sort, query]);

  const countByCat = (cat: string) =>
    cat === "all"
      ? products.length
      : products.filter((p) => p.category === cat).length;

  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-foreground/50"
          >
            <RouteLink
              to={{ name: "home" }}
              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Home className="h-3 w-3" />
              <span className="sr-only">Home</span>
            </RouteLink>
            <ChevronRight className="h-3 w-3 text-foreground/30" />
            <span className="text-foreground/80 font-medium">Shop</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">
              <span className="h-px w-8 bg-primary" />
              Online Shop
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-tight">
              Gear up for <span className="text-gradient-gold">training</span>
            </h1>
            <p className="mt-4 text-foreground/75 max-w-xl">
              Official PMAAI apparel, training equipment and seminar media.
              Every purchase supports the academy and the community.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          {/* Category pills */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-thin"
            role="tablist"
            aria-label="Product categories"
          >
            {CATEGORIES.map((c) => {
              const active = category === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(c.value)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-card border-border text-foreground/70 hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {c.label}
                  <span
                    className={`text-[10px] ${
                      active ? "text-primary-foreground/70" : "text-foreground/40"
                    }`}
                  >
                    {countByCat(c.value)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="pl-9"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-foreground/50 hidden sm:inline">
              Sort
            </span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]" aria-label="Sort products">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result count */}
        <div className="mb-4 text-xs uppercase tracking-wider text-foreground/50">
          {loading ? "Loading…" : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-16 text-center text-foreground/55">
            <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="font-display text-lg uppercase">No products found</p>
            <p className="text-sm mt-1">
              Try a different category or search term.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setSort("newest");
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((p) => (
              <article
                key={p.id}
                className="group relative flex flex-col rounded-xl bg-card border border-border/60 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                <button
                  type="button"
                  onClick={() => navigate({ name: "product", slug: p.slug })}
                  className="relative aspect-square overflow-hidden bg-secondary/40 block text-left"
                  aria-label={`View ${p.name}`}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {p.badge && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary text-primary-foreground shadow-md text-[10px] uppercase tracking-wide">
                        {p.badge}
                      </Badge>
                    </div>
                  )}
                  {!p.inStock && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                      <span className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                        Sold out
                      </span>
                    </div>
                  )}
                </button>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                      {categoryLabel(p.category)}
                    </span>
                    <div className="flex items-center gap-0.5 text-accent">
                      <Star className="h-3 w-3 fill-accent" />
                      <span className="text-[11px] font-medium text-foreground/70">
                        {p.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm text-foreground leading-snug line-clamp-2 flex-1">
                    {p.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-lg font-bold text-foreground">
                      ${p.price.toFixed(2)}
                    </span>
                    {p.compareAt ? (
                      <span className="text-xs text-foreground/40 line-through">
                        ${p.compareAt.toFixed(2)}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={!p.inStock}
                      onClick={() => {
                        add({
                          productId: p.id,
                          slug: p.slug,
                          name: p.name,
                          price: p.price,
                          image: p.image,
                        });
                        toast.success(`${p.name} added to cart`);
                      }}
                      className="inline-flex items-center justify-center rounded-md bg-secondary/70 hover:bg-primary hover:text-primary-foreground text-foreground text-[11px] font-semibold uppercase tracking-wide py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate({ name: "product", slug: p.slug })}
                      className="inline-flex items-center justify-center gap-1 rounded-md border border-border/60 hover:border-primary/40 hover:text-primary text-foreground text-[11px] font-semibold uppercase tracking-wide py-2 transition-colors"
                    >
                      View
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Trust row */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-center">
          {[
            { t: "Members get 10% off", s: "Show your PMAAI card at checkout" },
            { t: "Pick up in store", s: "180 New Cleveland Rd, Tingalpa" },
            { t: "Authentic brands", s: "Morgan, Punch, Machado & more" },
          ].map((i) => (
            <div
              key={i.t}
              className="rounded-lg border border-border/60 bg-card/50 p-4"
            >
              <div className="text-sm font-semibold text-foreground">{i.t}</div>
              <div className="text-xs text-foreground/55 mt-0.5">{i.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
