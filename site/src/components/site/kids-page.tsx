"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Baby,
  Shield,
  Dumbbell,
  Heart,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  Calendar,
  Sparkles,
  Trophy,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { RouteLink } from "@/lib/router";
import { SectionHeading } from "@/components/site/section-heading";
import type { ClassScheduleT, FaqT } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

const ageGroups = [
  {
    name: "Mini Muscles",
    ages: "Ages 5–8",
    desc: "Foundational movement, play-based martial arts and coordination. Builds confidence, discipline and motor skills in a fun, safe environment.",
    image: "/images/program-kids.jpg",
    icon: Baby,
    accent: "from-pink-500/20 to-transparent",
    features: ["Basic strikes & blocks", "Balance & coordination games", "Anti-bullying basics", "Fit Play & BeastFit Kids"],
  },
  {
    name: "Junior Warriors",
    ages: "Ages 9–12",
    desc: "Structured martial arts training drawing from Muay Thai, BJJ and self-defence. More technical depth while keeping it engaging.",
    image: "/images/art-muay-thai.jpg",
    icon: Shield,
    accent: "from-primary/20 to-transparent",
    features: ["Muay Thai technique", "BJJ escapes & control", "Sparring intro (optional)", "Character development"],
  },
  {
    name: "Teens Cross-Train",
    ages: "Ages 13–17",
    desc: "Teens transition into adult classes with age-appropriate coaching. Full access to all six disciplines and the strength gym.",
    image: "/images/program-strength.jpg",
    icon: Dumbbell,
    accent: "from-accent/20 to-transparent",
    features: ["All adult disciplines", "Progressive Strength access", "Leadership mentorship", "Competition pathway"],
  },
];

const benefits = [
  { icon: Shield, title: "Real self-defence", text: "Practical techniques to escape holds, grabs and bullying situations." },
  { icon: Heart, title: "Confidence & discipline", text: "Structured progression builds focus, respect and self-belief." },
  { icon: Dumbbell, title: "Strength & coordination", text: "Age-appropriate physical development through play and training." },
  { icon: Users, title: "Social skills", text: "Training with peers builds teamwork, communication and friendships." },
  { icon: Trophy, title: "Achievement & goals", text: "Belt progression and milestones give kids tangible goals to work toward." },
  { icon: Sparkles, title: "Fun & engagement", text: "We keep it enjoyable — kids learn best when they're having fun." },
];

const parentInfo = [
  { icon: Calendar, title: "When", text: "Wed 4:30pm, Fri 5:30pm, Sat 12pm. First class is free." },
  { icon: Clock, title: "Duration", text: "60-minute classes, age-grouped for safety and engagement." },
  { icon: CheckCircle2, title: "What to bring", text: "Comfortable clothes and a water bottle. We provide everything else." },
  { icon: Users, title: "Class size", text: "Max 15 kids per class for quality attention from our coaches." },
];

