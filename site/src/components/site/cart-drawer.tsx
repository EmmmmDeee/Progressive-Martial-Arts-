"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useRouter } from "@/lib/router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/lib/cart-store";
import { RouteLink } from "@/lib/router";

const FREE_SHIPPING_THRESHOLD = 100;
const FREE_SHIPPING_PROGRESS_MAX = 100;

export function CartDrawer() {
  const { navigate } = useRouter();
  const [mounted, setMounted] = useState(false);

  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const remove = useCart((s) => s.remove);
  const updateQty = useCart((s) => s.updateQty);

  // SSR-safe: defer the "mounted" flag to a microtask so we never call setState
  // synchronously in an effect (which would trigger react-hooks/set-state-in-effect).
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setMounted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressValue = Math.min(
    FREE_SHIPPING_PROGRESS_MAX,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  const goCheckout = () => {
    close();
    navigate({ name: "checkout" });
  };

  return (
    <Sheet
      open={mounted ? isOpen : false}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-background"
      >
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg font-bold uppercase tracking-wide">
              Your Cart
              <span className="ml-2 text-sm font-medium text-foreground/60">
                ({count})
              </span>
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Review the items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="h-16 w-16 rounded-full bg-secondary/60 flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-foreground/40" />
            </div>
            <div>
              <p className="font-display text-lg font-bold uppercase">
                Your cart is empty
              </p>
              <p className="text-sm text-foreground/55 mt-1">
                Time to gear up. Browse the shop and add your first item.
              </p>
            </div>
            <Button asChild>
              <RouteLink to={{ name: "shop" }} onClick={close}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse the shop
              </RouteLink>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-5 py-3 bg-secondary/20 border-b border-border/60">
              {remaining > 0 ? (
                <p className="text-xs text-foreground/70 mb-2">
                  Add <span className="font-semibold text-primary">${remaining.toFixed(2)}</span>{" "}
                  for <span className="font-semibold">free shipping</span>
                </p>
              ) : (
                <p className="text-xs text-emerald-400 mb-2 flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  You&apos;ve unlocked free shipping!
                </p>
              )}
              <Progress value={progressValue} className="h-1.5" />
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
              <ul className="space-y-4">
                {items.map((item, idx) => (
                  <li
                    key={`${item.productId}-${item.size || ""}-${idx}`}
                    className="flex gap-3"
                  >
                    <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden border border-border/60 bg-secondary/40">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => remove(item.productId, item.size)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="text-foreground/40 hover:text-primary transition-colors p-1 -m-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {item.size && (
                        <div className="text-[11px] uppercase tracking-wider text-foreground/50 mt-0.5">
                          Size: <span className="text-foreground/80 font-medium">{item.size}</span>
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-md border border-border bg-card overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(item.productId, item.size, item.qty - 1)
                            }
                            disabled={item.qty <= 1}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="h-7 w-7 inline-flex items-center justify-center text-foreground/70 hover:bg-secondary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="h-7 w-8 inline-flex items-center justify-center text-xs font-semibold text-foreground">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQty(item.productId, item.size, item.qty + 1)
                            }
                            disabled={item.qty >= 99}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="h-7 w-7 inline-flex items-center justify-center text-foreground/70 hover:bg-secondary/60 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          ${(item.price * item.qty).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="border-t border-border/60 px-5 py-4 space-y-3 bg-card/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/70">Subtotal</span>
                <span className="font-display text-lg font-bold text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-foreground/50">
                Shipping and taxes calculated at checkout.
              </p>
              <Separator />
              <Button
                onClick={goCheckout}
                size="lg"
                className="w-full"
              >
                Proceed to checkout
              </Button>
              <Button
                onClick={close}
                size="lg"
                variant="outline"
                className="w-full"
              >
                Continue shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
