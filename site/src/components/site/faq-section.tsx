"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((res) => setFaqs(res.ok ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="faq" className="relative py-20 lg:py-28 bg-secondary/20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Questions &amp; Answers
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
            Got <span className="text-gradient-crimson">questions?</span>
          </h2>
          <p className="mt-4 text-foreground/70">
            Everything you need to know before your first class. Still unsure?
            Just give us a call — we love talking martial arts.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${i}`}
                  className="border-b border-border/60 last:border-b-0 px-5"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5 group">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5 group-hover:text-accent transition-colors" />
                      <span className="font-medium text-foreground">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 leading-relaxed pb-5 pl-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Still have questions CTA */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-primary/10 via-card to-card border border-border/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <MessageCircleQuestion className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Still have questions?</h3>
              <p className="text-sm text-foreground/60">Our team is happy to help — reach out anytime.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:+61733939329"
              className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2 transition-colors"
            >
              Call (07) 3393 9329
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-md border border-border hover:border-accent/40 text-foreground text-sm font-semibold px-4 py-2 transition-colors"
            >
              Send a message
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
