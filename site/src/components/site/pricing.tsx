"use client";

import { useEffect, useState } from "react";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RouteLink } from "@/lib/router";
import Link from "next/link";

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: { label: string; included: boolean }[];
  popular?: boolean;
  cta: string;
  accent?: string;
};

const plans: Plan[] = [
  {
    id: "casual",
    name: "Casual",
    price: "$30",
    period: "per class",
    description: "Drop in and train whenever suits you. No commitment.",
    cta: "Book a class",
    features: [
      { label: "Single class entry", included: true },
      { label: "Any discipline", included: true },
      { label: "Loaner equipment", included: true },
      { label: "Progressive Strength gym", included: false },
      { label: "Seminar priority access", included: false },
      { label: "Shop member discount", included: false },
    ],
  },
  {
    id: "unlimited",
    name: "Unlimited All-Arts",
    price: "$65",
    period: "per week",
    description: "Train every discipline, every day. Our most popular membership.",
    cta: "Start free trial",
    popular: true,
    accent: "primary",
    features: [
      { label: "Unlimited classes (all arts)", included: true },
      { label: "Priority seminar access", included: true },
      { label: "Progressive Strength 24/7 gym", included: true },
      { label: "10% off the PMAAI shop", included: true },
      { label: "Free grading & belt testing", included: true },
      { label: "Bring-a-friend passes", included: true },
    ],
  },
  {
    id: "single-art",
    name: "Single Art",
    price: "$45",
    period: "per week",
    description: "Commit to one discipline and go deep. Perfect for focused progress.",
    cta: "Choose your art",
    features: [
      { label: "Unlimited classes in one art", included: true },
      { label: "Progressive Strength gym", included: true },
      { label: "5% off the PMAAI shop", included: true },
      { label: "Seminar priority access", included: false },
      { label: "Free belt testing", included: true },
      { label: "Cross-discipline drop-ins", included: false },
    ],
  },
  {
    id: "family",
    name: "Family",
    price: "$120",
    period: "per week",
    description: "Train together. Up to 4 family members including Mini Muscles.",
    cta: "Enquire family plan",
    features: [
      { label: "Up to 4 family members", included: true },
      { label: "Includes Mini Muscles kids", included: true },
      { label: "Unlimited classes (all arts)", included: true },
      { label: "Progressive Strength gym", included: true },
      { label: "15% off the PMAAI shop", included: true },
      { label: "Priority seminar access", included: true },
    ],
  },
];

export function Pricing() {
  const [billing, setBilling] = useState<"week"|"month">("week");

  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-stripes opacity-30" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Membership
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
            Plans that fit <span className="text-gradient-gold">your journey</span>
          </h2>
          <p className="mt-4 text-foreground/70">
            No lock-in contracts. No joining fees. Cancel anytime. Every membership
            starts with a free trial class.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "gradient-border border-transparent bg-gradient-to-b from-primary/10 to-card shadow-2xl shadow-primary/20 lg:scale-105"
                  : "border-border/60 bg-card hover:border-accent/40 hover:shadow-xl hover:shadow-black/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground shadow-lg px-3 py-1 uppercase tracking-wide text-[10px] flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most popular
                  </Badge>
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight">{plan.name}</h3>
                <p className="text-xs text-foreground/55 mt-1 leading-relaxed">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-display text-4xl font-bold text-gradient-crimson">{plan.price}</span>
                <span className="text-xs text-foreground/50">{plan.period}</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2 text-sm">
                    {f.included ? (
                      <span className="mt-0.5 h-4 w-4 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-accent" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="mt-0.5 h-4 w-4 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <X className="h-2.5 w-2.5 text-foreground/30" strokeWidth={2} />
                      </span>
                    )}
                    <span className={f.included ? "text-foreground/80" : "text-foreground/40 line-through"}>
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.popular ? "default" : "outline"}
                className={`w-full group ${plan.popular ? "bg-primary hover:bg-primary/90" : "border-primary/30 text-primary hover:bg-primary/10"}`}
              >
                <a href="#contact">
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Concession note */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-foreground/60">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-accent/30 text-accent">Concession</Badge>
            <span>10% off for students, seniors & pensioners</span>
          </div>
          <span className="hidden sm:inline h-1 w-1 rounded-full bg-foreground/30" />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary">No lock-in</Badge>
            <span>Cancel anytime, no questions asked</span>
          </div>
        </div>
      </div>
    </section>
  );
}
