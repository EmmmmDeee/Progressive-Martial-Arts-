"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Home,
  Mail,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useRouter, RouteLink } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { OrderT } from "@/lib/data";
import type { CartItem } from "@/lib/cart-store";

function formatOrderNumber(id: string) {
  // Use the last 8 chars of the cuid for a friendly order number
  const tail = id.replace(/[^a-z0-9]/gi, "").slice(-8).toUpperCase();
  return `PMA-${tail}`;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function OrderSuccess({ id }: { id: string }) {
  const { navigate } = useRouter();
  const [order, setOrder] = useState<OrderT | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (!alive) return;
        if (res.ok && res.data) {
          setOrder(res.data);
          setError(false);
          try {
            const parsed = JSON.parse(res.data.items);
            if (Array.isArray(parsed)) setItems(parsed);
          } catch {
            setItems([]);
          }
        } else {
          setError(true);
        }
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoadedId(id);
      });
    return () => {
      alive = false;
    };
  }, [id]);

  const loading = loadedId !== id;
  const notFound = loadedId === id && (error || !order);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <Skeleton className="h-16 w-16 mx-auto rounded-full" />
        <Skeleton className="h-10 w-2/3 mx-auto mt-6" />
        <Skeleton className="h-4 w-1/2 mx-auto mt-3" />
        <div className="mt-10 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-display text-3xl font-bold uppercase mb-3">
          Order not found
        </h1>
        <p className="text-foreground/70 mb-6">
          We couldn&apos;t find an order with that reference. If you believe this is
          a mistake, please contact us.
        </p>
        <Button onClick={() => navigate({ name: "shop" })}>Back to shop</Button>
      </div>
    );
  }

  const shippingLabel =
    order.shipping === 0 ? "Free / Pickup" : `$${order.shipping.toFixed(2)}`;
  const isPickup = !!order.notes && order.notes.toLowerCase().includes("pick");

  return (
    <div className="bg-background">
      {/* Breadcrumbs */}
      <div className="border-b border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3">
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
            <span className="text-foreground/40">/</span>
            <RouteLink to={{ name: "shop" }} className="hover:text-accent transition-colors">
              Shop
            </RouteLink>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground/80 font-medium">Order confirmed</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Success header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-5 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400 mb-3">
            <span className="h-px w-8 bg-emerald-500/60" />
            Confirmed
            <span className="h-px w-8 bg-emerald-500/60" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
            Order <span className="text-gradient-gold">confirmed!</span>
          </h1>
          <p className="mt-4 text-foreground/75 max-w-xl mx-auto">
            Thank you, {order.name.split(" ")[0] || "friend"}. Your order is in.
            We&apos;ve sent a confirmation email to{" "}
            <span className="text-foreground font-medium">{order.email}</span> with
            all the details.
          </p>
        </div>

        {/* Order details card */}
        <div className="mt-10 rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="px-5 py-4 bg-secondary/30 border-b border-border/60 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-foreground/50">
                Order number
              </div>
              <div className="font-display text-base font-bold text-foreground">
                {formatOrderNumber(order.id)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-foreground/50">
                Placed on
              </div>
              <div className="text-sm font-medium text-foreground">
                {formatDate(order.createdAt)}
              </div>
            </div>
            <Badge className="bg-primary/15 text-primary border-primary/30 uppercase tracking-wide">
              {order.status}
            </Badge>
          </div>

          {/* Items */}
          <div className="p-5">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-foreground/60 mb-4">
              Items
            </h2>
            {items.length === 0 ? (
              <p className="text-sm text-foreground/60">
                Order items could not be loaded.
              </p>
            ) : (
              <ul className="space-y-3">
                {items.map((item, idx) => (
                  <li
                    key={`${item.productId}-${item.size || ""}-${idx}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden border border-border/60 bg-secondary/40">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                        {item.name}
                      </h3>
                      {item.size && (
                        <div className="text-[11px] uppercase tracking-wider text-foreground/50 mt-0.5">
                          Size: <span className="text-foreground/80 font-medium">{item.size}</span>
                        </div>
                      )}
                      <div className="text-xs text-foreground/60 mt-0.5">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Separator className="my-5" />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-foreground/70">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-foreground/70">
                <span>Shipping</span>
                <span className="text-foreground font-medium">{shippingLabel}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="font-display text-base font-bold uppercase">
                Total paid
              </span>
              <span className="font-display text-xl font-bold text-primary">
                ${order.total.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-foreground/50">
              AUD · Inclusive of GST
            </p>
          </div>

          {/* Delivery info */}
          <div className="px-5 py-4 border-t border-border/60 bg-secondary/20">
            <div className="text-xs uppercase tracking-wider font-semibold text-foreground/60 mb-2">
              {isPickup ? "Pick up details" : "Delivery address"}
            </div>
            <div className="text-sm text-foreground/85 flex items-start gap-2">
              {isPickup ? (
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              ) : (
                <Package className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-medium text-foreground">{order.name}</div>
                {isPickup ? (
                  <div>
                    180 New Cleveland Rd, Tingalpa QLD 4173
                    <br />
                    Australia
                  </div>
                ) : (
                  <div>
                    {order.address}
                    <br />
                    {order.city} {order.state} {order.postcode}
                    <br />
                    {order.country}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Mail className="h-5 w-5" />,
              title: "Email confirmation",
              desc: "A receipt has been sent to your inbox with full order details.",
            },
            {
              icon: isPickup ? <Clock className="h-5 w-5" /> : <Clock className="h-5 w-5" />,
              title: isPickup ? "Ready in 24h" : "Dispatch in 1–2 days",
              desc: isPickup
                ? "We'll email you the moment your order is ready for collection."
                : "Your items are being prepared and will ship within 1–2 business days.",
            },
            {
              icon: isPickup ? <MapPin className="h-5 w-5" /> : <Truck className="h-5 w-5" />,
              title: isPickup ? "Pick up at PMAAI" : "Arrives in 3–7 days",
              desc: isPickup
                ? "180 New Cleveland Rd, Tingalpa QLD. Bring your order number."
                : "Standard shipping is 3–7 business days Australia-wide. Tracking emailed.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/60 bg-card/50 p-4"
            >
              <div className="h-9 w-9 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-3">
                {s.icon}
              </div>
              <div className="text-sm font-semibold text-foreground">
                {s.title}
              </div>
              <p className="text-xs text-foreground/65 mt-1 leading-snug">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg">
            <RouteLink to={{ name: "shop" }}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue shopping
            </RouteLink>
          </Button>
          <Button asChild size="lg" variant="outline">
            <RouteLink to={{ name: "home" }}>
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </RouteLink>
          </Button>
        </div>

        {/* Support line */}
        <p className="mt-8 text-center text-xs text-foreground/50">
          Questions about your order? Call us on{" "}
          <a
            href="tel:0733939329"
            className="text-primary hover:underline font-medium"
          >
            (07) 3393 9329
          </a>{" "}
          or reply to your confirmation email.
        </p>
      </div>
    </div>
  );
}
