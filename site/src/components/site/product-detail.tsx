"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronRight,
  Home,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Truck,
  X,
} from "lucide-react";
import { useRouter, RouteLink } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import type { ProductT } from "@/lib/data";
import { cn } from "@/lib/utils";

function parsePipe(s?: string | null): string[] {
  if (!s) return [];
  return s.split("|").map((x) => x.trim()).filter(Boolean);
}

const COLOR_SWATCH: Record<string, string> = {
  Black: "#0a0a0a",
  White: "#f5f5f5",
  Grey: "#6b7280",
  Gray: "#6b7280",
  Red: "#dc2626",
  Crimson: "#dc2626",
  Gold: "#d4a017",
  Navy: "#1e3a8a",
  Blue: "#1e3a8a",
  Green: "#10b981",
  Emerald: "#10b981",
  Pink: "#ec4899",
  Purple: "#7c3aed",
  Charcoal: "#1f2937",
};

function swatchFor(color: string): string {
  if (COLOR_SWATCH[color]) return COLOR_SWATCH[color];
  // Try lowercase
  const k = Object.keys(COLOR_SWATCH).find(
    (k) => k.toLowerCase() === color.toLowerCase()
  );
  if (k) return COLOR_SWATCH[k];
  return "#6b7280";
}

export function ProductDetail({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const add = useCart((s) => s.add);

  const [product, setProduct] = useState<ProductT | null>(null);
  const [related, setRelated] = useState<ProductT[]>([]);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);

  const [size, setSize] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/api/products/${slug}`).then((r) => r.json()),
      fetch(`/api/products`).then((r) => r.json()),
    ])
      .then(([pRes, allRes]) => {
        if (!alive) return;
        if (pRes.ok && pRes.data) {
          const p = pRes.data as ProductT;
          setProduct(p);
          const sizes = parsePipe(p.sizes);
          const colors = parsePipe(p.colors);
          if (sizes.length) setSize(sizes[0]);
          if (colors.length) setColor(colors[0]);
        }
        if (allRes.ok && allRes.data) {
          const all = allRes.data as ProductT[];
          if (pRes.ok && pRes.data) {
            const related = all
              .filter(
                (x) => x.category === pRes.data.category && x.id !== pRes.data.id
              )
              .slice(0, 4);
            setRelated(related);
          }
        }
        setQty(1);
        setActiveImage(0);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoadedSlug(slug);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const loading = loadedSlug !== slug;

  const gallery = useMemo(() => {
    if (!product) return [];
    const extra = parsePipe(product.gallery || undefined);
    return [product.image, ...extra];
  }, [product]);

  if (loading || !product || product.slug !== slug) return <ProductSkeleton />;

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold uppercase mb-3">
          Product not found
        </h1>
        <p className="text-foreground/70 mb-6">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={() => navigate({ name: "shop" })}>
          Back to shop
        </Button>
      </div>
    );
  }

  const sizes = parsePipe(product.sizes);
  const colors = parsePipe(product.colors);
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round(
          ((product.compareAt - product.price) / product.compareAt) * 100
        )
      : 0;

  const handleAddToCart = () => {
    if (sizes.length && !size) {
      toast.error("Please choose a size");
      return;
    }
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
      },
      qty
    );
    toast.success(`${product.name} added to cart`, {
      description: size ? `Size: ${size} · Qty: ${qty}` : `Qty: ${qty}`,
    });
  };

  const handleBuyNow = () => {
    if (sizes.length && !size) {
      toast.error("Please choose a size");
      return;
    }
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
      },
      qty
    );
    navigate({ name: "checkout" });
  };

  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-foreground/50 flex-wrap"
          >
            <RouteLink
              to={{ name: "home" }}
              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Home className="h-3 w-3" />
              <span className="sr-only">Home</span>
            </RouteLink>
            <ChevronRight className="h-3 w-3 text-foreground/30" />
            <RouteLink to={{ name: "shop" }} className="hover:text-accent transition-colors">
              Shop
            </RouteLink>
            <ChevronRight className="h-3 w-3 text-foreground/30" />
            <span className="text-foreground/80 font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/40 border border-border/60">
              <Image
                src={gallery[activeImage] || product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground shadow-md uppercase tracking-wide">
                    {product.badge}
                  </Badge>
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <span className="font-display text-lg uppercase tracking-wider font-semibold text-foreground/80">
                    Sold out
                  </span>
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-thin pb-2">
                {gallery.map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImage === i ? "border-primary" : "border-border/60 hover:border-primary/40"
                    }`}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={activeImage === i}
                  >
                    <Image
                      src={g}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-2">
              {product.category}
              {product.subcategory ? ` · ${product.subcategory}` : ""}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(product.rating)
                        ? "fill-accent"
                        : "fill-transparent text-foreground/30"
                    )}
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-foreground/70">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-foreground/40 uppercase tracking-wider">
                {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
              </span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAt && product.compareAt > product.price && (
                <>
                  <span className="text-lg text-foreground/40 line-through">
                    ${product.compareAt.toFixed(2)}
                  </span>
                  <Badge className="bg-primary/15 text-primary border-primary/30">
                    Save {discount}%
                  </Badge>
                </>
              )}
            </div>

            <p className="mt-5 text-foreground/80 leading-relaxed">
              {product.longDescription || product.description}
            </p>

            {/* SKU + stock */}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
              {product.sku && (
                <span className="inline-flex items-center gap-1.5 text-foreground/60">
                  <Tag className="h-3.5 w-3.5" />
                  SKU: <span className="font-medium text-foreground/80">{product.sku}</span>
                </span>
              )}
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  In stock{product.stockQty > 0 ? ` · ${product.stockQty} available` : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-primary">
                  <X className="h-3.5 w-3.5" />
                  Out of stock
                </span>
              )}
            </div>

            <Separator className="my-6" />

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    Size
                  </label>
                  <button
                    type="button"
                    className="text-[11px] text-foreground/50 hover:text-accent underline-offset-2 hover:underline"
                    onClick={() => toast.info("Size guide coming soon")}
                  >
                    Size guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => {
                    const active = size === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        aria-pressed={active}
                        className={`min-w-[44px] h-11 px-3 rounded-md text-sm font-semibold uppercase tracking-wide border transition-all ${
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                            : "bg-card border-border text-foreground/80 hover:border-primary/50 hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color selector */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-foreground/70">
                    Colour {color && <span className="text-foreground/50">· {color}</span>}
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const active = color === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        aria-pressed={active}
                        aria-label={`Colour ${c}`}
                        title={c}
                        className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                          active
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-border/60 hover:border-primary/40"
                        }`}
                      >
                        <span
                          className="absolute inset-1 rounded-full"
                          style={{ background: swatchFor(c) }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity stepper */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider font-semibold text-foreground/70 mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center rounded-md border border-border bg-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  className="h-11 w-11 inline-flex items-center justify-center text-foreground/70 hover:bg-secondary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!isNaN(n) && n > 0) setQty(n);
                  }}
                  className="h-11 w-14 border-0 bg-transparent text-center font-semibold text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  disabled={qty >= 99}
                  aria-label="Increase quantity"
                  className="h-11 w-11 inline-flex items-center justify-center text-foreground/70 hover:bg-secondary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid sm:grid-cols-2 gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full border-primary/40 text-primary hover:bg-primary/10"
              >
                Buy now
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: <Tag className="h-4 w-4" />, t: "Members get 10% off" },
                { icon: <Store className="h-4 w-4" />, t: "Pick up in store" },
                { icon: <Truck className="h-4 w-4" />, t: "Authentic brands" },
              ].map((i) => (
                <div
                  key={i.t}
                  className="rounded-lg border border-border/60 bg-card/50 p-3 flex flex-col items-center gap-1.5"
                >
                  <span className="text-accent">{i.icon}</span>
                  <span className="text-[11px] font-medium text-foreground/80 leading-tight">
                    {i.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 lg:mt-24">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">
                  <span className="h-px w-8 bg-primary" />
                  You may also like
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase">
                  Related products
                </h2>
              </div>
              <Button asChild variant="outline" size="sm">
                <RouteLink to={{ name: "shop" }}>
                  View all
                  <ChevronRight className="h-4 w-4" />
                </RouteLink>
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <article
                  key={p.id}
                  className="group rounded-xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => navigate({ name: "product", slug: p.slug })}
                    className="relative aspect-square overflow-hidden block w-full bg-secondary/40"
                    aria-label={`View ${p.name}`}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </button>
                  <div className="p-3">
                    <div className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                      {p.category}
                    </div>
                    <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 mt-1">
                      {p.name}
                    </h3>
                    <div className="mt-2 font-display text-base font-bold text-foreground">
                      ${p.price.toFixed(2)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton className="aspect-square rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
