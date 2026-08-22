"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Flame, ChevronDown, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { siteConfig } from "@/lib/site-config";
import { RouteLink, useRouter } from "@/lib/router";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const programLinks = [
  { name: "Muay Thai", slug: "muay-thai", focus: "Stand-up" },
  { name: "Brazilian Jiu Jitsu", slug: "brazilian-jiu-jitsu", focus: "Ground" },
  { name: "Kali", slug: "kali", focus: "Weaponry" },
  { name: "Jeet Kune Do", slug: "jeet-kune-do", focus: "Stand-up" },
  { name: "Maphilindo Silat", slug: "maphilindo-silat", focus: "Stand-up" },
  { name: "Jun Fan Gung Fu", slug: "jun-fan-gung-fu", focus: "Stand-up" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { navigate } = useRouter();
  const cartCount = useCart((s) => s.count());
  const openCart = useCart((s) => s.open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border/60 shadow-lg shadow-black/30"
          : "bg-gradient-to-b from-black/70 to-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <RouteLink to={{ name: "home" }} className="flex items-center gap-3 group shrink-0">
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              <Flame className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg lg:text-xl font-bold tracking-wide text-foreground uppercase">
                Progressive
              </span>
              <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.25em] text-accent font-medium">
                Martial Arts · Brisbane
              </span>
            </span>
          </RouteLink>

          {/* Desktop mega nav */}
          <NavigationMenu dir="ltr" className="hidden lg:flex">
            <NavigationMenuList>
              {/* Programs mega */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-foreground/80 hover:text-foreground data-[state=open]:text-foreground uppercase text-sm font-medium tracking-wide">
                  Training
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[640px] grid-cols-2 gap-1 p-4 bg-popover border border-border rounded-xl shadow-xl">
                    <div className="col-span-2 flex items-center justify-between px-2 pb-3 mb-1 border-b border-border/60">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">Arts We Teach</div>
                        <div className="text-xs text-foreground/55">Stand-up · Weaponry · Ground</div>
                      </div>
                      <RouteLink to={{ name: "timetable" }} className="text-xs text-primary hover:underline">
                        Full timetable →
                      </RouteLink>
                    </div>
                    {programLinks.map((p) => (
                      <RouteLink
                        key={p.slug}
                        to={{ name: "program", slug: p.slug }}
                        className="block rounded-lg p-3 hover:bg-secondary/60 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold uppercase text-sm text-foreground group-hover:text-primary transition-colors">
                            {p.name}
                          </span>
                          <ChevronDown className="h-3 w-3 -rotate-90 text-foreground/30 group-hover:text-primary transition-all" />
                        </div>
                        <div className="text-xs text-foreground/50 mt-0.5">{p.focus}</div>
                      </RouteLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* People mega */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-foreground/80 hover:text-foreground uppercase text-sm font-medium tracking-wide">
                  Academy
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[420px] gap-1 p-4 bg-popover border border-border rounded-xl shadow-xl">
                    {[
                      { label: "Instructors", desc: "Meet the coaching team", to: { name: "instructors" as const } },
                      { label: "Kids & Youth", desc: "Mini Muscles · Junior Warriors · Teens", to: { name: "kids" as const } },
                      { label: "Events & Seminars", desc: "Train with the masters", to: { name: "events" as const } },
                      { label: "History & Lineage", desc: "Since 1989 · Inosanto lineage", to: { name: "history" as const } },
                      { label: "Blog & News", desc: "Training tips & academy stories", to: { name: "blog" as const } },
                      { label: "Gallery", desc: "Training, events & academy photos", to: { name: "gallery" as const } },
                      { label: "Online Shop", desc: "Apparel, equipment & media", to: { name: "shop" as const } },
                    ].map((item) => (
                      <RouteLink
                        key={item.label}
                        to={item.to}
                        className="block rounded-lg p-3 hover:bg-secondary/60 transition-colors group"
                      >
                        <div className="font-display font-bold uppercase text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </div>
                        <div className="text-xs text-foreground/50 mt-0.5">{item.desc}</div>
                      </RouteLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Direct links */}
              <NavigationMenuItem>
                <RouteLink to={{ name: "timetable" }} className={navigationMenuTriggerStyle() + " bg-transparent text-foreground/80 hover:text-foreground uppercase text-sm font-medium tracking-wide"}>
                  Timetable
                </RouteLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#contact" className={navigationMenuTriggerStyle() + " bg-transparent text-foreground/80 hover:text-foreground uppercase text-sm font-medium tracking-wide"}>
                  Contact
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href={siteConfig.phoneHref}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">{siteConfig.phone}</span>
            </a>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground hover:text-primary"
              onClick={openCart}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button asChild size="sm" className="hidden sm:inline-flex bg-primary hover:bg-primary/90">
              <a href="#contact">Book Free Trial</a>
            </Button>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-foreground" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-background border-l-border p-0 overflow-y-auto">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between p-5 border-b border-border">
                    <span className="font-display text-lg font-bold uppercase tracking-wide">Menu</span>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" aria-label="Close menu">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2">
                    <div className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                      Training
                    </div>
                    {programLinks.map((p) => (
                      <SheetClose asChild key={p.slug}>
                        <RouteLink
                          to={{ name: "program", slug: p.slug }}
                          className="block px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-secondary/60 rounded-md transition-colors"
                        >
                          {p.name}
                        </RouteLink>
                      </SheetClose>
                    ))}
                    <div className="px-4 pt-4 pb-1 text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                      Academy
                    </div>
                    {[
                      { label: "Instructors", to: { name: "instructors" as const } },
                      { label: "Kids & Youth", to: { name: "kids" as const } },
                      { label: "Events & Seminars", to: { name: "events" as const } },
                      { label: "History & Lineage", to: { name: "history" as const } },
                      { label: "Blog & News", to: { name: "blog" as const } },
                      { label: "Gallery", to: { name: "gallery" as const } },
                      { label: "Online Shop", to: { name: "shop" as const } },
                      { label: "Timetable", to: { name: "timetable" as const } },
                    ].map((item) => (
                      <SheetClose asChild key={item.label}>
                        <RouteLink
                          to={item.to}
                          className="block px-4 py-2.5 text-sm font-medium text-foreground/90 hover:bg-secondary/60 rounded-md transition-colors"
                        >
                          {item.label}
                        </RouteLink>
                      </SheetClose>
                    ))}
                  </div>
                  <div className="p-4 border-t border-border space-y-3">
                    <a href={siteConfig.phoneHref} className="flex items-center gap-2 text-sm text-foreground/80">
                      <Phone className="h-4 w-4 text-primary" />
                      {siteConfig.phone}
                    </a>
                    <SheetClose asChild>
                      <Button asChild className="w-full bg-primary hover:bg-primary/90">
                        <a href="#contact">Book Free Trial</a>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
