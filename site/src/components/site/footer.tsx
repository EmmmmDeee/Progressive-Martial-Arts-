"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowRight, Loader2, Send, CheckCircle2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/site-config";
import { toast } from "sonner";

const quickLinks = [
  { label: "About PMAAI", href: "#about" },
  { label: "Arts We Teach", href: "#arts" },
  { label: "Programs", href: "#programs" },
  { label: "Timetable", href: "#timetable" },
];

const supportLinks = [
  { label: "Instructors", href: "#instructors" },
  { label: "Online Shop", href: "#shop" },
  { label: "Seminars", href: "#seminars" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!res.ok) throw new Error("failed");
      setSubscribed(true);
      toast.success("You're in! Welcome to the PMAAI community.");
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } catch {
      toast.error("Couldn't subscribe. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="mt-auto relative bg-background border-t border-border/60">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid gap-10 lg:gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="#top" className="flex items-center gap-3 group">
              <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Flame className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold tracking-wide uppercase">
                  Progressive
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-accent">
                  Martial Arts · Brisbane
                </span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-foreground/65 leading-relaxed max-w-sm">
              Brisbane&apos;s premier martial arts academy under the Inosanto
              lineage. Stand-up, weaponry and ground fighting — for every body,
              every age, every goal.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <div className="text-xs uppercase tracking-wider text-foreground/50 mb-2">
                Join the newsletter
              </div>
              {subscribed ? (
                <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 animate-fade-up">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-float" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      You&apos;re in! <PartyPopper className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div className="text-xs text-foreground/60">Seminar alerts &amp; training tips incoming.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={subscribe} className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="bg-secondary/50"
                  />
                  <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 shrink-0">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              )}
              <p className="mt-2 text-[11px] text-foreground/40">
                Seminar announcements &amp; training tips. No spam, unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-semibold mb-4">
              More
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-foreground/70 hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="text-xs uppercase tracking-[0.2em] text-foreground/50 font-semibold mb-4">
              Visit the academy
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-foreground/70">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.line2}
                  <br />
                  <span className="text-xs text-foreground/45">{siteConfig.address.postal}</span>
                </span>
              </li>
              <li>
                <a href={siteConfig.phoneHref} className="flex items-center gap-2.5 text-sm text-foreground/70 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={siteConfig.mobileHref} className="flex items-center gap-2.5 text-sm text-foreground/70 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  {siteConfig.mobile}
                </a>
              </li>
              <li>
                <a href={siteConfig.emailHref} className="flex items-center gap-2.5 text-sm text-foreground/70 hover:text-primary transition-colors break-all">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  {siteConfig.email}
                </a>
              </li>
            </ul>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
                { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
                { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-9 w-9 rounded-md border border-border/60 bg-secondary/40 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/50">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Stand-up</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>Weaponry</span>
            <span className="h-1 w-1 rounded-full bg-accent" />
            <span>Ground</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