export function KidsPage() {
  const [classes, setClasses] = useState<ClassScheduleT[]>([]);
  const [faqs, setFaqs] = useState<FaqT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/classes").then((r) => r.json()),
      fetch("/api/faqs?category=kids").then((r) => r.json()),
    ])
      .then(([classesRes, faqsRes]) => {
        if (classesRes.ok) {
          setClasses(classesRes.data.filter((c: ClassScheduleT) => c.level === "Kids"));
        }
        if (faqsRes.ok) setFaqs(faqsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kidsFaqs = faqs.length > 0 ? faqs : [
    { id: "k1", question: "What age can my child start?", answer: "Our Mini Muscles program welcomes children from age 5. We group kids by age and developmental stage to ensure everyone trains safely and appropriately.", category: "kids", order: 1 },
    { id: "k2", question: "Is martial arts safe for kids?", answer: "Absolutely. Safety is our first priority. All classes are supervised by certified instructors, techniques are taught progressively, and sparring is optional and closely controlled. Kids classes focus on fundamentals, coordination and fun.", category: "kids", order: 2 },
    { id: "k3", question: "Will martial arts make my child aggressive?", answer: "Quite the opposite. Martial arts teaches respect, discipline and emotional control. Our kids learn that their skills are for self-defence and never for bullying. We see confidence and calm, not aggression.", category: "kids", order: 3 },
    { id: "k4", question: "Do parents stay and watch?", answer: "Yes! We have a viewing area where parents are welcome to stay and watch. Many parents enjoy seeing their child's progress. Some prefer to drop off — both are completely fine.", category: "kids", order: 4 },
    { id: "k5", question: "What does it cost?", answer: "Kids memberships start from $35/week for unlimited Mini Muscles classes. Family plans are available if parents train too. Sibling discounts apply. Book a free trial and we'll find the right option for your family.", category: "kids", order: 5 },
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/program-kids.jpg" alt="Kids martial arts class" fill sizes="100vw" className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Kids & Youth" }]} className="mb-6" />
          <div className="max-w-3xl">
            <Badge className="bg-pink-500/15 text-pink-400 border border-pink-500/30 mb-4 uppercase tracking-wide">
              <Baby className="h-3 w-3 mr-1" />
              Mini Muscles · Junior Warriors · Teens
            </Badge>
            <h1 className="font-display text-5xl sm:text-6xl font-bold uppercase leading-[0.95]">
              Build <span className="text-gradient-gold">confident kids</span>
              <br />
              on the mat
            </h1>
            <p className="mt-6 text-lg text-foreground/75 leading-relaxed">
              Mini Muscles offers a fun yet disciplined environment where children
              develop self-defence skills, strength, motor control, balance and
              coordination. Our lessons draw from Muay Thai, BJJ, basic self-defence
              and play-based movement — building confident, capable kids.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-600/90 group">
                <a href="#contact">Book a free kids trial <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-foreground/20 bg-background/30 backdrop-blur-sm hover:bg-background/50">
                <a href="#kids-timetable">View class times</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Age groups */}
      <section className="py-16 lg:py-20 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Age-Appropriate Programs"
            title={<>Three stages of <span className="text-gradient-gold">growing up</span></>}
            description="Every child develops at their own pace. Our programs are grouped by age and developmental stage so your child always trains with the right level of challenge and support."
          />
          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            {ageGroups.map((g) => (
              <div key={g.name} className="group relative overflow-hidden rounded-2xl bg-card border border-border/60 transition-all duration-300 hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={g.image} alt={g.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${g.accent}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-background/90 backdrop-blur-sm border border-pink-500/30 text-pink-400 shadow-lg">
                      <g.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">{g.ages}</div>
                    <h3 className="mt-1 font-display text-2xl font-bold uppercase">{g.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-foreground/70 leading-relaxed">{g.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {g.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="h-4 w-4 text-pink-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Why Parents Choose PMAAI"
            title={<>More than martial arts — <span className="text-gradient-crimson">life skills</span></>}
            description="The skills your child builds on the mat transfer to school, home and life. Here's what parents tell us they see."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="group rounded-xl border border-border/60 bg-card p-6 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/5 transition-all">
                <div className="h-12 w-12 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 text-pink-400 group-hover:scale-110 transition-transform">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">{b.title}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent info */}
      <section className="py-16 lg:py-20 bg-secondary/20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading align="center" eyebrow="Good To Know" title={<>What parents <span className="text-gradient-gold">need to know</span></>} />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {parentInfo.map((p) => (
              <div key={p.title} className="rounded-xl border border-border/60 bg-card p-5 text-center">
                <div className="inline-flex h-11 w-11 rounded-lg bg-pink-500/10 border border-pink-500/20 items-center justify-center text-pink-400 mb-3">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground mb-1">{p.title}</h3>
                <p className="text-xs text-foreground/60 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timetable */}
      <section id="kids-timetable" className="py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading align="center" eyebrow="Class Times" title={<>Kids <span className="text-gradient-crimson">weekly schedule</span></>} />
          {loading ? (
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
          ) : classes.length === 0 ? (
            <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-foreground/50">
              No kids classes scheduled this week. Contact us for the latest timetable.
            </div>
          ) : (
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {classes.map((c) => (
                <div key={c.id} className="rounded-xl bg-card border border-border/60 p-5 border-l-4 border-l-pink-500">
                  <div className="text-xs uppercase tracking-wider text-pink-400 font-semibold">{c.day}</div>
                  <div className="mt-1 font-display text-xl font-bold">{c.startTime} – {c.endTime}</div>
                  <div className="mt-2 text-sm text-foreground/70">{c.artName}</div>
                  <div className="mt-1 text-xs text-foreground/50">with {c.instructor} · {c.room}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-secondary/20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading align="center" eyebrow="Parent Questions" title={<>You asked, <span className="text-gradient-gold">we answered</span></>} />
          <div className="mt-10 rounded-2xl border border-border/60 bg-card overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {kidsFaqs.map((faq, i) => (
                <AccordionItem key={faq.id} value={`item-${i}`} className="border-b border-border/60 last:border-b-0 px-5">
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium text-foreground">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/cta-bg.jpg" alt="" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background" />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-accent text-accent" />
            ))}
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase leading-tight">
            Your child&apos;s first class is <span className="text-gradient-crimson">free</span>
          </h2>
          <p className="mt-4 text-foreground/75">
            Bring them along, meet the coaches, and see the smiles. No commitment,
            no gear needed — just comfortable clothes and a water bottle.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-600/90 group">
              <a href="#contact">Book a free kids trial <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
